// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";

import {
  createError,
} from "../utils/errorHandler.js";

class CropService {

  async getAll() {
    return cropRepository.getAll();
  }

  async getById(id) {

    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    const crop =
      await cropRepository.getById(id);

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

    return cropRepository.create(data);
  }

  async update(id, data) {

    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    this.validate(data);

    const crop =
      await cropRepository.update(
        id,
        data
      );

    if (!crop) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return crop;
  }

  async delete(id) {

    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    const deleted =
      await cropRepository.delete(id);

    if (!deleted) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return true;
  }

  validate(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw createError(
        "Crop data is required",
        "CROP_DATA_REQUIRED"
      );
    }

    if (
      !String(data.name || "").trim()
    ) {
      throw createError(
        "Crop name is required",
        "CROP_NAME_REQUIRED"
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

    return true;
  }
}

export default Object.freeze(
  new CropService()
);
