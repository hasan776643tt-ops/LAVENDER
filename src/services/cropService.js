// src/services/cropService.js


import cropRepository
from "../repositories/cropRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class CropService {



  constructor() {

    this.repository =
      cropRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const crop =
      await this.repository.getById(id);



    if (!crop) {


      throw createError(

        "Crop not found",

        "CROP_NOT_FOUND"

      );


    }



    return crop;


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

        "Crop not found",

        "CROP_NOT_FOUND"

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

        "Crop not found",

        "CROP_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const crop =
      await this.repository.getById(id);



    return Boolean(crop);


  }





  async count() {


    const crops =
      await this.repository.getAll();



    return crops.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Crop id is required",

        "CROP_ID_REQUIRED"

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

        "Crop data is required",

        "CROP_DATA_REQUIRED"

      );


    }




    if (
      !data.name ||
      !data.name.trim()
    ) {


      throw createError(

        "Crop name is required",

        "CROP_NAME_REQUIRED"

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

        "Crop data is required",

        "CROP_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new CropService()

);
