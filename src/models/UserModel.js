// src/models/UserModel.js


/**
 * User Model
 * نموذج المستخدم الذكي
 *
 * يدعم:
 * - المزارع
 * - المهندس
 * - المدير
 * - التوسع العالمي
 */


export class UserModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // البيانات الأساسية

    this.name =
      data.name ||
      "";


    this.username =
      data.username ||
      "";


    this.email =
      data.email ||
      "";


    this.phone =
      data.phone ||
      "";



    // المصادقة

    this.password =
      data.password ||
      "";



    // الصلاحيات

    this.role =
      data.role ||
      "farmer";


    this.status =
      data.status ||
      "active";



    this.permissions =
      data.permissions ||
      [];



    // الملف الشخصي

    this.avatar =
      data.avatar ||
      "";



    this.language =
      data.language ||
      "ar";


    this.timeZone =
      data.timeZone ||
      Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;



    // آخر نشاط

    this.lastLogin =
      data.lastLogin ||
      null;



    // بيانات إضافية قابلة للتوسع

    this.metadata =
      data.metadata ||
      {};



    // الزمن

    this.createdAt =
      data.createdAt ||
      new Date().toISOString();


    this.updatedAt =
      data.updatedAt ||
      new Date().toISOString();


  }





  update(data = {}){


    Object.keys(data)
    .forEach(key => {


      if(data[key] !== undefined){


        this[key] =
          data[key];


      }


    });



    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  toJSON(){


    return {


      id:this.id,


      name:this.name,


      username:this.username,


      email:this.email,


      phone:this.phone,


      password:this.password,


      role:this.role,


      status:this.status,


      permissions:this.permissions,


      avatar:this.avatar,


      language:this.language,


      timeZone:this.timeZone,


      lastLogin:this.lastLogin,


      metadata:this.metadata,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }





  static fromJSON(data = {}){


    return new UserModel(data);


  }


}





export const createUser = (data = {}) => {


  return new UserModel(data);


};
