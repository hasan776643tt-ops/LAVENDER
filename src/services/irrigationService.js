// src/services/irrigationService.js


import irrigationRepository
from "../repositories/irrigationRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class IrrigationService {



  constructor() {

    this.repository =
      irrigationRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const irrigation =
      await this.repository.getById(id);



    if (!irrigation) {


      throw createError(

        "Irrigation not found",

        "IRRIGATION_NOT_FOUND"

      );


    }



    return irrigation;


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

        "Irrigation not found",

        "IRRIGATION_NOT_FOUND"

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

        "Irrigation not found",

        "IRRIGATION_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const irrigation =
      await this.repository.getById(id);



    return Boolean(irrigation);


  }





  async count() {


    const irrigations =
      await this.repository.getAll();



    return irrigations.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Irrigation id is required",

        "IRRIGATION_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    this.validateData(data);



    if (
      !data.type ||
      !data.type.trim()
    ) {


      throw createError(

        "Irrigation type is required",

        "IRRIGATION_TYPE_REQUIRED"

      );


    }



    this.validateQuantity(data);



    return true;


  }





  validateUpdate(data) {


    this.validateData(data);



    this.validateQuantity(data);



    return true;


  }





  validateData(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {


      throw createError(

        "Irrigation data is required",

        "IRRIGATION_DATA_REQUIRED"

      );


    }



    return true;


  }





  validateQuantity(data) {


    if (
      data.quantity != null
      &&
      Number(data.quantity) < 0
    ) {


      throw createError(

        "Irrigation quantity is invalid",

        "IRRIGATION_QUANTITY_INVALID"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new IrrigationService()

);
