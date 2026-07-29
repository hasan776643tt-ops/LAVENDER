// src/routes/engineerRoutes.js

import engineerController from "../controllers/engineerController.js";

/**
 * ==========================================================
 * Engineer Routes
 * LAVENDER Smart Farm
 * ----------------------------------------------------------
 * مسؤول عن توجيه جميع عمليات المهندسين الزراعيين.
 * يفصل طبقة الواجهة عن طبقة الـ Controller.
 * جاهز للربط مع React Router أو Express أو أي Backend مستقبلاً.
 * ==========================================================
 */

class EngineerRoutes {
  /**
   * جلب جميع المهندسين
   * @returns {Promise<Object>}
   */
  async getAll() {
    return engineerController.getAllEngineers();
  }

  /**
   * جلب مهندس بواسطة المعرف
   * @param {string} engineerId
   * @returns {Promise<Object>}
   */
  async getById(engineerId) {
    return engineerController.getEngineerById(engineerId);
  }

  /**
   * إنشاء مهندس جديد
   * @param {Object} engineerData
   * @returns {Promise<Object>}
   */
  async create(engineerData) {
    return engineerController.createEngineer(engineerData);
  }

  /**
   * تحديث بيانات مهندس
   * @param {string} engineerId
   * @param {Object} engineerData
   * @returns {Promise<Object>}
   */
  async update(engineerId, engineerData) {
    return engineerController.updateEngineer(
      engineerId,
      engineerData
    );
  }

  /**
   * حذف مهندس
   * @param {string} engineerId
   * @returns {Promise<Object>}
   */
  async delete(engineerId) {
    return engineerController.deleteEngineer(engineerId);
  }

  /**
   * البحث عن مهندس
   * @param {string} keyword
   * @returns {Promise<Object>}
   */
  async search(keyword) {
    return engineerController.searchEngineers(keyword);
  }

  /**
   * اختبار جاهزية المسار
   * @returns {Object}
   */
  health() {
    return {
      success: true,
      module: "EngineerRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString(),
    };
  }
}

export default Object.freeze(new EngineerRoutes());
