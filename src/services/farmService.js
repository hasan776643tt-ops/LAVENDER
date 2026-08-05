// src/services/farmService.js

import farmRepository from "../repositories/farmRepository.js";

import {
  createError
} from "../utils/errorHandler.js";


class FarmService {

  constructor() {

    this.repository =
      farmRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    this.validateId(id);

    const farm =
      await this.repository.getById(id);

    if (!farm) {

      throw createError(
        "Farm not found",
        "FARM_NOT_FOUND"
      );

    }

    return farm;

  }


  async create(data) {

    this.validateCreate(data);

    return this.repository.create(data);

  }


  async update(
    id,
    data
  ) {

    this.validateId(id);

    this.validateUpdate(data);

    const updated =
      await this.repository.update(
        id,
        data
      );

    if (!updated) {

      throw createError(
        "Farm not found",
        "FARM_NOT_FOUND"
      );

    }

    return updated;

  }


  async delete(id) {

    this.validateId(id);

    const deleted =
      await this.repository.delete(id);

    if (!deleted) {

      throw createError(
        "Farm not found",
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


  validateId(id) {

    if (!id) {

      throw createError(
        "Farm id is required",
        "FARM_ID_REQUIRED"
      );

    }

    return true;

  }


  validateCreate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw createError(
        "Farm data is required",
        "FARM_DATA_REQUIRED"
      );

    }

    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw createError(
        "Farm name is required",
        "FARM_NAME_REQUIRED"
      );

    }

    return true;

  }


  validateUpdate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw createError(
        "Farm data is required",
        "FARM_DATA_REQUIRED"
      );

    }

    return true;

  }

}


export default Object.freeze(
  new FarmService()
);
