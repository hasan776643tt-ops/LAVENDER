// src/repositories/fertilizerRepository.js

import storageService from "../services/storageService.js";


class FertilizerRepository {


  constructor() {

    this.key = "fertilizers";

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

      fertilizer =>
        String(fertilizer.id) === String(id)

    ) || null;

  }



  create(fertilizerData) {


    const fertilizers =
      this.getAll();



    const fertilizer = {


      id:
        Date.now().toString(),


      ...fertilizerData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    fertilizers.push(
      fertilizer
    );



    storageService.save(

      this.key,

      fertilizers

    );



    return fertilizer;

  }



  update(id, data) {


    const fertilizers =
      this.getAll();



    const index =
      fertilizers.findIndex(

        fertilizer =>
          String(fertilizer.id) === String(id)

      );



    if (index === -1) {

      return null;

    }



    const updatedFertilizer = {


      ...fertilizers[index],


      ...data,


      id:
        fertilizers[index].id,


      updatedAt:
        new Date().toISOString()


    };



    fertilizers[index] =
      updatedFertilizer;



    storageService.save(

      this.key,

      fertilizers

    );



    return updatedFertilizer;

  }



  delete(id) {


    const fertilizers =
      this.getAll();



    const filtered =
      fertilizers.filter(

        fertilizer =>
          String(fertilizer.id) !== String(id)

      );



    const deleted =
      filtered.length !== fertilizers.length;



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

  new FertilizerRepository()

);
