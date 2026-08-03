// src/services/notificationService.js

import storageService
  from "./storageService.js";


class NotificationService {


  constructor() {

    this.storageKey =
      "notifications";

  }



  add(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "NOTIFICATION_DATA_REQUIRED"
      );

    }



    const notifications =
      this.getAll();



    const notification = {


      id:
        crypto.randomUUID(),


      ...data,


      read:
        false,


      createdAt:
        new Date().toISOString()

    };



    notifications.push(
      notification
    );



    this.save(
      notifications
    );



    return notification;

  }



  getAll() {


    return storageService.load(

      this.storageKey,

      []

    );

  }



  getUnread() {


    return this.getAll()

      .filter(
        item =>
          !item.read
      );

  }



  markAsRead(id) {


    const notifications =
      this.getAll();



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
        true

    };



    this.save(
      notifications
    );



    return notifications[index];

  }



  remove(id) {


    const notifications =
      this.getAll();



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



    this.save(
      filtered
    );


    return true;

  }



  clear() {


    return storageService.remove(
      this.storageKey
    );

  }



  count() {


    return this.getAll().length;

  }



  save(data) {


    return storageService.save(

      this.storageKey,

      data

    );

  }


}



export default Object.freeze(
  new NotificationService()
);
