// src/controllers/reportController.js

import * as reportService from "../api/reportService.js";

class ReportController {
  async getAllReports() {
    try {
      const reports = await reportService.getAllReports();

      return {
        success: true,
        data: reports,
        total: reports.length,
        message: "Reports loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getReportById(reportId) {
    try {
      if (!reportId) {
        throw new Error("Report ID is required.");
      }

      const report = await reportService.getReportById(reportId);

      if (!report) {
        throw new Error("Report not found.");
      }

      return {
        success: true,
        data: report,
        message: "Report loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createReport(reportData) {
    try {
      this.validateReport(reportData);

      const report = await reportService.createReport(reportData);

      return {
        success: true,
        data: report,
        message: "Report created successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateReport(reportId, reportData) {
    try {
      if (!reportId) {
        throw new Error("Report ID is required.");
      }

      this.validateReport(reportData);

      const report = await reportService.updateReport(
        reportId,
        reportData
      );

      return {
        success: true,
        data: report,
        message: "Report updated successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteReport(reportId) {
    try {
      if (!reportId) {
        throw new Error("Report ID is required.");
      }

      await reportService.deleteReport(reportId);

      return {
        success: true,
        message: "Report deleted successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateReport(report) {
    if (!report) {
      throw new Error("Report data is required.");
    }

    if (!report.title?.trim()) {
      throw new Error("Report title is required.");
    }

    if (!report.farmId) {
      throw new Error("Farm ID is required.");
    }

    return true;
  }

  generateSummary(report) {
    return {
      id: report.id,
      title: report.title,
      farmId: report.farmId,
      createdAt: report.createdAt,
      status: report.status ?? "Draft",
    };
  }

  handleError(error) {
    console.error("[ReportController]", error);

    return {
      success: false,
      data: null,
      message: error.message || "Unexpected report error.",
    };
  }
}

export default new ReportController();
