// src/controllers/fieldController.js


import fieldService
  from "../services/fieldService.js";



class FieldController {


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



const fieldController =
  new FieldController(
    fieldService
  );



export default Object.freeze(
  fieldController
);
