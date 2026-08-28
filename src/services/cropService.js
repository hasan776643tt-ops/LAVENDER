// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";

import {
  createError,
} from "../utils/errorHandler.js";

class CropService {
  constructor() {
    this.repository = cropRepository;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id) {
    this.validateId(id);

    const crop =
      await this.repository.getById(id);

    if (!crop) {
      throw createError(
        "Crop not found",
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
    this.validateId(id);
    this.validate(data);

    const crop =
      await this.repository.update(id, data);

    if (!crop) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return crop;
  }

  async delete(id) {
    this.validateId(id);

    const deleted =
      await this.repository.delete(id);

    if (!deleted) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return true;
  }

  validateId(id) {
    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }
  }

  validate(data) {
    if (!data || typeof data !== "object") {
      throw createError(
        "Crop data is required",
        "CROP_DATA_REQUIRED"
      );
    }

    if (!data.farmId) {
      throw createError(
        "Farm is required",
        "CROP_FARM_REQUIRED"
      );
    }

    if (!data.fieldId) {
      throw createError(
        "Field is required",
        "CROP_FIELD_REQUIRED"
      );
    }

    if (!String(data.name || "").trim()) {
      throw createError(
        "Crop name is required",
        "CROP_NAME_REQUIRED"
      );
    }
  }
}

export default Object.freeze(
  new CropService()
);
