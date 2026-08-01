// src/controllers/expenseController.js

import expenseService
  from "../services/expenseService.js";



class ExpenseController {


  constructor() {

    this.service =
      expenseService;

  }





  async getExpenses() {


    try {


      return await this.service.getAll();



    } catch(error) {


      throw new Error(

        `ExpenseController getExpenses failed: ${error.message}`

      );


    }


  }





  async getExpenseById(id) {


    try {


      return await this.service.getById(

        id

      );



    } catch(error) {


      throw new Error(

        `ExpenseController getExpenseById failed: ${error.message}`

      );


    }


  }





  async createExpense(expenseData) {


    try {


      return await this.service.create(

        expenseData

      );



    } catch(error) {


      throw new Error(

        `ExpenseController createExpense failed: ${error.message}`

      );


    }


  }





  async updateExpense(
    id,
    expenseData
  ) {


    try {


      return await this.service.update(

        id,

        expenseData

      );



    } catch(error) {


      throw new Error(

        `ExpenseController updateExpense failed: ${error.message}`

      );


    }


  }





  async deleteExpense(id) {


    try {


      return await this.service.delete(

        id

      );



    } catch(error) {


      throw new Error(

        `ExpenseController deleteExpense failed: ${error.message}`

      );


    }


  }





  async countExpenses() {


    try {


      return await this.service.count();



    } catch(error) {


      throw new Error(

        `ExpenseController countExpenses failed: ${error.message}`

      );


    }


  }





}



export default Object.freeze(

  new ExpenseController()

);
