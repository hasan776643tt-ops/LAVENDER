// src/services/logService.js

import storageService
  from "./storageService.js";


class LogService {



  constructor(){

    this.storageKey =
      "system_logs";

  }



  create(
    type,
    message,
    data = {}
  ){


    if (!type) {

      throw new Error(
        "LOG_TYPE_REQUIRED"
      );

    }



    if (!message) {

      throw new Error(
        "LOG_MESSAGE_REQUIRED"
      );

    }



    const logs =
      this.getLogs();



    const log = {


      id:
        crypto.randomUUID(),


      type,


      message,


      data,


      createdAt:
        new Date().toISOString()

    };



    logs.push(
      log
    );



    this.save(
      logs
    );



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


    return storageService.load(

      this.storageKey,

      []

    );

  }



  getByType(type){


    if (!type) {

      return [];

    }


    return this.getLogs()

      .filter(

        log =>
          log.type === type

      );

  }



  count(){


    return this.getLogs().length;

  }



  clear(){


    return storageService.remove(

      this.storageKey

    );

  }



  save(data){


    return storageService.save(

      this.storageKey,

      data

    );

  }


}



export default Object.freeze(
  new LogService()
);
