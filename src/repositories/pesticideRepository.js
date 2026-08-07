// src/repositories/pesticideRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class PesticideRepository {


  constructor() {

    this.key =
      "pesticides";

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



    const pesticides =

      await this.getAll();



    return (

      pesticides.find(

        pesticide =>

          String(pesticide.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Pesticide data is required",

        "PESTICIDE_DATA_REQUIRED"

      );


    }



    const pesticides =

      await this.getAll();



    const now =

      new Date().toISOString();



    const pesticide = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    pesticides.push(

      pesticide

    );



    await storageService.save(

      this.key,

      pesticides

    );



    return pesticide;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const pesticides =

      await this.getAll();



    const index =

      pesticides.findIndex(

        pesticide =>

          String(pesticide.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updated = {


      ...pesticides[index],


      ...data,


      id:

        pesticides[index].id,


      createdAt:

        pesticides[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    pesticides[index] =

      updated;



    await storageService.save(

      this.key,

      pesticides

    );



    return updated;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const pesticides =

      await this.getAll();



    const filtered =

      pesticides.filter(

        pesticide =>

          String(pesticide.id) !== String(id)

      );



    const deleted =

      filtered.length !== pesticides.length;



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


    const pesticides =

      await this.getAll();



    return pesticides.length;


  }


}





const pesticideRepository =

  new PesticideRepository();



export default Object.freeze(

  pesticideRepository

);
