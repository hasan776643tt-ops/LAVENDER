import fieldRepository
  from "../repositories/fieldRepository.js";



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




// جلب جميع الحقول

export const getFieldsService =
async () => {

  try {

    const fields =
      await fieldRepository.getAll();

    return success(
      fields,
      "Fields loaded successfully"
    );

  } catch (error) {

    return failure(
      "Failed to load fields",
      error.message
    );

  }

};




// جلب حقل حسب المعرف

export const getFieldByIdService =
async (id) => {

  try {

    const field =
      await fieldRepository.getById(
        id
      );

    return success(
      field,
      "Field loaded successfully"
    );

  } catch (error) {

    return failure(
      "Failed to load field",
      error.message
    );

  }

};




// إنشاء حقل جديد

export const createFieldService =
async (fieldData) => {

  try {

    if (!fieldData.name) {

      return failure(
        "Field name is required"
      );

    }

    const field =
      await fieldRepository.create(
        fieldData
      );

    return success(
      field,
      "Field created successfully"
    );

  } catch (error) {

    return failure(
      "Failed to create field",
      error.message
    );

  }

};




// تعديل حقل

export const updateFieldService =
async (
  id,
  fieldData
) => {

  try {

    const field =
      await fieldRepository.update(
        id,
        fieldData
      );

    return success(
      field,
      "Field updated successfully"
    );

  } catch (error) {

    return failure(
      "Failed to update field",
      error.message
    );

  }

};




// حذف حقل

export const deleteFieldService =
async (id) => {

  try {

    await fieldRepository.delete(
      id
    );

    return success(
      null,
      "Field deleted successfully"
    );

  } catch (error) {

    return failure(
      "Failed to delete field",
      error.message
    );

  }

};
