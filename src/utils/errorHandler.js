// src/utils/errorHandler.js


import logger
from "./logger.js";



export class AppError extends Error {


  constructor(
    message,
    code = "UNKNOWN_ERROR",
    statusCode = 500,
    details = null
  ) {


    super(message);


    this.name =
      "AppError";


    this.code =
      code;


    this.statusCode =
      statusCode;


    this.details =
      details;


    Error.captureStackTrace(
      this,
      AppError
    );


  }


}





export function createError(
  message,
  code = "UNKNOWN_ERROR",
  statusCode = 500,
  details = null
) {


  return new AppError(

    message,

    code,

    statusCode,

    details

  );


}





export function handleError(
  error
) {


  if (
    error instanceof AppError
  ) {


    return {


      message:
        error.message,


      code:
        error.code,


      statusCode:
        error.statusCode,


      details:
        error.details


    };


  }





  return {


    message:

      error?.message ||

      "Unexpected error occurred",



    code:

      "UNKNOWN_ERROR",



    statusCode:

      500,



    details:

      null


  };


}





export function logError(
  error,
  context = ""
) {


  const formattedError =

    handleError(
      error
    );



  logger.error(

    context,

    formattedError

  );


}





export default {


  AppError,

  createError,

  handleError,

  logError


};
