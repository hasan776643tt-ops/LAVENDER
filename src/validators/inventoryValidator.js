// src/validators/inventoryValidator.js


export function validateInventory(
  data = {}
) {


  const errors = {};



  if (
    !data.name ||
    data.name.trim() === ""
  ) {

    errors.name =
      "Inventory item name is required";

  }



  if (
    !data.type ||
    data.type.trim() === ""
  ) {

    errors.type =
      "Inventory item type is required";

  }



  if (
    data.quantity === undefined ||
    data.quantity === null ||
    Number(data.quantity) < 0
  ) {

    errors.quantity =
      "Inventory quantity must be zero or greater";

  }



  if (
    !data.unit ||
    data.unit.trim() === ""
  ) {

    errors.unit =
      "Inventory unit is required";

  }



  if (
    data.minimumStock !== undefined &&
    Number(data.minimumStock) < 0
  ) {

    errors.minimumStock =
      "Minimum stock cannot be negative";

  }



  if (
    !data.farmId
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



export default validateInventory;
