export const userValidator = {
  validate(user) {
    const errors = {};

    if (!user?.name?.trim()) {
      errors.name = "الاسم مطلوب";
    }

    if (!user?.email?.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(user.email)) {
        errors.email = "البريد الإلكتروني غير صالح";
      }
    }

    if (!user?.role?.trim()) {
      errors.role = "الدور مطلوب";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
