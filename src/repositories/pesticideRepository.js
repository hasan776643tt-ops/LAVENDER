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
        String(pesticide.id) === String(id)

    ) || null;

  }



  create(pesticideData) {


    const pesticides =
      this.getAll();



    const pesticide = {


      id:
        Date.now().toString(),


      ...pesticideData,


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



  update(id, data) {


    const pesticides =
      this.getAll();



    const index =
      pesticides.findIndex(

        pesticide =>
          String(pesticide.id) === String(id)

      );



    if (index === -1) {

      return null;

    }



    const updatedPesticide = {


      ...pesticides[index],


      ...data,


      id:
        pesticides[index].id,


      updatedAt:
        new Date().toISOString()


    };



    pesticides[index] =
      updatedPesticide;



    storageService.save(

      this.key,

      pesticides

    );



    return updatedPesticide;

  }



  delete(id) {


    const pesticides =
      this.getAll();



    const filtered =
      pesticides.filter(

        pesticide =>
          String(pesticide.id) !== String(id)

      );



    const deleted =
      filtered.length !== pesticides.length;



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

  new PesticideRepository()

);
