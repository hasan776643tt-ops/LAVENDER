import { DataModel } from "../context/DataModel";

export const reportService = {
  getReports() {
    return DataModel.reports;
  },

  addReport(report) {
    DataModel.reports.push(report);
  },

  updateReport(id, data) {
    const index = DataModel.reports.findIndex(r => r.id === id);

    if (index !== -1) {
      DataModel.reports[index] = {
        ...DataModel.reports[index],
        ...data,
      };
    }
  },

  deleteReport(id) {
    DataModel.reports = DataModel.reports.filter(r => r.id !== id);
  },
};
