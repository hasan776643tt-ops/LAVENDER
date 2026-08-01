// src/controllers/userController.js


import userService
  from "../services/userService.js";





class UserController {



  constructor() {


    this.service =
      userService;


  }







  async getUsers(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `UserController getUsers failed: ${error.message}`

      );


    }


  }








  async getUserById(id){


    try{


      return await this.service.getById(id);



    }catch(error){


      throw new Error(

        `UserController getUserById failed: ${error.message}`

      );


    }


  }








  async createUser(userData){


    try{


      return await this.service.create(

        userData

      );



    }catch(error){


      throw new Error(

        `UserController createUser failed: ${error.message}`

      );


    }


  }








  async updateUser(
    id,
    userData
  ){


    try{


      return await this.service.update(

        id,

        userData

      );



    }catch(error){


      throw new Error(

        `UserController updateUser failed: ${error.message}`

      );


    }


  }








  async deleteUser(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `UserController deleteUser failed: ${error.message}`

      );


    }


  }








  async countUsers(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `UserController countUsers failed: ${error.message}`

      );


    }


  }




}





export default Object.freeze(

  new UserController()

);
