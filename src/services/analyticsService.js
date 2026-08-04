// src/services/analyticsService.js


import storageService
  from "./storageService.js";



class AnalyticsService {


  constructor() {

    this.storageKey =
      "analytics_events";

    this.version =
      "3.0.0";

  }



  async track(
    event,
    data = {}
  ) {


    this.validateEvent(
      event
    );


    const events =
      await this.getEvents();



    const record = {


      id:
        this.generateId(),


      event,


      data,


      version:
        this.version,


      createdAt:
        new Date().toISOString()

    };



    events.push(
      record
    );



    await this.saveEvents(
      events
    );



    return record;

  }



  async getEvents() {


    return storageService.load(

      this.storageKey,

      []

    );

  }



  async getEventsByType(type) {


    if (!type) {

      return [];

    }



    const events =
      await this.getEvents();



    return events.filter(

      item =>

      item.event === type

    );

  }



  async count() {


    const events =
      await this.getEvents();



    return events.length;

  }



  async getStats() {


    const events =
      await this.getEvents();



    return {


      total:
        events.length,


      version:
        this.version,


      generatedAt:
        new Date().toISOString()

    };

  }



  async clear() {


    return storageService.remove(

      this.storageKey

    );

  }



  async saveEvents(data) {


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



  validateEvent(event) {


    if (
      !event ||
      typeof event !== "string"
    ) {

      throw new Error(
        "ANALYTICS_EVENT_REQUIRED"
      );

    }


    return true;

  }



  generateId() {


    if (
      globalThis.crypto?.randomUUID
    ) {

      return globalThis.crypto.randomUUID();

    }



    return (

      Date.now().toString()

      +

      Math.random()
        .toString(36)
        .substring(2)

    );

  }


}



export default Object.freeze(
  new AnalyticsService()
);
