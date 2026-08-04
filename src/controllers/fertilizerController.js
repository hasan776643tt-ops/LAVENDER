// src/controllers/fertilizerController.js


import fertilizerService
  from "../services/fertilizerService.js";



class FertilizerController {


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



  async count() {

    return this.service.count();

  }



  async exists(id) {

    return this.service.exists(
      id
    );

  }


}



const fertilizerController =
  new FertilizerController(
    fertilizerService
  );



export default Object.freeze(
  fertilizerController
);
