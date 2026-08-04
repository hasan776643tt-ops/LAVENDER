// src/controllers/cropController.js


import cropService
  from "../services/cropService.js";



class CropController {


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



const cropController =
  new CropController(
    cropService
  );



export default Object.freeze(
  cropController
);
