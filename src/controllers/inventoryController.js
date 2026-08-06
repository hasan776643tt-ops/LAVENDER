// src/controllers/inventoryController.js


import inventoryService
  from "../services/inventoryService.js";



class InventoryController {


  constructor(service) {

    this.service = service;

  }



  async getAll() {

    try {

      return await this.service.getAll();

    } catch(error) {

      throw new Error(
        `INVENTORY_GET_ALL_FAILED:${error.message}`
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
        `INVENTORY_GET_BY_ID_FAILED:${error.message}`
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
        `INVENTORY_CREATE_FAILED:${error.message}`
      );

    }

  }



  async update(
    id,
    data
  ) {

    try {

      return await this.service.update(
        id,
        data
      );

    } catch(error) {

      throw new Error(
        `INVENTORY_UPDATE_FAILED:${error.message}`
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
        `INVENTORY_DELETE_FAILED:${error.message}`
      );

    }

  }



  async count() {

    try {

      return await this.service.count();

    } catch(error) {

      throw new Error(
        `INVENTORY_COUNT_FAILED:${error.message}`
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
        `INVENTORY_EXISTS_FAILED:${error.message}`
      );

    }

  }


}



const inventoryController =
  new InventoryController(
    inventoryService
  );



export default Object.freeze(
  inventoryController
);
