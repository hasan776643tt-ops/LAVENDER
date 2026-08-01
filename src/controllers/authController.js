// src/controllers/authController.js


import authService
  from "../services/authService.js";





class AuthController {



  constructor() {


    this.service =
      authService;


  }








  async login(credentials){


    try{


      return await this.service.login(

        credentials

      );



    }catch(error){


      throw new Error(

        `AuthController login failed: ${error.message}`

      );


    }


  }








  async register(userData){


    try{


      return await this.service.register(

        userData

      );



    }catch(error){


      throw new Error(

        `AuthController register failed: ${error.message}`

      );


    }


  }








  async logout(){


    try{


      return await this.service.logout();



    }catch(error){


      throw new Error(

        `AuthController logout failed: ${error.message}`

      );


    }


  }








  async updateProfile(userData){


    try{


      return await this.service.updateProfile(

        userData

      );



    }catch(error){


      throw new Error(

        `AuthController updateProfile failed: ${error.message}`

      );


    }


  }








  async changePassword(passwordData){


    try{


      return await this.service.changePassword(

        passwordData

      );



    }catch(error){


      throw new Error(

        `AuthController changePassword failed: ${error.message}`

      );


    }


  }








  async forgotPassword(email){


    try{


      return await this.service.forgotPassword(

        email

      );



    }catch(error){


      throw new Error(

        `AuthController forgotPassword failed: ${error.message}`

      );


    }


  }








  async isAuthenticated(){


    try{


      return await this.service.isAuthenticated();



    }catch(error){


      throw new Error(

        `AuthController isAuthenticated failed: ${error.message}`

      );


    }


  }








  async getCurrentUser(){


    try{


      return await this.service.getCurrentUser();



    }catch(error){


      throw new Error(

        `AuthController getCurrentUser failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new AuthController()

);
