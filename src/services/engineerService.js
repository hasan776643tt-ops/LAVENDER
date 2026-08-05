// src/services/engineerService.js

import engineerRepository
from "../repositories/engineerRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class EngineerService {



  constructor() {

    this.repository =
      engineerRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const engineer =
      await this.repository.getById(id);



    if (!engineer) {


      throw createError(

        "Engineer not found",

        "ENGINEER_NOT_FOUND"

      );


    }



    return engineer;


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

        "Engineer not found",

        "ENGINEER_NOT_FOUND"

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

        "Engineer not found",

        "ENGINEER_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const engineer =
      await this.repository.getById(id);



    return Boolean(
      engineer
    );


  }





  async count() {


    const engineers =
      await this.repository.getAll();



    return engineers.length;


  }





  async search(keyword) {


    const engineers =
      await this.repository.getAll();



    if (!keyword) {

      return engineers;

    }



    const search =
      keyword.toLowerCase();



    return engineers.filter(

      engineer =>

        engineer.name
          ?.toLowerCase()
          .includes(search)

        ||

        engineer.specialization
          ?.toLowerCase()
          .includes(search)

        ||

        engineer.city
          ?.toLowerCase()
          .includes(search)

    );


  }





  async findBySpecialization(
    specialization
  ) {


    if (!specialization) {

      return [];

    }



    const engineers =
      await this.repository.getAll();



    const search =
      specialization.toLowerCase();



    return engineers.filter(

      engineer =>

        engineer.specialization
          ?.toLowerCase()
          === search

    );


  }





  async findByCity(city) {


    if (!city) {

      return [];

    }



    const engineers =
      await this.repository.getAll();



    const search =
      city.toLowerCase();



    return engineers.filter(

      engineer =>

        engineer.city
          ?.toLowerCase()
          === search

    );


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Engineer id is required",

        "ENGINEER_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    this.validateData(data);



    if (
      !data.name ||
      !data.name.trim()
    ) {


      throw createError(

        "Engineer name is required",

        "ENGINEER_NAME_REQUIRED"

      );


    }



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

        "Engineer data is required",

        "ENGINEER_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new EngineerService()

);
