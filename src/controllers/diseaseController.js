// src/controllers/diseaseController.js

import diseaseService from "../services/diseaseService.js";


class DiseaseController {


  constructor() {

    this.service = diseaseService;

  }


  async getAll() {

    return this.service.getAll();

  }


  async getById(id) {

    return this.service.getById(id);

  }


  async create(data) {

    return this.service.create(data);

  }


  async update(id, data) {

    return this.service.update(
      id,
      data
    );

  }


  async delete(id) {

    return this.service.delete(id);

  }


  async count() {

    return this.service.count();

  }


  async exists(id) {

    return this.service.exists(id);

  }


  async search(keyword) {

    return this.service.search(keyword);

  }


}


const diseaseController =
new DiseaseController();


export default Object.freeze(
  diseaseController
);
