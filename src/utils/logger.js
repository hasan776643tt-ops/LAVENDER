// src/utils/logger.js


const LEVELS = {


  INFO:
    "INFO",


  WARN:
    "WARN",


  ERROR:
    "ERROR",


  DEBUG:
    "DEBUG"


};




function createLogEntry(
  level,
  message,
  data = null
) {


  return {


    level,

    message,

    data,

    timestamp:
      new Date().toISOString()


  };


}




export function info(
  message,
  data = null
) {


  console.info(

    createLogEntry(

      LEVELS.INFO,

      message,

      data

    )

  );


}




export function warn(
  message,
  data = null
) {


  console.warn(

    createLogEntry(

      LEVELS.WARN,

      message,

      data

    )

  );


}




export function error(
  message,
  data = null
) {


  console.error(

    createLogEntry(

      LEVELS.ERROR,

      message,

      data

    )

  );


}




export function debug(
  message,
  data = null
) {


  console.debug(

    createLogEntry(

      LEVELS.DEBUG,

      message,

      data

    )

  );


}




export function getLevels() {


  return LEVELS;


}




export default {


  info,

  warn,

  error,

  debug,

  getLevels


};
