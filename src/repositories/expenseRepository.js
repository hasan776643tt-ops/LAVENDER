
// src/repositories/expenseRepository.js


import storageService
from "../services/storageService.js";



class ExpenseRepository {



constructor(){

  this.key =
  "expenses";

}




async getAll(){

  return storageService.load(
    this.key,
    []
  );

}




async getById(id){


  if(!id){

    return null;

  }



  const expenses =
  await this.getAll();



  return (
    expenses.find(

      expense =>

      String(expense.id)
      ===
      String(id)

    )
    || null
  );


}




async create(expenseData){


  if(!expenseData){

    throw new Error(
      "Expense data is required"
    );

  }



  const expenses =
  await this.getAll();



  const expense = {


    id:
    Date.now().toString(),


    ...expenseData,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  expenses.push(expense);



  storageService.save(

    this.key,

    expenses

  );



  return expense;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Expense id is required"
    );

  }



  const expenses =
  await this.getAll();



  const index =
  expenses.findIndex(

    expense =>

    String(expense.id)
    ===
    String(id)

  );



  if(index === -1){

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

    this.key,

    expenses

  );



  return updatedExpense;


}




async delete(id){


  const expenses =
  await this.getAll();



  const filtered =
  expenses.filter(

    expense =>

    String(expense.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== expenses.length;



  if(deleted){


    storageService.save(

      this.key,

      filtered

    );


  }



  return deleted;


}




async exists(id){

  return Boolean(
    await this.getById(id)
  );

}




async count(){


  const expenses =
  await this.getAll();


  return expenses.length;


}



}



export default Object.freeze(
  new ExpenseRepository()
);
