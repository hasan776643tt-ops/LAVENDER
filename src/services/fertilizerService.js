// src/services/fertilizerService.js

import fertilizerRepository from "../repositories/fertilizerRepository.js";

import {
  createError
} from "../utils/errorHandler.js";


class FertilizerService {

  constructor() {

    this.repository =
      fertilizerRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    this.validateId(id);

    const fertilizer =
      await this.repository.getById(id);

    if (!fertilizer) {

      throw createError(
        "Fertilizer not found",
        "FERTILIZER_NOT_FOUND"
      );

    }

    return fertilizer;

  }


  async create(data) {

    this.validateCreate(data);

    return this.repository.create(
      data
    );

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
        "Fertilizer not found",
        "FERTILIZER_NOT_FOUND"
      );

    }

    return updated;

  }


  async delete(id) {

    this.validateId(id);

    const deleted =
      await this.repository.delete(
        id
      );

    if (!deleted) {

      throw createError(
        "Fertilizer not found",
        "FERTILIZER_NOT_FOUND"
      );

    }

    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }

    const fertilizer =
      await this.repository.getById(
        id
      );

    return Boolean(
      fertilizer
    );

  }


  async count() {

    const fertilizers =
      await this.repository.getAll();

    return fertilizers.length;

  }


  validateId(id) {

    if (!id) {

      throw createError(
        "Fertilizer id is required",
        "FERTILIZER_ID_REQUIRED"
      );

    }

    return true;

  }


  validateCreate(data) {

    this.validateData(data);

    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw createError(
        "Fertilizer name is required",
        "FERTILIZER_NAME_REQUIRED"
      );

    }

    return true;

  }


  validateUpdate(data) {

    this.validateData(data);

    return true;

  }


  validateData(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw createError(
        "Fertilizer data is required",
        "FERTILIZER_DATA_REQUIRED"
      );

    }

    return true;

  }

}


export default Object.freeze(

  new FertilizerService()

);
