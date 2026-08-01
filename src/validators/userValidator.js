// src/validators/userValidator.js


class UserValidator {


  validate(user) {


    const errors = {};



    if(!user?.name?.trim()) {


      errors.name =
        "User name is required";


    }




    if(!user?.email?.trim()) {


      errors.email =
        "User email is required";


    } else {


      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



      if(!emailRegex.test(user.email)) {


        errors.email =
          "User email is invalid";


      }


    }




    if(!user?.role?.trim()) {


      errors.role =
        "User role is required";


    }




    if(Object.keys(errors).length){


      throw new Error(

        Object.values(errors).join(", ")

      );


    }




    return true;


  }


}





export default Object.freeze(

  new UserValidator()

);
