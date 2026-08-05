// src/services/authService.js

import userRepository
from "../repositories/userRepository.js";


import userValidator
from "../validators/userValidator.js";


import {
  createError
}
from "../utils/errorHandler.js";




class AuthService {



  constructor() {

    this.repository =
      userRepository;


    this.validator =
      userValidator;


    this.currentSession =
      null;

  }





  async login(credentials) {


    this.validateCredentials(
      credentials
    );



    const user =
      await this.repository.findByEmail(
        credentials.email
      );



    if (!user) {


      throw createError(

        "Invalid authentication credentials",

        "AUTH_INVALID_CREDENTIALS"

      );


    }



    this.currentSession = {


      id:
        user.id,


      username:
        user.username,


      email:
        user.email,


      role:
        user.role,


      authenticated:
        true,


      loginAt:
        new Date().toISOString()


    };



    return this.currentSession;


  }





  async register(data) {


    this.validateRegister(
      data
    );



    return this.repository.create(
      data
    );


  }





  async logout() {


    this.currentSession =
      null;



    return true;


  }





  async updateProfile(data) {


    this.requireAuthentication();



    this.validator.validateUpdate(
      data
    );



    const updated =
      await this.repository.update(

        this.currentSession.id,

        data

      );



    if (!updated) {


      throw createError(

        "User not found",

        "USER_NOT_FOUND"

      );


    }



    return updated;


  }





  async changePassword(data) {


    this.requireAuthentication();



    if (
      !data
    ) {


      throw createError(

        "Password data is required",

        "PASSWORD_DATA_REQUIRED"

      );


    }



    return true;


  }





  async forgotPassword(email) {


    if (
      !email
    ) {


      throw createError(

        "Email is required",

        "EMAIL_REQUIRED"

      );


    }



    return true;


  }





  getCurrentUser() {


    return this.currentSession;


  }





  isAuthenticated() {


    return Boolean(

      this.currentSession?.authenticated

    );


  }





  hasRole(role) {


    return (

      this.currentSession?.role === role

    );


  }





  validateCredentials(data) {


    if (

      !data

      ||

      !data.email

    ) {


      throw createError(

        "Authentication credentials are required",

        "AUTH_CREDENTIALS_REQUIRED"

      );


    }



    return true;


  }





  validateRegister(data) {


    this.validator.validateCreate(
      data
    );



    return true;


  }





  requireAuthentication() {


    if (
      !this.currentSession
    ) {


      throw createError(

        "Authentication required",

        "AUTH_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new AuthService()

);
