// src/services/fieldService.js

import fieldRepository from "../repositories/fieldRepository.js";


class FieldService {


  constructor() {

    this.repository = fieldRepository;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "FIELD_ID_REQUIRED"
      );

    }


    const field =
      await this.repository.getById(id);


    if (!field) {

      throw new Error(
        "FIELD_NOT_FOUND"
      );

    }


    return field;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "FIELD_ID_REQUIRED"
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
        "FIELD_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "FIELD_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "FIELD_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }


    const field =
      await this.repository.getById(id);


    return Boolean(field);

  }


  async count() {

    const fields =
      await this.repository.getAll();


    return fields.length;

  }


  validate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "FIELD_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "FIELD_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new FieldService()
);
