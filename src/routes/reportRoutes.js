// src/routes/reportRoutes.js

import reportController from "../controllers/reportController.js";

/**
 * ==========================================================
 * Report Routes
 * LAVENDER Smart Farm
 * ----------------------------------------------------------
 * مسؤول عن توجيه جميع عمليات التقارير.
 * جاهز للربط مع React Router أو Express أو أي Backend مستقبلاً.
 * ==========================================================
 */

class ReportRoutes {
  /**
   * الحصول على جميع التقارير
   */
  async getAll() {
    return await reportController.getAllReports();
  }

  /**
   * الحصول على تقرير بواسطة المعرف
   * @param {string} reportId
   */
  async getById(reportId) {
    return await reportController.getReportById(reportId);
  }

  /**
   * إنشاء تقرير جديد
   * @param {Object} reportData
   */
  async create(reportData) {
    return await reportController.createReport(reportData);
  }

  /**
   * تحديث تقرير
   * @param {string} reportId
   * @param {Object} reportData
   */
  async update(reportId, reportData) {
    return await reportController.updateReport(
      reportId,
      reportData
    );
  }

  /**
   * حذف تقرير
   * @param {string} reportId
   */
  async delete(reportId) {
    return await reportController.deleteReport(reportId);
  }

  /**
   * إنشاء ملخص تقرير
   * @param {Object} report
   */
  async summary(report) {
    return reportController.generateSummary(report);
  }

  /**
   * فحص جاهزية المسار
   */
  health() {
    return {
      success: true,
      module: "ReportRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString(),
    };
  }
}

export default Object.freeze(new ReportRoutes());
