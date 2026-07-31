// src/validators/fertilizerValidator.js


export const fertilizerValidator = {


  validate(fertilizer) {


    const errors = {};



    if (!fertilizer?.name?.trim()) {

      errors.name =
        "اسم السماد مطلوب";

    }



    if (!fertilizer?.type?.trim()) {

      errors.type =
        "نوع السماد مطلوب";

    }



    if (!fertilizer?.fieldId) {

      errors.fieldId =
        "يجب اختيار الحقل";

    }



    if (
      fertilizer?.quantity !== undefined &&
      fertilizer.quantity !== "" &&
      Number(fertilizer.quantity) <= 0
    ) {

      errors.quantity =
        "الكمية يجب أن تكون أكبر من صفر";

    }



    return {

      valid:
        Object.keys(errors).length === 0,


      errors

    };


  }


};
