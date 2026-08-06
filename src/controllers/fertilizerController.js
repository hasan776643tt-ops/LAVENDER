// src/controllers/fertilizerController.js


import fertilizerService
  from "../services/fertilizerService.js";



class FertilizerController {


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



  async count() {

    return await this.service.count();

  }



  async exists(id) {

    return await this.service.exists(
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
