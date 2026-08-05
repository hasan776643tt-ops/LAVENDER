// src/validators/reportValidator.js


export function validateReport(
  data = {}
) {


  const errors = {};



  if (
    !data.title ||
    data.title.trim() === ""
  ) {

    errors.title =
      "Report title is required";

  }



  if (
    !data.type ||
    data.type.trim() === ""
  ) {

    errors.type =
      "Report type is required";

  }



  if (
    !data.farmId
  ) {

    errors.farmId =
      "Farm reference is required";

  }



  if (
    !data.createdAt
  ) {

    errors.createdAt =
      "Report creation date is required";

  }



  if (
    data.content &&
    typeof data.content !== "string"
  ) {

    errors.content =
      "Report content must be text";

  }



  return {


    isValid:
      Object.keys(errors).length === 0,


    errors


  };


}



export default validateReport;
