// src/services/harvestService.js

import harvestRepository
from "../repositories/harvestRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class HarvestService {



  constructor() {

    this.repository =
      harvestRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const harvest =
      await this.repository.getById(id);



    if (!harvest) {


      throw createError(

        "Harvest not found",

        "HARVEST_NOT_FOUND"

      );


    }



    return harvest;


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



    const harvest =
      await this.repository.update(

        id,

        data

      );



    if (!harvest) {


      throw createError(

        "Harvest not found",

        "HARVEST_NOT_FOUND"

      );


    }



    return harvest;


  }





  async delete(id) {


    this.validateId(id);



    const deleted =
      await this.repository.delete(
        id
      );



    if (!deleted) {


      throw createError(

        "Harvest not found",

        "HARVEST_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const harvest =
      await this.repository.getById(
        id
      );



    return Boolean(
      harvest
    );


  }





  async count() {


    const harvests =
      await this.repository.getAll();



    return harvests.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Harvest id is required",

        "HARVEST_ID_REQUIRED"

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

        "Harvest data is required",

        "HARVEST_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new HarvestService()

);
