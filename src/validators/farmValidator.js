export const farmValidator = {

  validate(farm) {

    const errors = {};

    if (!farm || typeof farm !== "object") {
      return {
        valid: false,
        errors: {
          farm: "بيانات المزرعة غير صحيحة",
        },
      };
    }


    if (!farm.name?.trim()) {
      errors.name = "اسم المزرعة مطلوب";
    }


    if (!farm.owner?.trim()) {
      errors.owner = "اسم المالك مطلوب";
    }


    if (
      farm.area !== undefined &&
      farm.area !== "" &&
      (isNaN(Number(farm.area)) ||
      Number(farm.area) <= 0)
    ) {
      errors.area = "المساحة يجب أن تكون رقم أكبر من صفر";
    }


    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };

  },

};
