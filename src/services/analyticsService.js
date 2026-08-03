// src/services/analyticsService.js

import storageService
  from "./storageService.js";


class AnalyticsService {


  constructor() {

    this.storageKey =
      "analytics_events";

  }



  track(
    event,
    data = {}
  ) {


    if (!event) {

      throw new Error(
        "ANALYTICS_EVENT_REQUIRED"
      );

    }



    const events =
      this.getEvents();



    const record = {


      id:
        crypto.randomUUID(),


      event,


      data,


      createdAt:
        new Date().toISOString()

    };



    events.push(
      record
    );



    this.saveEvents(
      events
    );



    return record;

  }



  getEvents() {


    return storageService.load(

      this.storageKey,

      []

    );

  }



  getEventsByType(type) {


    if (!type) {

      return [];

    }


    return this.getEvents()

      .filter(

        item =>
          item.event === type

      );

  }



  count() {


    return this.getEvents().length;

  }



  getStats() {


    const events =
      this.getEvents();



    return {

      total:
        events.length,


      generatedAt:
        new Date().toISOString()

    };

  }



  clear() {


    return storageService.remove(

      this.storageKey

    );

  }



  saveEvents(data) {


    return storageService.save(

      this.storageKey,

      data

    );

  }



  farmReport(farms = []) {


    return {

      totalFarms:
        farms.length,


      generatedAt:
        new Date().toISOString()

    };

  }



  cropReport(crops = []) {


    return {

      totalCrops:
        crops.length,


      generatedAt:
        new Date().toISOString()

    };

  }


}


export default Object.freeze(
  new AnalyticsService()
);
