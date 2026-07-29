// src/services/notificationService.js


import storageService
  from "./storageService.js";



class NotificationService {


  constructor(){

    this.storageKey =
      "notifications";

    this.notifications =
      storageService.load(
        this.storageKey,
        []
      );

  }




  create(
    type,
    message,
    data = {}
  ){

    const notification = {

      id:
        Date.now(),

      type,

      message,

      data,

      read:false,

      createdAt:
        new Date().toISOString()

    };


    this.notifications.push(
      notification
    );


    this.save();


    return notification;

  }





  async success(message,data={}){

    return this.create(
      "success",
      message,
      data
    );

  }





  async error(message,data={}){

    return this.create(
      "error",
      message,
      data
    );

  }





  async warning(message,data={}){

    return this.create(
      "warning",
      message,
      data
    );

  }





  async info(message,data={}){

    return this.create(
      "info",
      message,
      data
    );

  }





  async send(notification){

    return this.create(
      notification.type || "info",
      notification.message,
      notification.data
    );

  }





  getAll(){

    return [
      ...this.notifications
    ];

  }





  markAsRead(id){

    const item =
      this.notifications.find(
        n => n.id === id
      );


    if(item){

      item.read = true;

      this.save();

    }


    return item;

  }





  clear(){

    this.notifications = [];

    this.save();

  }





  save(){

    storageService.save(
      this.storageKey,
      this.notifications
    );

  }


}



export const notificationService =
  new NotificationService();


export default notificationService;
