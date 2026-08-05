// src/services/fieldService.js


import fieldRepository
from "../repositories/fieldRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class FieldService {



  constructor() {

    this.repository =
      fieldRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const field =
      await this.repository.getById(id);



    if (!field) {


      throw createError(

        "Field not found",

        "FIELD_NOT_FOUND"

      );


    }



    return field;


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

        "Field not found",

        "FIELD_NOT_FOUND"

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

        "Field not found",

        "FIELD_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const field =
      await this.repository.getById(id);



    return Boolean(field);


  }





  async count() {


    const fields =
      await this.repository.getAll();



    return fields.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Field id is required",

        "FIELD_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {


      throw createError(

        "Field data is required",

        "FIELD_DATA_REQUIRED"

      );


    }




    if (
      !data.name ||
      !data.name.trim()
    ) {


      throw createError(

        "Field name is required",

        "FIELD_NAME_REQUIRED"

      );


    }



    return true;


  }





  validateUpdate(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {


      throw createError(

        "Field data is required",

        "FIELD_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new FieldService()

);
