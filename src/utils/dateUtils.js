// src/utils/dateUtils.js


import logger
from "./logger.js";



// ===============================
// Get Current Date
// ===============================


export function getCurrentDate() {


  return new Date()

    .toLocaleDateString(
      "en-CA"
    );


}






// ===============================
// Create Timestamp
// ===============================


export function createTimestamp() {


  return new Date()

    .toISOString();


}






// ===============================
// Format Date
// ===============================


export function formatDate(
  date,
  locale = "ar-SY"
) {


  if(
    !date
  ) {


    return "";


  }



  const parsedDate =

    new Date(
      date
    );



  if(
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {


    logger.warn(

      "Invalid date format",

      date

    );


    return "";


  }



  return parsedDate

    .toLocaleDateString(
      locale
    );


}






// ===============================
// Check Valid Date
// ===============================


export function isValidDate(
  date
) {


  if(
    !date
  ) {


    return false;


  }



  return !Number.isNaN(

    new Date(date)

      .getTime()

  );


}






// ===============================
// Format Date Time
// ===============================


export function formatDateTime(
  date,
  locale = "ar-SY"
) {


  if(
    !isValidDate(date)
  ) {


    return "";


  }



  return new Date(date)

    .toLocaleString(
      locale
    );


}






// ===============================
// Compare Dates
// ===============================


export function compareDates(
  firstDate,
  secondDate
) {


  const first =

    new Date(
      firstDate
    )
    .getTime();



  const second =

    new Date(
      secondDate
    )
    .getTime();



  if(
    first > second
  ) {


    return 1;


  }



  if(
    first < second
  ) {


    return -1;


  }



  return 0;


}






export default {


  getCurrentDate,

  createTimestamp,

  formatDate,

  isValidDate,

  formatDateTime,

  compareDates


};
