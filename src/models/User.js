// src/models/User.js


/**
 * User Model
 * نموذج المستخدم الموحد
 *
 * متوافق مع UserModel
 * ويدعم التوسع المستقبلي
 */


export class User {


  constructor({


    id = null,


    name = "",


    username = "",


    email = "",


    phone = "",


    password = "",


    role = "farmer",


    status = "active",


    permissions = [],


    avatar = "",


    language = "ar",


    timeZone =
      Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone,


    lastLogin = null,


    metadata = {},


    createdAt =
      new Date().toISOString(),


    updatedAt =
      new Date().toISOString()


  } = {}) {



    this.id = id;


    this.name = name;


    this.username = username;


    this.email = email;


    this.phone = phone;


    this.password = password;


    this.role = role;


    this.status = status;


    this.permissions = permissions;


    this.avatar = avatar;


    this.language = language;


    this.timeZone = timeZone;


    this.lastLogin = lastLogin;


    this.metadata = metadata;


    this.createdAt = createdAt;


    this.updatedAt = updatedAt;



  }





  update(data = {}){


    Object.assign(

      this,

      data

    );


    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  activate(){


    this.status = "active";


    this.updatedAt =
      new Date().toISOString();


  }





  deactivate(){


    this.status = "inactive";


    this.updatedAt =
      new Date().toISOString();


  }





  block(){


    this.status = "blocked";


    this.updatedAt =
      new Date().toISOString();


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


}
