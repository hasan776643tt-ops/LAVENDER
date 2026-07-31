// src/repositories/irrigationRepository.js

import storageService from "../services/storageService.js";


class IrrigationRepository {


  constructor() {

    this.key = "irrigations";

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

      irrigation =>

        String(irrigation.id) === String(id)

    ) || null;


  }





  create(data) {


    if (!data) {

      throw new Error(
        "Irrigation data is required"
      );

    }



    const irrigations =
      this.getAll();



    const irrigation = {


      id:
        Date.now().toString(),



      ...data,



      createdAt:
        new Date().toISOString(),



      updatedAt:
        new Date().toISOString()


    };



    irrigations.push(
      irrigation
    );



    storageService.save(

      this.key,

      irrigations

    );



    return irrigation;


  }





  update(id,data) {


    const irrigations =
      this.getAll();



    const index =
      irrigations.findIndex(

        irrigation =>

          String(irrigation.id)
          ===
          String(id)

      );



    if (index === -1) {

      return null;

    }




    const updated = {


      ...irrigations[index],


      ...data,



      id:
        irrigations[index].id,



      updatedAt:
        new Date().toISOString()


    };



    irrigations[index] =
      updated;



    storageService.save(

      this.key,

      irrigations

    );



    return updated;


  }





  delete(id) {


    const irrigations =
      this.getAll();



    const filtered =

      irrigations.filter(

        irrigation =>

          String(irrigation.id)
          !==
          String(id)

      );



    if (
      filtered.length ===
      irrigations.length
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

  new IrrigationRepository()

);
