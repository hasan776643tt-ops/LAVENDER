// src/utils/validators.js


// ===============================
// Empty Value Check
// ===============================

export function isEmpty(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return true;

  }


  if (
    typeof value === "string"
  ) {

    return value.trim() === "";

  }


  if (
    Array.isArray(value)
  ) {

    return value.length === 0;

  }


  if (
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

export function isRequired(value) {

  return !isEmpty(value);

}




// ===============================
// Number Validator
// ===============================

export function isNumber(value) {

  return (
    !Number.isNaN(
      Number(value)
    )
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
// Date Validator
// ===============================

export function isValidDate(
  value
) {

  return !Number.isNaN(
    new Date(value).getTime()
  );

}
