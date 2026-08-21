// src/services/notificationService.js


import {
  storageService
}
from "../storage";



class NotificationService {



  constructor() {


    this.storageKey =
      "notifications";


    this.version =
      "3.0.0";


  }





  async add(data) {



    this.validateData(
      data
    );



    const notifications =
      await this.getAll();



    const notification = {



      id:
        this.generateId(),



      type:
        data.type ||
        "system",



      priority:
        data.priority ||
        "normal",



      ...data,



      read:
        false,



      version:
        this.version,



      createdAt:
        new Date().toISOString()



    };



    notifications.push(
      notification
    );



    await this.save(
      notifications
    );



    return notification;


  }





  async getAll() {


    return storageService.load(

      this.storageKey,

      []

    );


  }





  async getUnread() {


    const notifications =
      await this.getAll();



    return notifications.filter(

      item =>

      !item.read

    );


  }





  async markAsRead(id) {



    const notifications =
      await this.getAll();



    const index =
      notifications.findIndex(

        item =>

        String(item.id) === String(id)

      );



    if (
      index === -1
    ) {

      return null;

    }



    notifications[index] = {


      ...notifications[index],


      read:
        true,


      readAt:
        new Date().toISOString()


    };



    await this.save(
      notifications
    );



    return notifications[index];


  }





  async remove(id) {



    const notifications =
      await this.getAll();



    const filtered =
      notifications.filter(

        item =>

        String(item.id) !== String(id)

      );



    if (
      filtered.length === notifications.length
    ) {

      return false;

    }



    await this.save(
      filtered
    );


    return true;


  }





  async clear() {


    return storageService.remove(

      this.storageKey

    );


  }





  async count() {


    const notifications =
      await this.getAll();



    return notifications.length;


  }





  async save(data) {


    return storageService.save(

      this.storageKey,

      data

    );


  }





  validateData(data) {


    if (

      !data ||

      typeof data !== "object"

    ) {


      throw new Error(

        "NOTIFICATION_DATA_REQUIRED"

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

  new NotificationService()

);
