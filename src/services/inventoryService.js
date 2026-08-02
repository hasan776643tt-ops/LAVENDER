// src/services/inventoryService.js

import inventoryRepository from "../repositories/inventoryRepository.js";


class InventoryService {

  constructor(repository) {

    this.repository = repository;

  }


  getAll() {

    return this.repository.getAll();

  }


  getById(id) {

    if (!id) {

      return null;

    }


    return this.repository.getById(id);

  }


  create(data) {

    if (!data || typeof data !== "object") {

      throw new Error(
        "Inventory data is required"
      );

    }


    return this.repository.create(data);

  }


  update(id, data) {

    if (!id) {

      throw new Error(
        "Inventory id is required"
      );

    }


    if (!data || typeof data !== "object") {

      throw new Error(
        "Inventory update data is required"
      );

    }


    const updatedItem =
      this.repository.update(
        id,
        data
      );


    if (!updatedItem) {

      throw new Error(
        "Inventory item not found"
      );

    }


    return updatedItem;

  }


  delete(id) {

    if (!id) {

      throw new Error(
        "Inventory id is required"
      );

    }


    const deleted =
      this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "Inventory item not found"
      );

    }


    return true;

  }


  exists(id) {

    return this.repository.exists(id);

  }


  count() {

    return this.repository.count();

  }


}


// Singleton Service

const inventoryService =
  new InventoryService(
    inventoryRepository
  );


export default Object.freeze(
  inventoryService
);
