// src/routes/authRoutes.js

import userController from "../controllers/userController.js";

/**
 * ==========================================================
 * Auth Routes
 * LAVENDER Smart Farm
 * ----------------------------------------------------------
 * مسؤول عن جميع عمليات المصادقة (Authentication).
 * يفصل طبقة الواجهة عن طبقة الـ Controller.
 * جاهز للربط مع JWT أو Firebase أو Supabase أو أي Backend.
 * ==========================================================
 */

class AuthRoutes {
  /**
   * تسجيل الدخول
   * @param {Object} credentials
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    return userController.login(credentials);
  }

  /**
   * إنشاء حساب جديد
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async register(userData) {
    return userController.register(userData);
  }

  /**
   * تسجيل الخروج
   * @returns {Promise<Object>}
   */
  async logout() {
    return userController.logout();
  }

  /**
   * تحديث بيانات المستخدم الحالي
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async updateProfile(userData) {
    return userController.updateProfile(userData);
  }

  /**
   * تغيير كلمة المرور
   * @param {Object} passwordData
   * @returns {Promise<Object>}
   */
  async changePassword(passwordData) {
    return userController.changePassword(passwordData);
  }

  /**
   * إعادة تعيين كلمة المرور
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    return userController.forgotPassword(email);
  }

  /**
   * التحقق من حالة تسجيل الدخول
   * @returns {Promise<Object>}
   */
  async isAuthenticated() {
    return userController.isAuthenticated();
  }

  /**
   * الحصول على المستخدم الحالي
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    return userController.getCurrentUser();
  }

  /**
   * اختبار جاهزية المسار
   * @returns {Object}
   */
  health() {
    return {
      success: true,
      module: "AuthRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString(),
    };
  }
}

export default Object.freeze(new AuthRoutes());
