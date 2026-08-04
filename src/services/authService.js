// src/services/authService.js

import userRepository
  from "../repositories/userRepository.js";


import userValidator
  from "../validators/userValidator.js";


class AuthService {


  constructor() {

    this.repository =
      userRepository;


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

      throw new Error(
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


    return this.repository.update(
      this.currentSession.id,
      data
    );

  }



  async changePassword(data) {


    this.requireAuthentication();


    if (
      !data
    ) {

      throw new Error(
        "PASSWORD_DATA_REQUIRED"
      );

    }


    return true;

  }



  async forgotPassword(email) {


    if (
      !email
    ) {

      throw new Error(
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
      !data ||
      !data.email
    ) {

      throw new Error(
        "AUTH_CREDENTIALS_REQUIRED"
      );

    }


    return true;

  }



  validateRegister(data) {


    const result =
      userValidator.validate(
        data
      );


    if (
      result &&
      result.valid === false
    ) {

      throw new Error(
        JSON.stringify(
          result.errors
        )
      );

    }


    return true;

  }



  requireAuthentication() {


    if (
      !this.currentSession
    ) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }


    return true;

  }


}



export default Object.freeze(
  new AuthService()
);
