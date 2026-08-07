// src/repositories/diseaseRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class DiseaseRepository {


  constructor() {

    this.key =
      "diseases";

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



    const diseases =

      await this.getAll();



    return (

      diseases.find(

        disease =>

          String(disease.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Disease data is required",

        "DISEASE_DATA_REQUIRED"

      );


    }



    const diseases =

      await this.getAll();



    const now =

      new Date().toISOString();



    const disease = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    diseases.push(

      disease

    );



    await storageService.save(

      this.key,

      diseases

    );



    return disease;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const diseases =

      await this.getAll();



    const index =

      diseases.findIndex(

        disease =>

          String(disease.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updated = {


      ...diseases[index],


      ...data,


      id:

        diseases[index].id,


      createdAt:

        diseases[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    diseases[index] =

      updated;



    await storageService.save(

      this.key,

      diseases

    );



    return updated;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const diseases =

      await this.getAll();



    const filtered =

      diseases.filter(

        disease =>

          String(disease.id) !== String(id)

      );



    const deleted =

      filtered.length !== diseases.length;



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


    const diseases =

      await this.getAll();



    return diseases.length;


  }


}





const diseaseRepository =

  new DiseaseRepository();



export default Object.freeze(

  diseaseRepository

);
