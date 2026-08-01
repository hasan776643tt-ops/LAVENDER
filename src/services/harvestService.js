// src/services/harvestService.js

import harvestRepository
  from "../repositories/harvestRepository.js";


class HarvestService {


  constructor() {

    this.repository =
      harvestRepository;

  }





  getAll() {

    return this.repository.getAll();

  }





  getById(id) {


    if (!id) {

      return null;

    }



    return this.repository.getById(id);

  }





  create(data) {


    if (!data) {

      throw new Error(
        "Harvest data is required"
      );

    }



    return this.repository.create(data);

  }





  update(id, data) {


    if (!id) {

      throw new Error(
        "Harvest id is required"
      );

    }



    const updatedHarvest =

      this.repository.update(
        id,
        data
      );



    if (!updatedHarvest) {

      throw new Error(
        "Harvest not found"
      );

    }



    return updatedHarvest;

  }





  delete(id) {


    if (!id) {

      throw new Error(
        "Harvest id is required"
      );

    }



    const deleted =

      this.repository.delete(id);



    if (!deleted) {

      throw new Error(
        "Harvest not found"
      );

    }



    return true;

  }





  count() {

    return this.repository.count();

  }





  exists(id) {

    return this.repository.exists(id);

  }





}



const harvestService =
  new HarvestService();



export default Object.freeze(
  harvestService
);
