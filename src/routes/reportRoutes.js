// src/routes/reportRoutes.js

import reportController from "../controllers/reportController.js";


class ReportRoutes {

  constructor() {
    this.controller = reportController;
  }


  async getAll() {
    try {
      return await this.controller.getAllReports();

    } catch (error) {
      throw new Error(
        `Report routes get failed: ${error.message}`
      );
    }
  }


  async getById(reportId) {
    try {
      return await this.controller.getReportById(reportId);

    } catch (error) {
      throw new Error(
        `Report routes get by id failed: ${error.message}`
      );
    }
  }


  async create(reportData) {
    try {
      return await this.controller.createReport(reportData);

    } catch (error) {
      throw new Error(
        `Report routes create failed: ${error.message}`
      );
    }
  }


  async update(reportId, reportData) {
    try {
      return await this.controller.updateReport(
        reportId,
        reportData
      );

    } catch (error) {
      throw new Error(
        `Report routes update failed: ${error.message}`
      );
    }
  }


  async delete(reportId) {
    try {
      return await this.controller.deleteReport(reportId);

    } catch (error) {
      throw new Error(
        `Report routes delete failed: ${error.message}`
      );
    }
  }


  async summary(report) {
    try {
      return await this.controller.generateSummary(report);

    } catch (error) {
      throw new Error(
        `Report summary failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "ReportRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new ReportRoutes()
);
