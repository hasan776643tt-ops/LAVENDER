 // src/repositories/expenseRepository.js

import storageService
  from "../services/storageService.js";


class ExpenseRepository {


  constructor() {

    this.key = "expenses";

  }





  getAll() {

    return storageService.load(
      this.key,
      []
    );

  }





  getById(id) {


    if (!id) {

      return null;

    }



    const expenses =
      this.getAll();



    return expenses.find(

      expense =>

      String(expense.id) === String(id)

    ) || null;


  }





  create(expenseData) {


    if (!expenseData) {

      throw new Error(
        "Expense data is required"
      );

    }



    const expenses =
      this.getAll();



    const expense = {


      id:
        Date.now().toString(),


      ...expenseData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    expenses.push(
      expense
    );



    storageService.save(

      this.key,

      expenses

    );



    return expense;


  }





  update(id, data) {


    const expenses =
      this.getAll();



    const index =

      expenses.findIndex(

        expense =>

        String(expense.id) === String(id)

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

      this.key,

      expenses

    );



    return updatedExpense;


  }





  delete(id) {


    const expenses =
      this.getAll();



    const filtered =

      expenses.filter(

        expense =>

        String(expense.id) !== String(id)

      );



    const deleted =

      filtered.length !== expenses.length;



    if (deleted) {


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  exists(id) {


    return Boolean(

      this.getById(id)

    );

  }





  count() {


    return this.getAll().length;


  }





}



export default Object.freeze(

  new ExpenseRepository()

);
