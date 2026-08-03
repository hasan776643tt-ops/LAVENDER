// src/services/inventoryService.js

import inventoryRepository from "../repositories/inventoryRepository.js";


class InventoryService {


  constructor() {

    this.repository = inventoryRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "INVENTORY_ID_REQUIRED"
      );

    }


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

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "INVENTORY_ID_REQUIRED"
      );

    }


    this.validate(data);


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

    if (!id) {

      throw new Error(
        "INVENTORY_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


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
      await this.repository.getById(id);


    return Boolean(item);

  }


  async count() {

    const items =
      await this.repository.getAll();


    return items.length;

  }


  validate(data) {

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
