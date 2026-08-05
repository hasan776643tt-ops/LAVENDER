// src/validators/weatherValidator.js


export function validateWeather(
  data = {}
) {


  const errors = {};



  if (
    data.latitude === undefined ||
    data.latitude === null
  ) {

    errors.latitude =
      "Latitude is required";

  }



  if (
    data.longitude === undefined ||
    data.longitude === null
  ) {

    errors.longitude =
      "Longitude is required";

  }



  if (
    data.temperature !== undefined &&
    typeof data.temperature !== "number"
  ) {

    errors.temperature =
      "Temperature must be a number";

  }



  if (
    data.humidity !== undefined &&
    (
      Number(data.humidity) < 0 ||
      Number(data.humidity) > 100
    )
  ) {

    errors.humidity =
      "Humidity must be between 0 and 100";

  }



  if (
    data.rainChance !== undefined &&
    (
      Number(data.rainChance) < 0 ||
      Number(data.rainChance) > 100
    )
  ) {

    errors.rainChance =
      "Rain chance must be between 0 and 100";

  }



  return {


    isValid:
      Object.keys(errors).length === 0,


    errors


  };


}



export default validateWeather;
