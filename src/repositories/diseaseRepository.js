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

        String(disease.id)
        ===
        String(id)

    ) || null;


  }





  create(data) {


    if (!data) {

      throw new Error(
        "Disease data is required"
      );

    }



    const diseases =
      this.getAll();



    const disease = {


      id:
        Date.now().toString(),



      ...data,



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





  update(id,data) {


    const diseases =
      this.getAll();



    const index =
      diseases.findIndex(

        disease =>

          String(disease.id)
          ===
          String(id)

      );



    if (index === -1) {

      return null;

    }



    const updated = {


      ...diseases[index],


      ...data,



      id:
        diseases[index].id,



      updatedAt:
        new Date().toISOString()


    };



    diseases[index] =
      updated;



    storageService.save(

      this.key,

      diseases

    );



    return updated;


  }





  delete(id) {


    const diseases =
      this.getAll();



    const filtered =

      diseases.filter(

        disease =>

          String(disease.id)
          !==
          String(id)

      );



    if (
      filtered.length ===
      diseases.length
    ) {

      return false;

    }



    storageService.save(

      this.key,

      filtered

    );



    return true;


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
