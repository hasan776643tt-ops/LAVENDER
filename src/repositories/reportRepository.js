// src/repositories/reportRepository.js

import * as reportApi from "../api/reportService.js";

/**
 * ReportRepository
 * ----------------------------------------------------
 * مسؤول عن إدارة بيانات التقارير فقط.
 * لا يحتوي على منطق الواجهة أو منطق الصفحات.
 * يمكن تبديل مصدر البيانات (API / Firebase / Supabase / Database)
 * دون تعديل الـ Controllers أو Pages.
 * ----------------------------------------------------
 */
class ReportRepository {
  #cache = new Map();
  #cacheTTL = 5 * 60 * 1000; // 5 دقائق

  /**
   * إنشاء مفتاح للكاش
   * @param {string} key
   * @returns {string}
   */
  #createKey(key) {
    return String(key);
  }

  /**
   * هل انتهت صلاحية الكاش؟
   * @param {number} timestamp
   * @returns {boolean}
   */
  #isExpired(timestamp) {
    return Date.now() - timestamp > this.#cacheTTL;
  }

  /**
   * حفظ داخل الكاش
   * @param {string} key
   * @param {any} value
   */
  #saveCache(key, value) {
    this.#cache.set(this.#createKey(key), {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * قراءة من الكاش
   * @param {string} key
   * @returns {any|null}
   */
  #readCache(key) {
    const item = this.#cache.get(this.#createKey(key));

    if (!item) return null;

    if (this.#isExpired(item.timestamp)) {
      this.#cache.delete(this.#createKey(key));
      return null;
    }

    return item.value;
  }

  /**
   * جميع التقارير
   */
  async getAll() {
    const cache = this.#readCache("reports");

    if (cache) return cache;

    const reports = await reportApi.getAllReports();

    this.#saveCache("reports", reports);

    return reports;
  }

  /**
   * تقرير واحد
   * @param {string} id
   */
  async getById(id) {
    if (!id) {
      throw new Error("Report ID is required.");
    }

    const cache = this.#readCache(id);

    if (cache) return cache;

    const report = await reportApi.getReportById(id);

    if (report) {
      this.#saveCache(id, report);
    }

    return report;
  }

  /**
   * إنشاء تقرير
   * @param {Object} data
   */
  async create(data) {
    const report = await reportApi.createReport(data);

    this.clearCache();

    return report;
  }

  /**
   * تحديث تقرير
   * @param {string} id
   * @param {Object} data
   */
  async update(id, data) {
    const report = await reportApi.updateReport(id, data);

    this.clearCache();

    return report;
  }

  /**
   * حذف تقرير
   * @param {string} id
   */
  async delete(id) {
    await reportApi.deleteReport(id);

    this.clearCache();

    return true;
  }

  /**
   * البحث
   * @param {string} keyword
   */
  async search(keyword = "") {
    const reports = await this.getAll();

    const search = keyword.trim().toLowerCase();

    return reports.filter((report) =>
      [
        report.title,
        report.description,
        report.status,
        report.cropName,
        report.farmName,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(search)
        )
    );
  }

  /**
   * إحصائيات التقارير
   */
  async getStatistics() {
    const reports = await this.getAll();

    return {
      total: reports.length,
      completed: reports.filter(
        (r) => r.status === "Completed"
      ).length,
      pending: reports.filter(
        (r) => r.status === "Pending"
      ).length,
      draft: reports.filter(
        (r) => r.status === "Draft"
      ).length,
    };
  }

  /**
   * تنظيف الكاش
   */
  clearCache() {
    this.#cache.clear();
  }
}

export default Object.freeze(new ReportRepository());
