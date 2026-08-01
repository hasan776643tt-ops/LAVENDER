// src/services/expenseService.js

import expenseRepository
  from "../repositories/expenseRepository.js";


class ExpenseService {


  constructor() {

    this.repository =
      expenseRepository;

  }





  getAll() {

    return this.repository.getAll();

  }





  getById(id) {


    if (!id) {

      return null;

    }



    return this.repository.getById(id);

  }





  create(data) {


    if (!data) {

      throw new Error(
        "Expense data is required"
      );

    }



    return this.repository.create(data);

  }





  update(id, data) {


    if (!id) {

      throw new Error(
        "Expense id is required"
      );

    }



    const updatedExpense =

      this.repository.update(
        id,
        data
      );



    if (!updatedExpense) {

      throw new Error(
        "Expense not found"
      );

    }



    return updatedExpense;

  }





  delete(id) {


    if (!id) {

      throw new Error(
        "Expense id is required"
      );

    }



    const deleted =

      this.repository.delete(id);



    if (!deleted) {

      throw new Error(
        "Expense not found"
      );

    }



    return true;

  }





  count() {

    return this.repository.count();

  }





  exists(id) {

    return this.repository.exists(id);

  }





}



const expenseService =
  new ExpenseService();



export default Object.freeze(
  expenseService
);
