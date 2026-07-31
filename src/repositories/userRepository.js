// src/repositories/userRepository.js


import storageService
  from "../services/storageService.js";



class UserRepository {



  constructor() {

    this.key =
      "users";

  }







  getAll() {


    try {


      return storageService.load(

        this.key,

        []

      );



    } catch(error) {


      throw new Error(
        `UserRepository getAll failed: ${error.message}`
      );


    }


  }







  getById(id) {


    try {


      if(!id){

        return null;

      }



      return this.getAll().find(


        user =>


        String(user.id) === String(id)


      ) || null;



    } catch(error) {


      throw new Error(
        `UserRepository getById failed: ${error.message}`
      );


    }


  }







  create(userData) {


    try {


      this.validate(userData);



      const users =
        this.getAll();




      const user = {


        id:
          Date.now().toString(),



        ...userData,



        createdAt:
          new Date().toISOString(),



        updatedAt:
          new Date().toISOString()


      };





      users.push(
        user
      );





      storageService.save(

        this.key,

        users

      );





      return user;



    } catch(error) {


      throw new Error(
        `UserRepository create failed: ${error.message}`
      );


    }


  }







  update(id,data) {


    try {


      if(!id){

        throw new Error(
          "User ID is required"
        );

      }




      this.validate(data);




      const users =
        this.getAll();




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



        updatedAt:
          new Date().toISOString()


      };




      users[index] =
        updatedUser;





      storageService.save(

        this.key,

        users

      );





      return updatedUser;



    } catch(error) {


      throw new Error(
        `UserRepository update failed: ${error.message}`
      );


    }


  }







  delete(id) {


    try {


      const users =
        this.getAll();




      const filtered =

        users.filter(

          user =>

          String(user.id) !== String(id)

        );




      const deleted =

        filtered.length !== users.length;




      if(deleted){


        storageService.save(

          this.key,

          filtered

        );


      }




      return deleted;



    } catch(error) {


      throw new Error(
        `UserRepository delete failed: ${error.message}`
      );


    }


  }







  exists(id){


    return Boolean(

      this.getById(id)

    );


  }







  count(){


    return this.getAll().length;


  }







  validate(user){


    if(!user){


      throw new Error(
        "User data is required"
      );


    }




    if(!user.name?.trim()){


      throw new Error(
        "User name is required"
      );


    }




    return true;


  }



}





export default Object.freeze(

  new UserRepository()

);
