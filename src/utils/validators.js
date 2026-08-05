// src/utils/validators.js


import logger
from "./logger.js";



// ===============================
// Empty Value Check
// ===============================


export function isEmpty(
  value
) {


  if(
    value === null ||
    value === undefined
  ) {


    return true;


  }



  if(
    typeof value === "string"
  ) {


    return value.trim() === "";


  }



  if(
    Array.isArray(value)
  ) {


    return value.length === 0;


  }



  if(
    typeof value === "object"
  ) {


    return Object.keys(value)
      .length === 0;


  }



  return false;


}






// ===============================
// Required Validator
// ===============================


export function isRequired(
  value
) {


  return !isEmpty(
    value
  );


}






// ===============================
// Number Validator
// ===============================


export function isNumber(
  value
) {


  if(
    value === null ||
    value === undefined ||
    value === ""
  ) {


    return false;


  }



  return !Number.isNaN(

    Number(value)

  );


}






// ===============================
// Positive Number Validator
// ===============================


export function isPositiveNumber(
  value
) {


  return (

    isNumber(value)

    &&

    Number(value) > 0

  );


}






// ===============================
// Non Negative Number Validator
// ===============================


export function isNonNegativeNumber(
  value
) {


  return (

    isNumber(value)

    &&

    Number(value) >= 0

  );


}






// ===============================
// Date Validator
// ===============================


export function isValidDate(
  value
) {


  if(
    !value
  ) {


    return false;


  }



  return !Number.isNaN(

    new Date(value)

      .getTime()

  );


}






// ===============================
// Email Validator
// ===============================


export function isEmail(
  email
) {


  if(
    typeof email !== "string"
  ) {


    return false;


  }



  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(email);


}






// ===============================
// Length Validator
// ===============================


export function hasMinLength(
  value,
  length
) {


  return (

    typeof value === "string"

    &&

    value.length >= length

  );


}





export function hasMaxLength(
  value,
  length
) {


  return (

    typeof value === "string"

    &&

    value.length <= length

  );


}






// ===============================
// Safe Validation Runner
// ===============================


export function validate(
  rules = [],
  value
) {


  try {


    return rules.every(

      rule =>

        typeof rule === "function"

        &&

        rule(value)

    );


  } catch(error) {


    logger.error(

      "Validation error",

      error

    );


    return false;


  }


}





export default {


  isEmpty,

  isRequired,

  isNumber,

  isPositiveNumber,

  isNonNegativeNumber,

  isValidDate,

  isEmail,

  hasMinLength,

  hasMaxLength,

  validate


};
