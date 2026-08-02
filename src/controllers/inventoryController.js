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

    } catch (error) {

      throw new Error(
        `InventoryController getAll failed: ${error.message}`
      );

    }

  }


  async getById(id) {

    try {

      return await this.service.getById(id);

    } catch (error) {

      throw new Error(
        `InventoryController getById failed: ${error.message}`
      );

    }

  }


  async create(data) {

    try {

      return await this.service.create(data);

    } catch (error) {

      throw new Error(
        `InventoryController create failed: ${error.message}`
      );

    }

  }


  async update(id, data) {

    try {

      return await this.service.update(
        id,
        data
      );

    } catch (error) {

      throw new Error(
        `InventoryController update failed: ${error.message}`
      );

    }

  }


  async delete(id) {

    try {

      return await this.service.delete(id);

    } catch (error) {

      throw new Error(
        `InventoryController delete failed: ${error.message}`
      );

    }

  }


  async count() {

    try {

      return await this.service.count();

    } catch (error) {

      throw new Error(
        `InventoryController count failed: ${error.message}`
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
