// src/services/syncService.js

import storageService
  from "./storageService.js";


class SyncService {


  constructor() {

    this.lastSyncKey =
      "sync:last";


    this.historyKey =
      "sync:history";

  }



  async upload(data) {


    if (data === undefined) {

      throw new Error(
        "SYNC_DATA_REQUIRED"
      );

    }


    this.saveSyncTime();



    return {

      success: true,

      data,

      syncedAt:
        new Date().toISOString()

    };

  }



  async download() {


    return {

      success: true,

      data: null,

      syncedAt:
        new Date().toISOString()

    };

  }



  async sync(data) {


    const result =
      await this.upload(
        data
      );


    this.addHistory({

      type:
        "sync",

      success:
        result.success

    });



    return result;

  }



  status() {


    return {

      online:
        typeof navigator !== "undefined"
          ? navigator.onLine
          : false,


      lastSync:
        storageService.load(
          this.lastSyncKey,
          null
        )

    };

  }



  saveSyncTime() {


    storageService.save(

      this.lastSyncKey,

      new Date().toISOString()

    );

  }



  addHistory(item) {


    const history =
      storageService.load(
        this.historyKey,
        []
      );


    history.push({

      ...item,

      id:
        crypto.randomUUID(),


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


}


export default Object.freeze(
  new SyncService()
);
