// src/services/backupService.js


import storageService
  from "./storageService.js";



class BackupService {


  constructor(){

    this.version =
      "2.0.0";


    this.key =
      "lavender_backups";

  }





  createBackup(data){


    try {


      const backup = {


        id:
          Date.now(),


        createdAt:
          new Date().toISOString(),


        version:
          this.version,


        records:
          Array.isArray(data)
          ? data.length
          : Object.keys(data || {}).length,


        data


      };



      const backups =
        this.getBackups();



      backups.push(
        backup
      );



      storageService.save(
        this.key,
        backups
      );



      return backup;



    } catch(error){


      console.error(
        "Backup Error:",
        error
      );


      return null;


    }

  }





  restoreBackup(id = null){


    const backups =
      this.getBackups();



    let backup;



    if(id){

      backup =
        backups.find(
          item =>
          item.id === id
        );

    }else{


      backup =
        backups[
          backups.length - 1
        ];

    }



    if(
      !this.validateBackup(
        backup
      )
    ){

      return null;

    }



    return backup.data;


  }





  getBackups(){


    return storageService.load(
      this.key,
      []
    );


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


    const backups =
      this.getBackups();



    return backups[
      backups.length - 1
    ] || null;


  }





  deleteBackup(id){


    const backups =
      this.getBackups();



    const filtered =
      backups.filter(
        item =>
        item.id !== id
      );



    storageService.save(
      this.key,
      filtered
    );


  }





  clearAll(){


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
