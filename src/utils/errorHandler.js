// src/utils/errorHandler.js


export class AppError extends Error {


  constructor(
    message,
    code = "UNKNOWN_ERROR",
    details = null
  ) {


    super(message);


    this.name =
      "AppError";


    this.code =
      code;


    this.details =
      details;



  }


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



    details:
      null


  };


}




export function createError(
  message,
  code,
  details = null
) {


  return new AppError(

    message,

    code,

    details

  );


}




export function logError(
  error,
  context = ""
) {


  console.error(

    {

      context,

      error:
        handleError(
          error
        )

    }

  );


}




export default {


  AppError,

  handleError,

  createError,

  logError


};
