// src/repositories/fertilizerRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class FertilizerRepository {


  constructor() {

    this.key =
      "fertilizers";

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



    const fertilizers =

      await this.getAll();



    return (

      fertilizers.find(

        fertilizer =>

          String(fertilizer.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Fertilizer data is required",

        "FERTILIZER_DATA_REQUIRED"

      );


    }



    const fertilizers =

      await this.getAll();



    const now =

      new Date().toISOString();



    const fertilizer = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    fertilizers.push(

      fertilizer

    );



    await storageService.save(

      this.key,

      fertilizers

    );



    return fertilizer;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const fertilizers =

      await this.getAll();



    const index =

      fertilizers.findIndex(

        fertilizer =>

          String(fertilizer.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updated = {


      ...fertilizers[index],


      ...data,


      id:

        fertilizers[index].id,


      createdAt:

        fertilizers[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    fertilizers[index] =

      updated;



    await storageService.save(

      this.key,

      fertilizers

    );



    return updated;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const fertilizers =

      await this.getAll();



    const filtered =

      fertilizers.filter(

        fertilizer =>

          String(fertilizer.id) !== String(id)

      );



    const deleted =

      filtered.length !== fertilizers.length;



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


    const fertilizers =

      await this.getAll();



    return fertilizers.length;


  }


}





const fertilizerRepository =

  new FertilizerRepository();



export default Object.freeze(

  fertilizerRepository

);
