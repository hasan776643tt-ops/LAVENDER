// src/validators/diseaseValidator.js


export const diseaseValidator = {


  validate(disease) {


    const errors = {};



    if (!disease?.name?.trim()) {

      errors.name =
        "اسم المرض مطلوب";

    }



    if (!disease?.cropId) {

      errors.cropId =
        "يجب اختيار المحصول";

    }



    if (!disease?.description?.trim()) {

      errors.description =
        "وصف المرض مطلوب";

    }



    if (!disease?.status?.trim()) {

      errors.status =
        "حالة المرض مطلوبة";

    }



    return {

      valid:
        Object.keys(errors).length === 0,


      errors

    };


  }


};
