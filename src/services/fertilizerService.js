// src/services/fertilizerService.js

import fertilizerRepository from "../repositories/fertilizerRepository.js";


class FertilizerService {


  constructor() {

    this.repository = fertilizerRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "FERTILIZER_ID_REQUIRED"
      );

    }


    const fertilizer =
      await this.repository.getById(id);


    if (!fertilizer) {

      throw new Error(
        "FERTILIZER_NOT_FOUND"
      );

    }


    return fertilizer;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "FERTILIZER_ID_REQUIRED"
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
        "FERTILIZER_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "FERTILIZER_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
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
      await this.repository.getById(id);


    return Boolean(fertilizer);

  }


  async count() {

    const fertilizers =
      await this.repository.getAll();


    return fertilizers.length;

  }


  validate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "FERTILIZER_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "FERTILIZER_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new FertilizerService()
);
