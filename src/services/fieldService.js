// src/services/fieldService.js

import fieldRepository
  from "../repositories/fieldRepository.js";

import {
  createError,
} from "../utils/errorHandler.js";


class FieldService {

  constructor() {

    this.repository =
      fieldRepository;

  }


  // =======================================================
  // GET ALL FIELDS
  // =======================================================

  async getAll() {

    const fields =
      await this.repository.getAll();

    return Array.isArray(fields)
      ? fields
      : [];

  }


  // =======================================================
  // GET FIELD BY ID
  // =======================================================

  async getById(id) {

    this.validateId(id);

    const field =
      await this.repository.getById(
        id
      );

    if (!field) {

      throw createError(
        "Field not found",
        "FIELD_NOT_FOUND"
      );

    }

    return field;

  }


  // =======================================================
  // CREATE FIELD
  // =======================================================

  async create(data) {

    this.validateCreate(data);

    return this.repository.create(
      data
    );

  }


  // =======================================================
  // UPDATE FIELD
  // =======================================================

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
        "Field not found",
        "FIELD_NOT_FOUND"
      );

    }

    return updated;

  }


  // =======================================================
  // DELETE FIELD
  // =======================================================

  async delete(id) {

    this.validateId(id);

    const deleted =
      await this.repository.delete(
        id
      );

    if (!deleted) {

      throw createError(
        "Field not found",
        "FIELD_NOT_FOUND"
      );

    }

    return true;

  }


  // =======================================================
  // EXISTS
  // =======================================================

  async exists(id) {

    if (!id) {

      return false;

    }

    const field =
      await this.repository.getById(
        id
      );

    return Boolean(field);

  }


  // =======================================================
  // COUNT
  // =======================================================

  async count() {

    const fields =
      await this.repository.getAll();

    return Array.isArray(fields)
      ? fields.length
      : 0;

  }


  // =======================================================
  // VALIDATE ID
  // =======================================================

  validateId(id) {

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {

      throw createError(
        "Field id is required",
        "FIELD_ID_REQUIRED"
      );

    }

    return true;

  }


  // =======================================================
  // VALIDATE CREATE
  // =======================================================

  validateCreate(data) {

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {

      throw createError(
        "Field data is required",
        "FIELD_DATA_REQUIRED"
      );

    }


    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {

      throw createError(
        "Field name is required",
        "FIELD_NAME_REQUIRED"
      );

    }

    return true;

  }


  // =======================================================
  // VALIDATE UPDATE
  // =======================================================

  validateUpdate(data) {

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {

      throw createError(
        "Field data is required",
        "FIELD_DATA_REQUIRED"
      );

    }

    return true;

  }

}


// =========================================================
// EXPORT
// =========================================================

export default Object.freeze(
  new FieldService()
);
