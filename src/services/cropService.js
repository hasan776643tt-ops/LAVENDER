// src/services/cropService.js

import cropRepository from "../repositories/cropRepository.js";


class CropService {


  constructor() {

    this.repository = cropRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "CROP_ID_REQUIRED"
      );

    }


    const crop =
      await this.repository.getById(id);


    if (!crop) {

      throw new Error(
        "CROP_NOT_FOUND"
      );

    }


    return crop;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "CROP_ID_REQUIRED"
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
        "CROP_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "CROP_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "CROP_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }


    const crop =
      await this.repository.getById(id);


    return Boolean(crop);

  }


  async count() {

    const crops =
      await this.repository.getAll();


    return crops.length;

  }


  validate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "CROP_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "CROP_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new CropService()
);
