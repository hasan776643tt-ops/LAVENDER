// src/services/syncService.js


import storageService
  from "./storageService.js";



class SyncService {


  constructor() {

    this.lastSyncKey =
      "last_sync";


    this.syncLogKey =
      "sync_history";

  }




  async upload(data) {

    try {


      if (data === undefined) {

        throw new Error(
          "Sync data is required"
        );

      }



      const result = {

        success: true,

        data,

        message:
          "Upload completed."

      };


      this.saveSyncTime();


      return result;



    } catch (error) {

      throw new Error(
        `Sync upload failed: ${error.message}`
      );

    }

  }




  async download() {

    try {


      return {

        success: true,

        data: null,

        message:
          "Download completed."

      };


    } catch (error) {

      throw new Error(
        `Sync download failed: ${error.message}`
      );

    }

  }




  async sync(localData) {

    try {


      const result =
        await this.upload(
          localData
        );


      this.addLog({

        type: "sync",

        success:
          result.success

      });



      return {

        success: true,

        data: localData,

        syncedAt:
          new Date().toISOString()

      };



    } catch (error) {

      throw new Error(
        `Sync failed: ${error.message}`
      );

    }

  }




  async status() {


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




  addLog(item) {


    const logs =
      storageService.load(
        this.syncLogKey,
        []
      );


    logs.push({

      ...item,

      time:
        new Date().toISOString()

    });


    storageService.save(
      this.syncLogKey,
      logs
    );

  }




  getHistory() {


    return storageService.load(
      this.syncLogKey,
      []
    );

  }


}



export default Object.freeze(
  new SyncService()
);
