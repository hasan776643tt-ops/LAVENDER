// src/repositories/expenseRepository.js

import storageService from "../services/storageService.js";


class ExpenseRepository {


  constructor() {

    this.key = "expenses";

  }


  async getAll() {

    return storageService.load(
      this.key,
      []
    );

  }


  async getById(id) {

    if (!id) {
      return null;
    }


    const expenses =
      await this.getAll();


    return (
      expenses.find(
        expense =>
          String(expense.id) === String(id)
      ) || null
    );

  }


  async create(data) {

    const expenses =
      await this.getAll();


    expenses.push(data);


    storageService.save(
      this.key,
      expenses
    );


    return data;

  }


  async update(id, data) {

    const expenses =
      await this.getAll();


    const index =
      expenses.findIndex(
        expense =>
          String(expense.id) === String(id)
      );


    if (index === -1) {
      return null;
    }


    expenses[index] = {
      ...expenses[index],
      ...data
    };


    storageService.save(
      this.key,
      expenses
    );


    return expenses[index];

  }


  async delete(id) {

    const expenses =
      await this.getAll();


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


}


export default Object.freeze(
  new ExpenseRepository()
);
