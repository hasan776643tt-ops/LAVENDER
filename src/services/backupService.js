// src/services/backupService.js


import storageService
  from "./storageService.js";



class BackupService {


  constructor(){

    this.version =
      "1.0.0";

    this.key =
      "lavender_backup";

  }





  createBackup(data){


    const backup = {

      id:
        Date.now(),

      createdAt:
        new Date().toISOString(),

      version:
        this.version,

      data

    };



    storageService.save(
      this.key,
      backup
    );



    return backup;

  }





  restoreBackup(backup = null){


    const source =
      backup ||
      storageService.load(
        this.key,
        null
      );



    if(
      !source ||
      !source.data
    ){

      return null;

    }



    return source.data;

  }





  validateBackup(backup){


    return Boolean(

      backup &&

      backup.version &&

      backup.createdAt &&

      backup.data !== undefined

    );

  }





  getLastBackup(){


    return storageService.load(
      this.key,
      null
    );

  }





  deleteBackup(){


    storageService.remove(
      this.key
    );

  }





  getVersion(){

    return this.version;

  }


}





export const backupService =
  new BackupService();



export default backupService;
