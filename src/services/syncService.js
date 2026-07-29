// src/services/syncService.js


import storageService
  from "./storageService.js";



class SyncService {


  constructor(){

    this.lastSyncKey =
      "last_sync";

    this.syncLogKey =
      "sync_history";

  }





  async upload(data){


    try {


      // مكان الربط مع API مستقبلاً

      const result = {

        success:true,

        data,

        message:
        "Upload completed."

      };


      this.saveSyncTime();


      return result;


    } catch(error){


      return {

        success:false,

        message:
        error.message

      };


    }

  }





  async download(){


    try {


      return {

        success:true,

        data:null,

        message:
        "Download completed."

      };


    } catch(error){


      return {

        success:false,

        message:
        error.message

      };

    }


  }





  async sync(localData){


    try {


      const uploaded =
        await this.upload(
          localData
        );


      this.addLog({

        type:"sync",

        success:
          uploaded.success

      });



      return {

        success:true,

        data:localData,

        syncedAt:
          new Date().toISOString()

      };


    } catch(error){


      return {

        success:false,

        message:
          error.message

      };


    }

  }





  async status(){


    return {

      online:
        navigator.onLine,

      lastSync:
        storageService.load(
          this.lastSyncKey,
          null
        )

    };

  }





  saveSyncTime(){


    storageService.save(

      this.lastSyncKey,

      new Date().toISOString()

    );

  }





  addLog(item){


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





  getHistory(){


    return storageService.load(
      this.syncLogKey,
      []
    );

  }


}





export const syncService =
  new SyncService();



export default syncService;
