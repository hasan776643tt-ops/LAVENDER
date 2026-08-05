// src/services/backupService.js


import storageService
  from "./storageService.js";


import {
  createError
}
from "../utils/errorHandler.js";



class BackupService {



  constructor() {


    this.version =
      "3.0.0";


    this.key =
      "lavender_backups";


  }





  async createBackup(data) {


    this.validateData(
      data
    );



    const backup = {


      id:
        this.generateId(),


      version:
        this.version,


      createdAt:
        new Date().toISOString(),


      records:
        this.countRecords(
          data
        ),


      data


    };



    const backups =
      await this.getAll();



    backups.push(
      backup
    );



    await storageService.save(

      this.key,

      backups

    );



    return backup;


  }





  async restore(id = null) {


    const backup =


      id

      ?

      (

        await this.getAll()

      )

      .find(

        item =>

          String(item.id) === String(id)

      )

      :

      await this.getLast();



    if (
      !this.validate(backup)
    ) {


      throw createError(

        "Backup not found",

        "BACKUP_NOT_FOUND"

      );


    }



    return backup.data;


  }





  async getAll() {


    return storageService.load(

      this.key,

      []

    );


  }





  async getLast() {


    const backups =
      await this.getAll();



    return (

      backups[

        backups.length - 1

      ]

      ||

      null

    );


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const backups =
      await this.getAll();



    const filtered =
      backups.filter(

        item =>

          String(item.id) !== String(id)

      );



    if (

      filtered.length ===

      backups.length

    ) {


      return false;


    }



    await storageService.save(

      this.key,

      filtered

    );



    return true;


  }





  async clear() {


    return storageService.remove(

      this.key

    );


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





  validateData(data) {


    if (

      data === undefined ||

      data === null

    ) {


      throw createError(

        "Backup data is required",

        "BACKUP_DATA_REQUIRED"

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





  getVersion() {


    return this.version;


  }



}



export default Object.freeze(

  new BackupService()

);
