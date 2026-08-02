// src/controllers/cropController.js

import cropService from "../services/cropService.js";


class CropController {


  constructor() {

    this.service = cropService;

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


}


const cropController =
new CropController();


export default Object.freeze(
  cropController
);
