// src/validators/pesticideValidator.js


export const pesticideValidator = {


  validate(pesticide) {


    const errors = {};



    if (!pesticide?.name?.trim()) {

      errors.name =
        "اسم المبيد مطلوب";

    }



    if (!pesticide?.type?.trim()) {

      errors.type =
        "نوع المبيد مطلوب";

    }



    if (!pesticide?.fieldId) {

      errors.fieldId =
        "يجب اختيار الحقل";

    }



    if (
      pesticide?.quantity !== undefined &&
      pesticide.quantity !== "" &&
      Number(pesticide.quantity) <= 0
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
