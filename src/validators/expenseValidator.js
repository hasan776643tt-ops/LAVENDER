// src/validators/expenseValidator.js


export function validateExpense(
  data = {}
) {


  const errors = {};



  if (
    !data.type ||
    data.type.trim() === ""
  ) {

    errors.type =
      "Expense type is required";

  }



  if (
    data.amount === undefined ||
    data.amount === null ||
    Number(data.amount) <= 0
  ) {

    errors.amount =
      "Expense amount must be greater than zero";

  }



  if (
    !data.date
  ) {

    errors.date =
      "Expense date is required";

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



export default validateExpense;
