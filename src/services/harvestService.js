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
        "Harvest id is required"
      );
    }


    const harvest =
      await this.repository.getById(id);


    if (!harvest) {
      throw new Error(
        "Harvest not found"
      );
    }


    return harvest;

  }


  async create(data) {

    this.validateHarvest(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error(
        "Harvest id is required"
      );
    }


    this.validateHarvest(data);


    const updatedHarvest =
      await this.repository.update(
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


  async delete(id) {

    if (!id) {
      throw new Error(
        "Harvest id is required"
      );
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error(
        "Harvest not found"
      );
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error(
        "Harvest id is required"
      );
    }


    return this.repository.exists(id);

  }


  validateHarvest(data) {

    if (!data) {
      throw new Error(
        "Harvest data is required"
      );
    }


    return true;

  }

}


const harvestService =
new HarvestService();


export default Object.freeze(
  harvestService
);
