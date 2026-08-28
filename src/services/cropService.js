// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";

import {
  createError,
} from "../utils/errorHandler.js";

const SEEDS = {
  cold: [
    "قمح شتوي",
    "شعير",
    "شوفان",
  ],

  moderate: [
    "قمح",
    "شعير",
    "ذرة",
    "عباد الشمس",
  ],

  hot: [
    "ذرة",
    "دخن",
    "سورغم",
    "سمسم",
  ],
};

function getClimate(latitude) {
  const value = Number(latitude);

  if (!Number.isFinite(value)) {
    return null;
  }

  const n = Math.abs(value);

  if (n >= 50) return "باردة";
  if (n >= 25) return "معتدلة";

  return "حارة";
}

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

    return cropRepository.create({
      ...data,
      status:
        data.status || "active",
    });
  }

  async update(id, data) {
    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    this.validate(data);

    const updated =
      await cropRepository.update(
        id,
        data
      );

    if (!updated) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return updated;
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

  getRecommendation(latitude) {
    const climate =
      getClimate(latitude);

    if (!climate) {
      return null;
    }

    const key =
      climate === "باردة"
        ? "cold"
        : climate === "معتدلة"
          ? "moderate"
          : "hot";

    return {
      climate,
      seeds:
        SEEDS[key] || [],
      message:
        `المناخ ${climate}، وهذه بذور مناسبة مبدئيًا لهذه المنطقة.`,
    };
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
      !String(data.name ?? "").trim()
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
