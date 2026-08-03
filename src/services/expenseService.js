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
        "EXPENSE_ID_REQUIRED"
      );

    }


    const expense =
      await this.repository.getById(id);


    if (!expense) {

      throw new Error(
        "EXPENSE_NOT_FOUND"
      );

    }


    return expense;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "EXPENSE_ID_REQUIRED"
      );

    }


    this.validate(data);


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "EXPENSE_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "EXPENSE_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
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
      await this.repository.getById(id);


    return Boolean(expense);

  }


  async count() {

    const expenses =
      await this.repository.getAll();


    return expenses.length;

  }


  validate(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "EXPENSE_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "EXPENSE_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new ExpenseService()
);
