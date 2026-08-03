// src/services/farmService.js

import farmRepository from "../repositories/farmRepository.js";


class FarmService {


  constructor() {

    this.repository = farmRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "FARM_ID_REQUIRED"
      );

    }


    const farm =
      await this.repository.getById(id);


    if (!farm) {

      throw new Error(
        "FARM_NOT_FOUND"
      );

    }


    return farm;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "FARM_ID_REQUIRED"
      );

    }


    this.validate(data);


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "FARM_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "FARM_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "FARM_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }


    const farm =
      await this.repository.getById(id);


    return Boolean(farm);

  }


  async count() {

    const farms =
      await this.repository.getAll();


    return farms.length;

  }


  validate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "FARM_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "FARM_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new FarmService()
);
