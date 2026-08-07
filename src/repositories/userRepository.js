// src/repositories/userRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class UserRepository {


  constructor(){

    this.key =
      "users";

  }





  async getAll(){


    return storageService.load(

      this.key,

      []

    );


  }





  async getById(id){


    if(!id){

      return null;

    }



    const users =

      await this.getAll();



    return (

      users.find(

        user =>

          String(user.id) === String(id)

      )

      ??

      null

    );


  }





  async findByEmail(email){


    if(!email){

      return null;

    }



    const users =

      await this.getAll();



    return (

      users.find(

        user =>

          user.email?.toLowerCase()

          ===

          email.toLowerCase()

      )

      ??

      null

    );


  }





  async create(data){


    if(!data){


      throw createError(

        "User data is required",

        "USER_DATA_REQUIRED"

      );


    }



    const users =

      await this.getAll();



    const now =

      new Date().toISOString();



    const user = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    users.push(user);



    await storageService.save(

      this.key,

      users

    );



    return user;


  }





  async update(
    id,
    data
  ){


    if(!id){

      throw createError(

        "User id is required",

        "USER_ID_REQUIRED"

      );

    }



    const users =

      await this.getAll();



    const index =

      users.findIndex(

        user =>

          String(user.id) === String(id)

      );



    if(index === -1){

      return null;

    }



    const updatedUser = {


      ...users[index],


      ...data,


      id:

        users[index].id,


      createdAt:

        users[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    users[index] =

      updatedUser;



    await storageService.save(

      this.key,

      users

    );



    return updatedUser;


  }





  async delete(id){


    if(!id){

      return false;

    }



    const users =

      await this.getAll();



    const filtered =

      users.filter(

        user =>

          String(user.id) !== String(id)

      );



    const deleted =

      filtered.length !== users.length;



    if(deleted){


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id){


    return Boolean(

      await this.getById(id)

    );


  }





  async count(){


    const users =

      await this.getAll();



    return users.length;


  }


}





const userRepository =

  new UserRepository();



export default Object.freeze(

  userRepository

);
