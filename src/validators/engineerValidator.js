// src/validators/engineerValidator.js


export function validateEngineer(
  data = {}
) {


  const errors = {};



  if (
    !data.name ||
    data.name.trim() === ""
  ) {

    errors.name =
      "Engineer name is required";

  }



  if (
    !data.email ||
    data.email.trim() === ""
  ) {

    errors.email =
      "Engineer email is required";

  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(data.email)
  ) {

    errors.email =
      "Invalid email format";

  }



  if (
    !data.phone ||
    data.phone.trim() === ""
  ) {

    errors.phone =
      "Engineer phone is required";

  }



  if (
    !data.specialization ||
    data.specialization.trim() === ""
  ) {

    errors.specialization =
      "Engineer specialization is required";

  }



  if (
    data.experience !== undefined &&
    Number(data.experience) < 0
  ) {

    errors.experience =
      "Experience cannot be negative";

  }



  return {


    isValid:
      Object.keys(errors).length === 0,


    errors


  };


}



export default validateEngineer;
