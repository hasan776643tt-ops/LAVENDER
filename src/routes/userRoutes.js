// src/routes/userRoutes.js


import userController
  from "../controllers/userController.js";





class UserRoutes {



  constructor(){


    this.controller =
      userController;


  }








  async getUsers(){


    try{


      return await this.controller.getUsers();



    }catch(error){


      throw new Error(

        `UserRoutes getUsers failed: ${error.message}`

      );


    }


  }








  async getUserById(id){


    try{


      return await this.controller.getUserById(

        id

      );



    }catch(error){


      throw new Error(

        `UserRoutes getUserById failed: ${error.message}`

      );


    }


  }








  async createUser(data){


    try{


      return await this.controller.createUser(

        data

      );



    }catch(error){


      throw new Error(

        `UserRoutes createUser failed: ${error.message}`

      );


    }


  }








  async updateUser(id,data){


    try{


      return await this.controller.updateUser(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `UserRoutes updateUser failed: ${error.message}`

      );


    }


  }








  async deleteUser(id){


    try{


      return await this.controller.deleteUser(

        id

      );



    }catch(error){


      throw new Error(

        `UserRoutes deleteUser failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new UserRoutes()

);
