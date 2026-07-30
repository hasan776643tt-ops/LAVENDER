// src/services/authService.js

import storageService
  from "./storageService.js";


class AuthService {


  constructor() {

    this.storageKey =
      "currentUser";

    this.user =
      this.loadUser();

  }




  login(user) {

    const session = {

      ...user,

      loginAt:
        new Date().toISOString(),

      authenticated:
        true

    };


    this.user =
      session;


    storageService.save(
      this.storageKey,
      session
    );


    return session;

  }




  logout() {

    this.user =
      null;


    storageService.remove(
      this.storageKey
    );


    return true;

  }




  loadUser() {

    return storageService.load(
      this.storageKey,
      null
    );

  }




  getCurrentUser() {

    return this.user;

  }




  isAuthenticated() {

    return (

      this.user !== null &&

      this.user.authenticated === true

    );

  }




  hasRole(role) {

    return (
      this.user?.role === role
    );

  }




  updateProfile(data = {}) {

    if (!this.user) {

      return null;

    }


    this.user = {

      ...this.user,

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.storageKey,
      this.user
    );


    return this.user;

  }


}


export default Object.freeze(
  new AuthService()
);
