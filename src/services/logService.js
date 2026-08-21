// src/services/logService.js


import {
  storageService
}
from "../storage";



class LogService {



  constructor() {


    this.storageKey =
      "system_logs";


    this.version =
      "3.0.0";


  }





  async create(
    type,
    message,
    data = {}
  ) {


    this.validate(

      type,

      message

    );



    const logs =
      await this.getLogs();



    const log = {



      id:
        this.generateId(),



      type,



      message,



      data,



      version:
        this.version,



      createdAt:
        new Date().toISOString()


    };



    logs.push(
      log
    );



    await this.save(
      logs
    );



    return log;


  }





  async info(
    message,
    data = {}
  ) {


    return this.create(

      "info",

      message,

      data

    );


  }





  async warning(
    message,

    data = {}
  ) {


    return this.create(

      "warning",

      message,

      data

    );


  }





  async error(
    message,

    data = {}
  ) {


    return this.create(

      "error",

      message,

      data

    );


  }





  async debug(
    message,

    data = {}
  ) {


    return this.create(

      "debug",

      message,

      data

    );


  }





  async getLogs() {


    return storageService.load(

      this.storageKey,

      []

    );


  }





  async getByType(type) {


    if (!type) {

      return [];

    }



    const logs =
      await this.getLogs();



    return logs.filter(

      log =>

      log.type === type

    );


  }





  async count() {


    const logs =
      await this.getLogs();



    return logs.length;


  }





  async clear() {


    return storageService.remove(

      this.storageKey

    );


  }





  async save(data) {


    return storageService.save(

      this.storageKey,

      data

    );


  }





  validate(
    type,
    message
  ) {


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

  new LogService()

);
