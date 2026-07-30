// src/validators/fieldValidator.js


export const fieldValidator = {


  validate(field) {


    const errors = {};



    if (!field || typeof field !== "object") {


      return {

        valid: false,

        errors: {

          field:
            "بيانات الحقل غير صحيحة"

        }

      };


    }




    if (!field.name?.trim()) {


      errors.name =
        "اسم الحقل مطلوب";


    }




    if (

      field.area !== undefined &&

      field.area !== "" &&

      (

        isNaN(Number(field.area)) ||

        Number(field.area) <= 0

      )

    ) {


      errors.area =
        "المساحة يجب أن تكون رقم أكبر من صفر";


    }




    if (!field.farmId) {


      errors.farmId =
        "يجب اختيار مزرعة";


    }




    return {


      valid:
        Object.keys(errors).length === 0,


      errors


    };


  },


};
