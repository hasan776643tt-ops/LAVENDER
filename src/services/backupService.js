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


    if (data === undefined) {

      throw new Error(
        "BACKUP_DATA_REQUIRED"
      );

    }


    const backup = {


      id:
        crypto.randomUUID(),


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

  }



  restore(id = null) {


    const backup =
      id
      ? this.getAll()
          .find(
            item =>
              String(item.id) === String(id)
          )
      : this.getLast();



    if (
      !this.validate(backup)
    ) {

      throw new Error(
        "BACKUP_NOT_FOUND"
      );

    }



    return backup.data;

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
      ]
      ||
      null
    );

  }



  delete(id) {


    if (!id) {

      return false;

    }



    const backups =
      this.getAll();



    const filtered =
      backups.filter(
        item =>
          String(item.id) !== String(id)
      );



    if (
      filtered.length === backups.length
    ) {

      return false;

    }



    storageService.save(
      this.key,
      filtered
    );



    return true;

  }



  clear() {


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



  getVersion() {

    return this.version;

  }


}


export default Object.freeze(
  new BackupService()
);
