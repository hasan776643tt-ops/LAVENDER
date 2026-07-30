// src/services/backupService.js


import storageService
  from "./storageService.js";



class BackupService {


  constructor() {

    this.version =
      "3.0.0";


    this.key =
      "lavender_backups";

  }




  createBackup(data) {

    try {


      if (data === undefined) {

        throw new Error(
          "Backup data is required"
        );

      }



      const backup = {

        id:
          Date.now(),


        version:
          this.version,


        createdAt:
          new Date().toISOString(),


        records:
          this.countRecords(data),


        data

      };



      const backups =
        this.getAll();



      backups.push(
        backup
      );



      storageService.save(
        this.key,
        backups
      );



      return backup;



    } catch (error) {

      throw new Error(
        `BackupService create failed: ${error.message}`
      );

    }

  }





  restore(id = null) {

    try {


      const backup =
        id
        ? this.getAll().find(
            item =>
              item.id === id
          )
        : this.getLast();



      if (!this.validate(backup)) {

        throw new Error(
          "Invalid backup"
        );

      }



      return backup.data;



    } catch (error) {

      throw new Error(
        `BackupService restore failed: ${error.message}`
      );

    }

  }





  getAll() {


    return storageService.load(
      this.key,
      []
    );


  }





  getLast() {


    const backups =
      this.getAll();



    return (
      backups[
        backups.length - 1
      ] || null
    );


  }





  delete(id) {


    if (!id) {

      throw new Error(
        "Backup ID is required"
      );

    }



    const backups =
      this.getAll();



    const filtered =
      backups.filter(
        item =>
          item.id !== id
      );



    storageService.save(
      this.key,
      filtered
    );



    return true;


  }





  clear() {


    storageService.remove(
      this.key
    );


    return true;


  }





  validate(backup) {


    return Boolean(

      backup &&

      backup.id &&

      backup.version &&

      backup.createdAt &&

      backup.data !== undefined

    );


  }





  countRecords(data) {


    if (Array.isArray(data)) {

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





  getVersion() {


    return this.version;


  }


}



export default Object.freeze(
  new BackupService()
);
