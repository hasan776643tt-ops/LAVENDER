// src/services/analyticsService.js


import storageService
  from "./storageService.js";



class AnalyticsService {


  constructor(){

    this.storageKey =
      "analytics_events";

    this.events =
      this.loadEvents();

  }





  track(
    event,
    data = {}
  ){

    const record = {

      id:
        Date.now(),

      event,

      data,

      time:
        new Date().toISOString()

    };


    this.events.push(
      record
    );


    this.saveEvents();


    return record;

  }





  getEvents(){

    return [
      ...this.events
    ];

  }





  getEventsByType(type){

    return this.events.filter(
      item =>
        item.event === type
    );

  }





  count(){

    return this.events.length;

  }





  clear(){

    this.events = [];

    this.saveEvents();

  }





  saveEvents(){

    storageService.save(
      this.storageKey,
      this.events
    );

  }





  loadEvents(){

    return storageService.load(
      this.storageKey,
      []
    );

  }





  farmReport(farms = []){

    return {

      totalFarms:
        farms.length,

      generatedAt:
        new Date().toISOString()

    };

  }





  cropReport(crops = []){

    return {

      totalCrops:
        crops.length,

      generatedAt:
        new Date().toISOString()

    };

  }


}





export const analyticsService =
  new AnalyticsService();



export default analyticsService;
