// src/controllers/harvestController.js


import harvestService
  from "../services/harvestService.js";



class HarvestController {



  constructor(service) {

    this.service = service;

  }



  async getAll() {

    try {

      return await this.service.getAll();


    } catch(error) {

      throw new Error(
        `HARVEST_GET_ALL_FAILED:${error.message}`
      );

    }

  }



  async getById(id) {

    try {

      return await this.service.getById(
        id
      );


    } catch(error) {

      throw new Error(
        `HARVEST_GET_BY_ID_FAILED:${error.message}`
      );

    }

  }



  async create(data) {

    try {

      return await this.service.create(
        data
      );


    } catch(error) {

      throw new Error(
        `HARVEST_CREATE_FAILED:${error.message}`
      );

    }

  }



  async update(id, data) {

    try {

      return await this.service.update(
        id,
        data
      );


    } catch(error) {

      throw new Error(
        `HARVEST_UPDATE_FAILED:${error.message}`
      );

    }

  }



  async delete(id) {

    try {

      return await this.service.delete(
        id
      );


    } catch(error) {

      throw new Error(
        `HARVEST_DELETE_FAILED:${error.message}`
      );

    }

  }



  async exists(id) {

    try {

      return await this.service.exists(
        id
      );


    } catch(error) {

      throw new Error(
        `HARVEST_EXISTS_FAILED:${error.message}`
      );

    }

  }



  async count() {

    try {

      return await this.service.count();


    } catch(error) {

      throw new Error(
        `HARVEST_COUNT_FAILED:${error.message}`
      );

    }

  }


}



const harvestController =
  new HarvestController(
    harvestService
  );



export default Object.freeze(
  harvestController
);
