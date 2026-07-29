// src/services/farmService.js

import farmRepository
  from "../repositories/farmRepository.js";



const success = (
  data,
  message = "Success"
) => ({
  success: true,
  message,
  data
});



const failure = (
  message,
  error = null
) => ({
  success: false,
  message,
  error
});




// جلب جميع المزارع

export const getFarmsService =
async () => {

  try {

    const farms =
      await farmRepository.getAll();

    return success(
      farms,
      "Farms loaded successfully"
    );

  } catch (error) {

    return failure(
      "Failed to load farms",
      error.message
    );

  }

};




// جلب مزرعة حسب المعرف

export const getFarmByIdService =
async (id) => {

  try {

    const farm =
      await farmRepository.getById(
        id
      );

    return success(
      farm,
      "Farm loaded successfully"
    );

  } catch (error) {

    return failure(
      "Failed to load farm",
      error.message
    );

  }

};




// إنشاء مزرعة

export const createFarmService =
async (farmData) => {

  try {

    if (!farmData.name) {

      return failure(
        "Farm name is required"
      );

    }

    const farm =
      await farmRepository.create(
        farmData
      );

    return success(
      farm,
      "Farm created successfully"
    );

  } catch (error) {

    return failure(
      "Failed to create farm",
      error.message
    );

  }

};




// تعديل مزرعة

export const updateFarmService =
async (
  id,
  farmData
) => {

  try {

    const farm =
      await farmRepository.update(
        id,
        farmData
      );

    return success(
      farm,
      "Farm updated successfully"
    );

  } catch (error) {

    return failure(
      "Failed to update farm",
      error.message
    );

  }

};




// حذف مزرعة

export const deleteFarmService =
async (id) => {

  try {

    await farmRepository.delete(
      id
    );

    return success(
      null,
      "Farm deleted successfully"
    );

  } catch (error) {

    return failure(
      "Failed to delete farm",
      error.message
    );

  }

};
