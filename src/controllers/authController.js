// src/controllers/authController.js


import authService
  from "../services/authService.js";



class AuthController {


  constructor(service) {

    this.service = service;

  }



  async login(credentials) {

    return await this.service.login(
      credentials
    );

  }



  async register(userData) {

    return await this.service.register(
      userData
    );

  }



  async logout() {

    return await this.service.logout();

  }



  async updateProfile(userData) {

    return await this.service.updateProfile(
      userData
    );

  }



  async changePassword(passwordData) {

    return await this.service.changePassword(
      passwordData
    );

  }



  async forgotPassword(email) {

    return await this.service.forgotPassword(
      email
    );

  }



  getCurrentUser() {

    return this.service.getCurrentUser();

  }



  isAuthenticated() {

    return this.service.isAuthenticated();

  }



  hasRole(role) {

    return this.service.hasRole(
      role
    );

  }


}



const authController =
  new AuthController(
    authService
  );



export default Object.freeze(
  authController
);
