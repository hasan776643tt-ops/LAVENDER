// src/services/inventoryService.js

import inventoryRepository
  from "../repositories/inventoryRepository.js";


class InventoryService {


  constructor() {

    this.repository =
      inventoryRepository;

  }



  async getAll() {

    return this.repository.getAll();

  }



  async getById(id) {

    this.validateId(id);


    const item =
      await this.repository.getById(id);


    if (!item) {

      throw new Error(
        "INVENTORY_NOT_FOUND"
      );

    }


    return item;

  }



  async create(data) {

    this.validateCreate(data);


    return this.repository.create(
      data
    );

  }



  async update(id, data) {

    this.validateId(id);


    this.validateUpdate(data);


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "INVENTORY_NOT_FOUND"
      );

    }


    return updated;

  }



  async delete(id) {

    this.validateId(id);


    const deleted =
      await this.repository.delete(
        id
      );


    if (!deleted) {

      throw new Error(
        "INVENTORY_NOT_FOUND"
      );

    }


    return true;

  }



  async exists(id) {

    if (!id) {

      return false;

    }


    const item =
      await this.repository.getById(
        id
      );


    return Boolean(item);

  }



  async count() {

    const items =
      await this.repository.getAll();


    return items.length;

  }



  validateId(id) {

    if (!id) {

      throw new Error(
        "INVENTORY_ID_REQUIRED"
      );

    }


    return true;

  }



  validateCreate(data) {

    this.validateData(data);


    return true;

  }



  validateUpdate(data) {

    this.validateData(data);


    return true;

  }



  validateData(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "INVENTORY_DATA_REQUIRED"
      );

    }


    return true;

  }


}



export default Object.freeze(
  new InventoryService()
);
