// src/services/userService.js


import userRepository
  from "../repositories/userRepository.js";


import userValidator
  from "../validators/userValidator.js";





class UserService {



  constructor() {


    this.repository =
      userRepository;


    this.validator =
      userValidator;


  }






  async getAll() {


    try {


      return await this.repository.getAll();



    } catch(error) {


      throw new Error(

        `UserService getAll failed: ${error.message}`

      );


    }


  }








  async getById(id) {


    try {


      if(!id){


        throw new Error(

          "User ID is required"

        );


      }




      const user =

        await this.repository.getById(id);





      if(!user){


        throw new Error(

          "User not found"

        );


      }




      return user;



    } catch(error) {


      throw new Error(

        `UserService getById failed: ${error.message}`

      );


    }


  }








  async create(userData) {


    try {


      this.validator.validate(

        userData

      );




      return await this.repository.create(

        userData

      );



    } catch(error) {


      throw new Error(

        `UserService create failed: ${error.message}`

      );


    }


  }








  async update(
    id,
    userData
  ){


    try {


      if(!id){


        throw new Error(

          "User ID is required"

        );


      }




      this.validator.validate(

        userData

      );





      const updatedUser =

        await this.repository.update(

          id,

          userData

        );





      if(!updatedUser){


        throw new Error(

          "User not found"

        );


      }




      return updatedUser;



    } catch(error) {


      throw new Error(

        `UserService update failed: ${error.message}`

      );


    }


  }








  async delete(id){


    try {


      if(!id){


        throw new Error(

          "User ID is required"

        );


      }





      const exists =

        await this.repository.exists(id);





      if(!exists){


        throw new Error(

          "User not found"

        );


      }





      await this.repository.delete(id);





      return {


        success:true,


        message:

          "User deleted successfully"


      };



    } catch(error) {


      throw new Error(

        `UserService delete failed: ${error.message}`

      );


    }


  }








  async count(){


    try {


      return await this.repository.count();



    } catch(error) {


      throw new Error(

        `UserService count failed: ${error.message}`

      );


    }


  }






}





export default Object.freeze(

  new UserService()

);
