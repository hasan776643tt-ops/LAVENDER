// src/services/harvestService.js

import harvestRepository from "../repositories/harvestRepository.js";


class HarvestService {


  constructor() {

    this.repository = harvestRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "HARVEST_ID_REQUIRED"
      );

    }


    const harvest =
      await this.repository.getById(id);


    if (!harvest) {

      throw new Error(
        "HARVEST_NOT_FOUND"
      );

    }


    return harvest;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "HARVEST_ID_REQUIRED"
      );

    }


    this.validate(data);


    const harvest =
      await this.repository.update(
        id,
        data
      );


    if (!harvest) {

      throw new Error(
        "HARVEST_NOT_FOUND"
      );

    }


    return harvest;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "HARVEST_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "HARVEST_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    const harvest =
      await this.repository.getById(id);


    return Boolean(harvest);

  }


  async count() {

    const harvests =
      await this.repository.getAll();


    return harvests.length;

  }


  validate(data) {

    if (!data) {

      throw new Error(
        "HARVEST_DATA_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new HarvestService()
);
