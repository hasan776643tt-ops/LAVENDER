export const cropValidator = {
  validate(crop) {
    const errors = {};

    if (!crop?.name?.trim()) {
      errors.name = "اسم المحصول مطلوب";
    }

    if (!crop?.season?.trim()) {
      errors.season = "الموسم مطلوب";
    }

    if (!crop?.fieldId) {
      errors.fieldId = "يجب اختيار حقل";
    }

    if (
      crop?.quantity !== undefined &&
      crop.quantity !== "" &&
      Number(crop.quantity) <= 0
    ) {
      errors.quantity = "الكمية يجب أن تكون أكبر من صفر";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
