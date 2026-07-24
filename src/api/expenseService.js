import { DataModel } from "../context/DataModel";

export const expenseService = {
  getExpenses() {
    return DataModel.expenses;
  },

  addExpense(expense) {
    DataModel.expenses.push(expense);
  },

  updateExpense(id, data) {
    const index = DataModel.expenses.findIndex(e => e.id === id);

    if (index !== -1) {
      DataModel.expenses[index] = {
        ...DataModel.expenses[index],
        ...data,
      };
    }
  },

  deleteExpense(id) {
    DataModel.expenses = DataModel.expenses.filter(
      e => e.id !== id
    );
  },
};
