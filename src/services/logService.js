// src/services/logService.js


import storageService
  from "./storageService.js";



class LogService {


  constructor(){

    this.storageKey =
      "system_logs";


    this.logs =
      storageService.load(
        this.storageKey,
        []
      );

  }





  create(
    type,
    message,
    data = {}
  ){

    const log = {

      id:
        Date.now(),

      type,

      message,

      data,

      time:
        new Date().toISOString()

    };


    this.logs.push(
      log
    );


    this.save();


    return log;

  }





  info(
    message,
    data = {}
  ){

    return this.create(
      "info",
      message,
      data
    );

  }





  warning(
    message,
    data = {}
  ){

    return this.create(
      "warning",
      message,
      data
    );

  }





  error(
    message,
    data = {}
  ){

    return this.create(
      "error",
      message,
      data
    );

  }





  getLogs(){

    return [
      ...this.logs
    ];

  }





  getByType(type){

    return this.logs.filter(
      log =>
        log.type === type
    );

  }





  clearLogs(){

    this.logs = [];

    this.save();

    return true;

  }





  save(){

    storageService.save(
      this.storageKey,
      this.logs
    );

  }


}





export const logService =
  new LogService();



export default logService;
