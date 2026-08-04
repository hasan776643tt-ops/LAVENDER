// src/services/syncService.js


import storageService
  from "./storageService.js";



class SyncService {



  constructor() {


    this.lastSyncKey =
      "sync:last";


    this.historyKey =
      "sync:history";


    this.version =
      "3.0.0";


  }





  async upload(data) {


    this.validateData(
      data
    );



    const syncTime =
      new Date().toISOString();



    this.saveSyncTime(
      syncTime
    );



    return {


      success:
        true,


      type:
        "upload",


      data,


      syncedAt:
        syncTime


    };


  }





  async download() {


    return {


      success:
        true,


      type:
        "download",


      data:
        null,


      syncedAt:
        new Date().toISOString()


    };


  }





  async sync(data) {


    const result =
      await this.upload(
        data
      );



    await this.addHistory({


      type:
        "sync",


      success:
        result.success,


      records:
        this.countRecords(data)


    });



    return result;


  }





  status() {


    return {


      online:

        typeof navigator !== "undefined"

        ?

        navigator.onLine

        :

        false,



      lastSync:

        storageService.load(

          this.lastSyncKey,

          null

        )


    };


  }





  saveSyncTime(time) {


    storageService.save(

      this.lastSyncKey,

      time

    );


  }





  async addHistory(item) {


    const history =
      this.getHistory();



    history.push({



      id:
        this.generateId(),



      version:
        this.version,



      ...item,



      createdAt:
        new Date().toISOString()


    });



    storageService.save(

      this.historyKey,

      history

    );


  }





  getHistory() {


    return storageService.load(

      this.historyKey,

      []

    );


  }





  clearHistory() {


    return storageService.remove(

      this.historyKey

    );


  }





  validateData(data) {


    if (
      data === undefined
    ) {

      throw new Error(

        "SYNC_DATA_REQUIRED"

      );

    }


    return true;


  }





  countRecords(data) {


    if (
      Array.isArray(data)
    ) {

      return data.length;

    }



    if (
      typeof data === "object" &&
      data !== null
    ) {

      return Object.keys(data).length;

    }



    return 1;


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

  new SyncService()

);
