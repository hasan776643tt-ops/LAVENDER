// src/api/expenseApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "expenses";



const generateId = () =>

  crypto?.randomUUID?.()
  ||
  Date.now().toString();



const getAll = async () => {

  return storageService.load(
    STORAGE_KEY,
    []
  );

};



const getById = async (id) => {


  if (!id) {

    throw new Error(
      "Expense id is required."
    );

  }



  const expenses =
    await getAll();



  return (

    expenses.find(

      expense =>

      String(expense.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Expense data is required."
    );

  }



  const expenses =
    await getAll();



  const expense = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  expenses.push(
    expense
  );



  storageService.save(

    STORAGE_KEY,

    expenses

  );



  return expense;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Expense id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Expense data is required."
    );

  }



  const expenses =
    await getAll();



  const index =
    expenses.findIndex(

      expense =>

      String(expense.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedExpense = {


    ...expenses[index],


    ...data,


    id:
      expenses[index].id,


    updatedAt:
      new Date().toISOString()


  };



  expenses[index] =
    updatedExpense;



  storageService.save(

    STORAGE_KEY,

    expenses

  );



  return updatedExpense;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Expense id is required."
    );

  }



  const expenses =
    await getAll();



  const filtered =
    expenses.filter(

      expense =>

      String(expense.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== expenses.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const expenseApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default expenseApi;
