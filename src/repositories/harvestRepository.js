// src/repositories/harvestRepository.js

import storageService
  from "../services/storageService.js";


class HarvestRepository {


  constructor() {

    this.key = "harvests";

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



    const harvests =
      this.getAll();



    return harvests.find(

      harvest =>

      String(harvest.id) === String(id)

    ) || null;


  }





  create(harvestData) {


    if (!harvestData) {

      throw new Error(
        "Harvest data is required"
      );

    }



    const harvests =
      this.getAll();



    const harvest = {


      id:
        Date.now().toString(),


      ...harvestData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    harvests.push(
      harvest
    );



    storageService.save(

      this.key,

      harvests

    );



    return harvest;


  }





  update(id, data) {


    const harvests =
      this.getAll();



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


      ...data,


      id:
        harvests[index].id,


      updatedAt:
        new Date().toISOString()


    };



    harvests[index] =
      updatedHarvest;



    storageService.save(

      this.key,

      harvests

    );



    return updatedHarvest;


  }





  delete(id) {


    const harvests =
      this.getAll();



    const filtered =

      harvests.filter(

        harvest =>

        String(harvest.id) !== String(id)

      );



    const deleted =

      filtered.length !== harvests.length;



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

  new HarvestRepository()

);
