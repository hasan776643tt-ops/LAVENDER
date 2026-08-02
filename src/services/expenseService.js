// src/services/expenseService.js

import expenseRepository from "../repositories/expenseRepository.js";


class ExpenseService {


  constructor() {
    this.repository = expenseRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error(
        "Expense id is required"
      );
    }


    const expense =
      await this.repository.getById(id);


    if (!expense) {
      throw new Error(
        "Expense not found"
      );
    }


    return expense;

  }


  async create(data) {

    this.validateExpense(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error(
        "Expense id is required"
      );
    }


    this.validateExpense(data);


    const updatedExpense =
      await this.repository.update(
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


  async delete(id) {

    if (!id) {
      throw new Error(
        "Expense id is required"
      );
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error(
        "Expense not found"
      );
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error(
        "Expense id is required"
      );
    }


    return this.repository.exists(id);

  }


  validateExpense(data) {

    if (!data) {
      throw new Error(
        "Expense data is required"
      );
    }


    if (!data.name?.trim()) {
      throw new Error(
        "Expense name is required"
      );
    }


    return true;

  }

}


const expenseService =
new ExpenseService();


export default Object.freeze(
  expenseService
);
