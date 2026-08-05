// src/validators/harvestValidator.js


export function validateHarvest(
  data = {}
) {


  const errors = {};



  if (
    !data.cropId
  ) {

    errors.cropId =
      "Crop reference is required";

  }



  if (
    data.quantity === undefined ||
    data.quantity === null ||
    Number(data.quantity) <= 0
  ) {

    errors.quantity =
      "Harvest quantity must be greater than zero";

  }



  if (
    !data.harvestDate
  ) {

    errors.harvestDate =
      "Harvest date is required";

  }



  if (
    data.quality &&
    typeof data.quality !== "string"
  ) {

    errors.quality =
      "Harvest quality must be text";

  }



  if (
    data.farmId === undefined ||
    data.farmId === null ||
    data.farmId === ""
  ) {

    errors.farmId =
      "Farm reference is required";

  }



  return {


    isValid:
      Object.keys(errors).length === 0,


    errors


  };


}



export default validateHarvest;
