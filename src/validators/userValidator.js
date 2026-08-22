// src/validators/userValidator.js


import {
  createError
} from "../utils/errorHandler.js";



class UserValidator {


  validateCreate(data) {

    return this.validate(data);

  }



  validateUpdate(data) {

    return this.validate(
      data,
      true
    );

  }



  validate(
    user,
    isUpdate = false
  ) {


    const errors = {};



    if (
      !isUpdate ||
      user?.name !== undefined
    ) {

      if (
        !user?.name ||
        !String(user.name).trim()
      ) {

        errors.name =
          "User name is required";

      }

    }



    if (
      !isUpdate ||
      user?.email !== undefined
    ) {

      if (
        !user?.email ||
        !String(user.email).trim()
      ) {

        errors.email =
          "User email is required";

      } else {

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
          !emailRegex.test(
            String(user.email).trim()
          )
        ) {

          errors.email =
            "User email is invalid";

        }

      }

    }



    if (
      !isUpdate ||
      user?.role !== undefined
    ) {

      if (
        !user?.role ||
        !String(user.role).trim()
      ) {

        errors.role =
          "User role is required";

      }

    }



    if (
      user?.status !== undefined &&
      !String(user.status).trim()
    ) {

      errors.status =
        "User status is invalid";

    }



    if (
      Object.keys(errors).length > 0
    ) {

      throw createError(

        Object.values(errors).join(", "),

        "USER_VALIDATION_ERROR"

      );

    }



    return true;

  }

}



export default Object.freeze(

  new UserValidator()

);
