// src/utils/index.js


// ===============================
// Create Unique ID
// ===============================

export const createId = () => {

  return (
    Date.now()
    +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );

};



// ===============================
// Date Formatter
// ===============================

export const formatDate = (date) => {

  if(!date)
    return "";

  return new Date(date)
    .toLocaleDateString("ar-SY");

};



// ===============================
// Safe JSON Parser
// ===============================

export const parseJSON = (
  value,
  fallback = null
) => {

  try {

    return JSON.parse(value);

  } catch {

    return fallback;

  }

};



// ===============================
// Safe String
// ===============================

export const safeString = (value) => {

  return value
    ? String(value).trim()
    : "";

};



// ===============================
// Number Converter
// ===============================

export const toNumber = (value) => {

  const result =
    Number(value);

  return Number.isNaN(result)
    ? 0
    : result;

};



// ===============================
// Empty Check
// ===============================

export const isEmpty = (value) => {

  return (
    value === null ||
    value === undefined ||
    value === ""
  );

};



// ===============================
// Remove Empty Values
// ===============================

export const cleanObject = (object) => {

  return Object.fromEntries(

    Object.entries(object)
      .filter(
        ([, value]) =>
          !isEmpty(value)
      )

  );

};



// ===============================
// Delay Helper
// ===============================

export const delay = (ms) => {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  );

};



// ===============================
// Error Handler
// ===============================

export const handleError = (
  error
) => {

  console.error(
    "LAVENDER Error:",
    error
  );

  return {
    success:false,
    message:
      error?.message ||
      "حدث خطأ غير معروف"
  };

};
