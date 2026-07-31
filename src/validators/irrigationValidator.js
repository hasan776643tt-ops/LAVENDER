// src/validators/irrigationValidator.js


export const irrigationValidator = {


  validate(irrigation) {


    const errors = {};



    if (!irrigation?.fieldId) {

      errors.fieldId =
        "يجب اختيار الحقل";

    }



    if (!irrigation?.type?.trim()) {

      errors.type =
        "نوع الري مطلوب";

    }



    if (!irrigation?.date?.trim()) {

      errors.date =
        "تاريخ الري مطلوب";

    }



    if (
      irrigation?.quantity !== undefined &&
      irrigation.quantity !== "" &&
      Number(irrigation.quantity) <= 0
    ) {

      errors.quantity =
        "كمية المياه يجب أن تكون أكبر من صفر";

    }



    return {

      valid:
        Object.keys(errors).length === 0,


      errors

    };


  }


};
