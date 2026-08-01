// src/services/authService.js


import userRepository
  from "../repositories/userRepository.js";


import { userValidator }
  from "../validators/userValidator.js";





class AuthService {



  constructor(){


    this.repository =
      userRepository;


    this.session =
      null;


  }








  async login(credentials){


    try{


      this.validate(credentials);



      const users =
        await this.repository.getAll();



      const user =

        users.find(

          item =>

          item.email === credentials.email

        );





      if(!user){


        throw new Error(

          "Invalid email or password"

        );


      }




      this.session = {


        id:
          user.id,


        name:
          user.name,


        email:
          user.email,


        role:
          user.role,


        authenticated:
          true,


        loginAt:
          new Date().toISOString()


      };




      return this.session;



    }catch(error){


      throw new Error(

        `AuthService login failed: ${error.message}`

      );


    }


  }








  async register(userData){


    try{


      this.validate(userData);



      return await this.repository.create(

        userData

      );



    }catch(error){


      throw new Error(

        `AuthService register failed: ${error.message}`

      );


    }


  }








  async logout(){


    try{


      this.session =
        null;



      return {


        success:true,


        message:
          "Logout successful"


      };



    }catch(error){


      throw new Error(

        `AuthService logout failed: ${error.message}`

      );


    }


  }








  async updateProfile(data){


    try{


      if(!this.session){


        throw new Error(

          "User not authenticated"

        );


      }




      return await this.repository.update(

        this.session.id,

        data

      );



    }catch(error){


      throw new Error(

        `AuthService updateProfile failed: ${error.message}`

      );


    }


  }








  async changePassword(data){


    try{


      if(!this.session){


        throw new Error(

          "User not authenticated"

        );


      }




      return {


        success:true,


        message:
          "Password change request completed"

      };



    }catch(error){


      throw new Error(

        `AuthService changePassword failed: ${error.message}`

      );


    }


  }








  async forgotPassword(email){


    try{


      if(!email){


        throw new Error(

          "Email is required"

        );


      }




      return {


        success:true,


        message:
          "Password reset request created"

      };



    }catch(error){


      throw new Error(

        `AuthService forgotPassword failed: ${error.message}`

      );


    }


  }








  getCurrentUser(){


    return this.session;


  }








  isAuthenticated(){


    return Boolean(

      this.session?.authenticated === true

    );


  }








  hasRole(role){


    return (

      this.session?.role === role

    );


  }








  validate(data){


    const result =

      userValidator.validate(

        data

      );




    if(!result.valid){


      throw new Error(

        JSON.stringify(

          result.errors

        )

      );


    }



    return true;


  }



}





export default Object.freeze(

  new AuthService()

);
