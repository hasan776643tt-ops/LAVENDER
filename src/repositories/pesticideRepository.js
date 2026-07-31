// src/repositories/pesticideRepository.js

import storageService from "../services/storageService.js";


class PesticideRepository {


  constructor() {

    this.key = "pesticides";

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

      pesticide =>

        String(pesticide.id)
        ===
        String(id)

    ) || null;


  }





  create(data) {


    if (!data) {

      throw new Error(
        "Pesticide data is required"
      );

    }



    const pesticides =
      this.getAll();



    const pesticide = {


      id:
        Date.now().toString(),



      ...data,



      createdAt:
        new Date().toISOString(),



      updatedAt:
        new Date().toISOString()


    };



    pesticides.push(
      pesticide
    );



    storageService.save(

      this.key,

      pesticides

    );



    return pesticide;


  }





  update(id,data) {


    const pesticides =
      this.getAll();



    const index =
      pesticides.findIndex(

        pesticide =>

          String(pesticide.id)
          ===
          String(id)

      );



    if (index === -1) {

      return null;

    }



    const updated = {


      ...pesticides[index],


      ...data,



      id:
        pesticides[index].id,



      updatedAt:
        new Date().toISOString()


    };



    pesticides[index] =
      updated;



    storageService.save(

      this.key,

      pesticides

    );



    return updated;


  }





  delete(id) {


    const pesticides =
      this.getAll();



    const filtered =

      pesticides.filter(

        pesticide =>

          String(pesticide.id)
          !==
          String(id)

      );



    if (
      filtered.length ===
      pesticides.length
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

  new PesticideRepository()

);
