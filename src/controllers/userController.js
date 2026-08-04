// src/controllers/userController.js


import userService
  from "../services/userService.js";



class UserController {


  constructor(service) {

    this.service =
      service;

  }



  async getAll() {

    return this.service.getAll();

  }



  async getById(id) {

    return this.service.getById(
      id
    );

  }



  async create(data) {

    return this.service.create(
      data
    );

  }



  async update(
    id,
    data
  ) {

    return this.service.update(
      id,
      data
    );

  }



  async delete(id) {

    return this.service.delete(
      id
    );

  }



  async exists(id) {

    return this.service.exists(
      id
    );

  }



  async count() {

    return this.service.count();

  }


}



const userController =
  new UserController(
    userService
  );



export default Object.freeze(
  userController
);
