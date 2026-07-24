export const farmValidator = {
  validate(farm) {
    const errors = {};

    if (!farm?.name?.trim()) {
      errors.name = "اسم المزرعة مطلوب";
    }

    if (!farm?.owner?.trim()) {
      errors.owner = "اسم المالك مطلوب";
    }

    if (
      farm?.area !== undefined &&
      farm.area !== "" &&
      Number(farm.area) <= 0
    ) {
      errors.area = "المساحة يجب أن تكون أكبر من صفر";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
