// src/routes/authRoutes.js


import authController
  from "../controllers/authController.js";





class AuthRoutes {



  constructor(){


    this.controller =
      authController;


  }








  async login(credentials){


    try{


      return await this.controller.login(

        credentials

      );



    }catch(error){


      throw new Error(

        `AuthRoutes login failed: ${error.message}`

      );


    }


  }








  async register(userData){


    try{


      return await this.controller.register(

        userData

      );



    }catch(error){


      throw new Error(

        `AuthRoutes register failed: ${error.message}`

      );


    }


  }








  async logout(){


    try{


      return await this.controller.logout();



    }catch(error){


      throw new Error(

        `AuthRoutes logout failed: ${error.message}`

      );


    }


  }








  async updateProfile(userData){


    try{


      return await this.controller.updateProfile(

        userData

      );



    }catch(error){


      throw new Error(

        `AuthRoutes updateProfile failed: ${error.message}`

      );


    }


  }








  async changePassword(passwordData){


    try{


      return await this.controller.changePassword(

        passwordData

      );



    }catch(error){


      throw new Error(

        `AuthRoutes changePassword failed: ${error.message}`

      );


    }


  }








  async forgotPassword(email){


    try{


      return await this.controller.forgotPassword(

        email

      );



    }catch(error){


      throw new Error(

        `AuthRoutes forgotPassword failed: ${error.message}`

      );


    }


  }








  async isAuthenticated(){


    try{


      return await this.controller.isAuthenticated();



    }catch(error){


      throw new Error(

        `AuthRoutes isAuthenticated failed: ${error.message}`

      );


    }


  }








  async getCurrentUser(){


    try{


      return await this.controller.getCurrentUser();



    }catch(error){


      throw new Error(

        `AuthRoutes getCurrentUser failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new AuthRoutes()

);
