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

  const value =
    Number(latitude);


  if (
    !Number.isFinite(value)
  ) {

    return null;

  }


  const n =
    Math.abs(value);


  if (n >= 50) {
    return "باردة";
  }


  if (n >= 25) {
    return "معتدلة";
  }


  return "حارة";

}


class CropService {


  // =======================================================
  // GET ALL
  // =======================================================

  async getAll() {

    return cropRepository.getAll();

  }


  // =======================================================
  // GET BY ID
  // =======================================================

  async getById(id) {

    if (!id) {

      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );

    }


    const crop =
      await cropRepository.getById(
        id
      );


    if (!crop) {

      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );

    }


    return crop;

  }


  // =======================================================
  // CREATE
  // =======================================================

  async create(data) {

    this.validate(data);


    return cropRepository.create({

      ...data,

      status:
        data.status ||
        "active",

    });

  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(
    id,
    data
  ) {

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


  // =======================================================
  // DELETE
  // =======================================================

  async delete(id) {

    if (!id) {

      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );

    }


    const deleted =
      await cropRepository.delete(
        id
      );


    if (!deleted) {

      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );

    }


    return true;

  }


  // =======================================================
  // RECOMMENDATION
  // =======================================================

  getRecommendation(
    latitude
  ) {

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


  // =======================================================
  // VALIDATE
  // =======================================================

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


    // -----------------------------------------------------
    // المزرعة مطلوبة لجميع أنواع المحاصيل
    // -----------------------------------------------------

    if (!data.farmId) {

      throw createError(
        "Farm is required",
        "CROP_FARM_REQUIRED"
      );

    }


    // -----------------------------------------------------
    // تحديد نوع الزراعة
    // -----------------------------------------------------

    const type =
      data.cultivationType ||
      "field";


    // -----------------------------------------------------
    // الأشجار / البستان
    //
    // الأشجار تعتمد على:
    // treeType
    //
    // ولا نطلب name.
    // -----------------------------------------------------

    if (
      type === "trees"
    ) {

      if (
        !String(
          data.treeType ?? ""
        ).trim()
      ) {

        throw createError(
          "Tree type is required",
          "CROP_TREE_TYPE_REQUIRED"
        );

      }

    }


    // -----------------------------------------------------
    // الحقول والخضروات وغيرها
    //
    // تعتمد على:
    // name
    // -----------------------------------------------------

    else {

      if (
        !String(
          data.name ?? ""
        ).trim()
      ) {

        throw createError(
          "Crop name is required",
          "CROP_NAME_REQUIRED"
        );

      }

    }


    return true;

  }

}


export default Object.freeze(
  new CropService()
);
