// src/validators/consultationValidator.js


export function validateConsultation(
  data = {}
) {


  const errors = {};



  if (
    !data.question ||
    data.question.trim() === ""
  ) {

    errors.question =
      "Consultation question is required";

  }



  if (
    !data.userId
  ) {

    errors.userId =
      "User reference is required";

  }



  if (
    data.engineerId === undefined ||
    data.engineerId === null
  ) {

    errors.engineerId =
      "Engineer reference is required";

  }



  if (
    data.status &&
    ![
      "pending",
      "answered",
      "closed"
    ].includes(
      data.status
    )
  ) {

    errors.status =
      "Invalid consultation status";

  }



  if (
    data.answer &&
    typeof data.answer !== "string"
  ) {

    errors.answer =
      "Consultation answer must be text";

  }



  if (
    data.attachments &&
    !Array.isArray(
      data.attachments
    )
  ) {

    errors.attachments =
      "Attachments must be an array";

  }



  return {


    isValid:
      Object.keys(errors).length === 0,


    errors


  };


}



export default validateConsultation;
