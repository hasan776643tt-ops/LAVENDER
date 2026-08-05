// src/services/expenseService.js

import expenseRepository
from "../repositories/expenseRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class ExpenseService {



  constructor() {

    this.repository =
      expenseRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const expense =
      await this.repository.getById(id);



    if (!expense) {


      throw createError(

        "Expense not found",

        "EXPENSE_NOT_FOUND"

      );


    }



    return expense;


  }





  async create(data) {


    this.validateCreate(data);



    return this.repository.create(
      data
    );


  }





  async update(id, data) {


    this.validateId(id);


    this.validateUpdate(data);



    const updated =
      await this.repository.update(

        id,

        data

      );



    if (!updated) {


      throw createError(

        "Expense not found",

        "EXPENSE_NOT_FOUND"

      );


    }



    return updated;


  }





  async delete(id) {


    this.validateId(id);



    const deleted =
      await this.repository.delete(
        id
      );



    if (!deleted) {


      throw createError(

        "Expense not found",

        "EXPENSE_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const expense =
      await this.repository.getById(
        id
      );



    return Boolean(
      expense
    );


  }





  async count() {


    const expenses =
      await this.repository.getAll();



    return expenses.length;


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Expense id is required",

        "EXPENSE_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    this.validateData(data);



    if (
      !data.name ||
      !data.name.trim()
    ) {


      throw createError(

        "Expense name is required",

        "EXPENSE_NAME_REQUIRED"

      );


    }



    return true;


  }





  validateUpdate(data) {


    this.validateData(data);



    return true;


  }





  validateData(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {


      throw createError(

        "Expense data is required",

        "EXPENSE_DATA_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new ExpenseService()

);
