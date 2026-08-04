// src/controllers/authController.js


import authService
  from "../services/authService.js";



class AuthController {


  constructor() {

    this.service =
      authService;

  }



  async login(credentials) {

    try {

      return await this.service.login(
        credentials
      );


    } catch(error) {

      throw new Error(
        `AUTH_LOGIN_FAILED:${error.message}`
      );

    }

  }



  async register(userData) {

    try {

      return await this.service.register(
        userData
      );


    } catch(error) {

      throw new Error(
        `AUTH_REGISTER_FAILED:${error.message}`
      );

    }

  }



  async logout() {

    try {

      return await this.service.logout();


    } catch(error) {

      throw new Error(
        `AUTH_LOGOUT_FAILED:${error.message}`
      );

    }

  }



  async updateProfile(userData) {

    try {

      return await this.service.updateProfile(
        userData
      );


    } catch(error) {

      throw new Error(
        `AUTH_UPDATE_PROFILE_FAILED:${error.message}`
      );

    }

  }



  async changePassword(passwordData) {

    try {

      return await this.service.changePassword(
        passwordData
      );


    } catch(error) {

      throw new Error(
        `AUTH_CHANGE_PASSWORD_FAILED:${error.message}`
      );

    }

  }



  async forgotPassword(email) {

    try {

      return await this.service.forgotPassword(
        email
      );


    } catch(error) {

      throw new Error(
        `AUTH_FORGOT_PASSWORD_FAILED:${error.message}`
      );

    }

  }



  getCurrentUser() {

    try {

      return this.service.getCurrentUser();


    } catch(error) {

      throw new Error(
        `AUTH_CURRENT_USER_FAILED:${error.message}`
      );

    }

  }



  isAuthenticated() {

    try {

      return this.service.isAuthenticated();


    } catch(error) {

      throw new Error(
        `AUTH_STATUS_FAILED:${error.message}`
      );

    }

  }



  hasRole(role) {

    try {

      return this.service.hasRole(
        role
      );


    } catch(error) {

      throw new Error(
        `AUTH_ROLE_CHECK_FAILED:${error.message}`
      );

    }

  }


}



export default Object.freeze(
  new AuthController()
);
