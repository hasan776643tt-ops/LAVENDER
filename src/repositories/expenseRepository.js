// src/repositories/expenseRepository.js

import {
  storageService
} from "../storage";

import {
  createError
} from "../utils/errorHandler.js";

import {
  createExpense
} from "../models/ExpenseModel.js";


class ExpenseRepository {

  constructor() {
    this.key = "expenses";
  }


  async getAll() {
    const expenses =
      await storageService.load(
        this.key,
        []
      );

    if (!Array.isArray(expenses)) {
      return [];
    }

    return expenses;
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
          String(expense.id) ===
          String(id)
      ) ?? null
    );
  }


  async getByFarmId(farmId) {

    if (!farmId) {
      return [];
    }

    const expenses =
      await this.getAll();

    return expenses.filter(
      expense =>
        String(expense.farmId) ===
        String(farmId)
    );
  }


  async getByCropId(cropId) {

    if (!cropId) {
      return [];
    }

    const expenses =
      await this.getAll();

    return expenses.filter(
      expense =>
        String(expense.cropId) ===
        String(cropId)
    );
  }


  async create(data) {

    if (!data) {
      throw createError(
        "Expense data is required",
        "EXPENSE_DATA_REQUIRED"
      );
    }

    const expenses =
      await this.getAll();

    const now =
      new Date().toISOString();

    const expense =
      createExpense({
        ...data,

        id:
          globalThis.crypto?.randomUUID?.() ||
          Date.now().toString(),

        createdAt: now,

        updatedAt: now
      }).toJSON();

    expenses.push(expense);

    await storageService.save(
      this.key,
      expenses
    );

    return expense;
  }


  async update(
    id,
    changes
  ) {

    if (!id) {
      return null;
    }

    const expenses =
      await this.getAll();

    const index =
      expenses.findIndex(
        expense =>
          String(expense.id) ===
          String(id)
      );

    if (index === -1) {
      return null;
    }

    const updatedExpense = {
      ...expenses[index],

      ...changes,

      id:
        expenses[index].id,

      createdAt:
        expenses[index].createdAt,

      updatedAt:
        new Date().toISOString()
    };

    if (
      updatedExpense.amount !==
      undefined
    ) {
      updatedExpense.amount =
        Number(
          updatedExpense.amount
        ) || 0;
    }

    if (
      updatedExpense.quantity !==
        undefined &&
      updatedExpense.quantity !== ""
    ) {
      updatedExpense.quantity =
        Number(
          updatedExpense.quantity
        ) || 0;
    }

    expenses[index] =
      updatedExpense;

    await storageService.save(
      this.key,
      expenses
    );

    return updatedExpense;
  }


  async delete(id) {

    if (!id) {
      return false;
    }

    const expenses =
      await this.getAll();

    const filtered =
      expenses.filter(
        expense =>
          String(expense.id) !==
          String(id)
      );

    const deleted =
      filtered.length !==
      expenses.length;

    if (deleted) {
      await storageService.save(
        this.key,
        filtered
      );
    }

    return deleted;
  }


  async exists(id) {
    return Boolean(
      await this.getById(id)
    );
  }


  async count() {

    const expenses =
      await this.getAll();

    return expenses.length;
  }
}


const expenseRepository =
  new ExpenseRepository();


export default Object.freeze(
  expenseRepository
);
