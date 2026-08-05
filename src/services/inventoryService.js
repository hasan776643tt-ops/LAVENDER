// src/services/inventoryService.js

import inventoryRepository
from "../repositories/inventoryRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




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


      throw createError(

        "Inventory item not found",

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


      throw createError(

        "Inventory item not found",

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


      throw createError(

        "Inventory item not found",

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



    return Boolean(
      item
    );


  }





  async count() {


    const items =
      await this.repository.getAll();



    return items.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Inventory item id is required",

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


      throw createError(

        "Inventory data is required",

        "INVENTORY_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new InventoryService()

);
