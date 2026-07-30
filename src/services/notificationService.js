// src/services/notificationService.js


import storageService
  from "./storageService.js";



class NotificationService {


  constructor() {

    this.storageKey =
      "notifications";


    this.notifications =
      this.load();

  }





  add(
    notification
  ) {

    if (!notification) {

      throw new Error(
        "Notification is required"
      );

    }


    const record = {

      id:
        Date.now(),

      ...notification,

      createdAt:
        new Date().toISOString(),

      read:
        false

    };


    this.notifications.push(
      record
    );


    this.save();


    return record;

  }





  getAll(){

    return [
      ...this.notifications
    ];

  }





  getUnread(){

    return this.notifications.filter(
      item =>
        !item.read
    );

  }





  markAsRead(id){

    const notification =
      this.notifications.find(
        item =>
          item.id === id
      );


    if(notification){

      notification.read =
        true;

      this.save();

    }


    return notification;

  }





  remove(id){

    this.notifications =
      this.notifications.filter(
        item =>
          item.id !== id
      );


    this.save();


    return true;

  }





  clear(){

    this.notifications = [];


    this.save();


    return true;

  }





  save(){

    storageService.save(
      this.storageKey,
      this.notifications
    );

  }





  load(){

    return storageService.load(
      this.storageKey,
      []
    );

  }


}





export const notificationService =
  new NotificationService();



export default notificationService;
