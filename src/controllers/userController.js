// src/controllers/userController.js


import userService
  from "../services/userService.js";



class UserController {


  constructor(service) {

    this.service = service;

  }



  async getAll() {

    return await this.service.getAll();

  }



  async getById(id) {

    return await this.service.getById(
      id
    );

  }



  async create(data) {

    return await this.service.create(
      data
    );

  }



  async update(
    id,
    data
  ) {

    return await this.service.update(
      id,
      data
    );

  }



  async delete(id) {

    return await this.service.delete(
      id
    );

  }



  async exists(id) {

    return await this.service.exists(
      id
    );

  }



  async count() {

    return await this.service.count();

  }


}



const userController =
  new UserController(
    userService
  );



export default Object.freeze(
  userController
);
