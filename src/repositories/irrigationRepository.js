// src/repositories/irrigationRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class IrrigationRepository {


  constructor() {

    this.key =
      "irrigations";

  }





  async getAll() {


    return storageService.load(

      this.key,

      []

    );


  }





  async getById(id) {


    if (!id) {


      return null;


    }



    const irrigations =

      await this.getAll();



    return (

      irrigations.find(

        irrigation =>

          String(irrigation.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Irrigation data is required",

        "IRRIGATION_DATA_REQUIRED"

      );


    }



    const irrigations =

      await this.getAll();



    const now =

      new Date().toISOString();



    const irrigation = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    irrigations.push(

      irrigation

    );



    await storageService.save(

      this.key,

      irrigations

    );



    return irrigation;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const irrigations =

      await this.getAll();



    const index =

      irrigations.findIndex(

        irrigation =>

          String(irrigation.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updated = {


      ...irrigations[index],


      ...data,


      id:

        irrigations[index].id,


      createdAt:

        irrigations[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    irrigations[index] =

      updated;



    await storageService.save(

      this.key,

      irrigations

    );



    return updated;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const irrigations =

      await this.getAll();



    const filtered =

      irrigations.filter(

        irrigation =>

          String(irrigation.id) !== String(id)

      );



    const deleted =

      filtered.length !== irrigations.length;



    if (deleted) {


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id) {


    return Boolean(

      await this.getById(id)

    );


  }





  async count() {


    const irrigations =

      await this.getAll();



    return irrigations.length;


  }


}





const irrigationRepository =

  new IrrigationRepository();



export default Object.freeze(

  irrigationRepository

);
