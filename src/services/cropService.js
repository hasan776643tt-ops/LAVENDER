// src/services/cropService.js


import cropRepository
  from "../repositories/cropRepository.js";



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




// جلب جميع المحاصيل

export const getCropsService =
async () => {

  try {

    const crops =
      await cropRepository.getAll();


    return success(
      crops,
      "Crops loaded successfully"
    );


  } catch (error) {

    return failure(
      "Failed to load crops",
      error.message
    );

  }

};





// جلب محصول حسب المعرف

export const getCropByIdService =
async (id) => {

  try {

    const crop =
      await cropRepository.getById(
        id
      );


    return success(
      crop,
      "Crop loaded successfully"
    );


  } catch (error) {

    return failure(
      "Failed to load crop",
      error.message
    );

  }

};





// إنشاء محصول جديد

export const createCropService =
async (cropData) => {


  try {


    if (!cropData.name) {

      return failure(
        "Crop name is required"
      );

    }



    const crop =
      await cropRepository.create(
        cropData
      );



    return success(
      crop,
      "Crop created successfully"
    );



  } catch (error) {


    return failure(
      "Failed to create crop",
      error.message
    );


  }

};





// تعديل محصول

export const updateCropService =
async (
  id,
  cropData
) => {


  try {


    const crop =
      await cropRepository.update(
        id,
        cropData
      );



    return success(
      crop,
      "Crop updated successfully"
    );



  } catch (error) {


    return failure(
      "Failed to update crop",
      error.message
    );


  }

};





// حذف محصول

export const deleteCropService =
async (id) => {


  try {


    await cropRepository.delete(
      id
    );



    return success(
      null,
      "Crop deleted successfully"
    );



  } catch (error) {


    return failure(
      "Failed to delete crop",
      error.message
    );


  }

};
