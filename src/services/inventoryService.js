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
        "Inventory id is required"
      );
    }


    const item =
      await this.repository.getById(id);


    if (!item) {
      throw new Error(
        "Inventory item not found"
      );
    }


    return item;

  }


  async create(data) {

    this.validateInventory(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error(
        "Inventory id is required"
      );
    }


    this.validateInventory(data);


    const updatedItem =
      await this.repository.update(
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


  async delete(id) {

    if (!id) {
      throw new Error(
        "Inventory id is required"
      );
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error(
        "Inventory item not found"
      );
    }


    return true;

  }


  async exists(id) {

    if (!id) {
      throw new Error(
        "Inventory id is required"
      );
    }


    return this.repository.exists(id);

  }


  async count() {

    return this.repository.count();

  }


  validateInventory(data) {

    if (!data || typeof data !== "object") {

      throw new Error(
        "Inventory data is required"
      );

    }


    return true;

  }

}


const inventoryService =
new InventoryService();


export default Object.freeze(
  inventoryService
);
