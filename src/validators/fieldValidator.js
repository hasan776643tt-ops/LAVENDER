export const fieldValidator = {
  validate(field) {
    const errors = {};

    if (!field?.name?.trim()) {
      errors.name = "اسم الحقل مطلوب";
    }

    if (
      field?.area !== undefined &&
      field.area !== "" &&
      Number(field.area) <= 0
    ) {
      errors.area = "المساحة يجب أن تكون أكبر من صفر";
    }

    if (!field?.farmId) {
      errors.farmId = "يجب اختيار مزرعة";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
