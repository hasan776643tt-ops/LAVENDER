// src/services/authService.js

import userRepository
  from "../repositories/userRepository.js";


import userValidator
  from "../validators/userValidator.js";


class AuthService {


  constructor() {

    this.repository =
      userRepository;


    this.session =
      null;

  }



  async login(credentials) {


    this.validate(
      credentials
    );


    const users =
      await this.repository.getAll();


    const user =
      users.find(
        item =>
          item.email === credentials.email
      );


    if (!user) {

      throw new Error(
        "AUTH_INVALID_CREDENTIALS"
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

  }



  async register(data) {


    this.validate(
      data
    );


    return this.repository.create(
      data
    );

  }



  async logout() {


    this.session =
      null;


    return true;

  }



  async updateProfile(data) {


    if (
      !this.session
    ) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }


    return this.repository.update(
      this.session.id,
      data
    );

  }



  async changePassword(data) {


    if (
      !this.session
    ) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }


    return true;

  }



  async forgotPassword(email) {


    if (!email) {

      throw new Error(
        "EMAIL_REQUIRED"
      );

    }


    return true;

  }



  getCurrentUser() {

    return this.session;

  }



  isAuthenticated() {

    return Boolean(
      this.session?.authenticated
    );

  }



  hasRole(role) {


    return (
      this.session?.role === role
    );

  }



  validate(data) {


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


}


export default Object.freeze(
  new AuthService()
);
