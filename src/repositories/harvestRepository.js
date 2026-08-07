// src/repositories/harvestRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class HarvestRepository {


  constructor() {

    this.key =
      "harvests";

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



    const harvests =

      await this.getAll();



    return (

      harvests.find(

        harvest =>

          String(harvest.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Harvest data is required",

        "HARVEST_DATA_REQUIRED"

      );


    }



    const harvests =

      await this.getAll();



    const now =

      new Date().toISOString();



    const harvest = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    harvests.push(

      harvest

    );



    await storageService.save(

      this.key,

      harvests

    );



    return harvest;


  }





  async update(
    id,
    changes
  ) {


    if (!id) {


      return null;


    }



    const harvests =

      await this.getAll();



    const index =

      harvests.findIndex(

        harvest =>

          String(harvest.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updatedHarvest = {


      ...harvests[index],


      ...changes,


      id:

        harvests[index].id,


      createdAt:

        harvests[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    harvests[index] =

      updatedHarvest;



    await storageService.save(

      this.key,

      harvests

    );



    return updatedHarvest;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const harvests =

      await this.getAll();



    const filtered =

      harvests.filter(

        harvest =>

          String(harvest.id) !== String(id)

      );



    const deleted =

      filtered.length !== harvests.length;



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


    const harvests =

      await this.getAll();



    return harvests.length;


  }


}





const harvestRepository =

  new HarvestRepository();



export default Object.freeze(

  harvestRepository

);
