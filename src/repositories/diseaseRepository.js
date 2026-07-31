// src/repositories/diseaseRepository.js

import storageService from "../services/storageService.js";


class DiseaseRepository {


  constructor() {

    this.key = "diseases";

  }



  getAll() {

    return storageService.load(
      this.key,
      []
    );

  }



  getById(id) {

    if (!id) {

      return null;

    }


    return this.getAll().find(

      disease =>
        String(disease.id) === String(id)

    ) || null;

  }



  create(diseaseData) {


    const diseases =
      this.getAll();



    const disease = {


      id:
        Date.now().toString(),


      ...diseaseData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    diseases.push(
      disease
    );



    storageService.save(

      this.key,

      diseases

    );



    return disease;

  }



  update(id, data) {


    const diseases =
      this.getAll();



    const index =
      diseases.findIndex(

        disease =>
          String(disease.id) === String(id)

      );



    if (index === -1) {

      return null;

    }



    const updatedDisease = {


      ...diseases[index],


      ...data,


      id:
        diseases[index].id,


      updatedAt:
        new Date().toISOString()


    };



    diseases[index] =
      updatedDisease;



    storageService.save(

      this.key,

      diseases

    );



    return updatedDisease;

  }



  delete(id) {


    const diseases =
      this.getAll();



    const filtered =
      diseases.filter(

        disease =>
          String(disease.id) !== String(id)

      );



    const deleted =
      filtered.length !== diseases.length;



    if (deleted) {


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;

  }



  exists(id) {


    return Boolean(

      this.getById(id)

    );

  }



  count() {


    return this.getAll().length;

  }


}



export default Object.freeze(

  new DiseaseRepository()

);
