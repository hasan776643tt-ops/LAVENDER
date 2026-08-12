// src/services/farmService.js

import farmRepository from "../repositories/farmRepository.js";

class FarmService {
  // =========================
  // Read
  // =========================

  async getAll() {
    return farmRepository.getAll();
  }

  async getAllFarms() {
    return this.getAll();
  }

  async getById(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.getById(id);
  }

  async getFarmById(id) {
    return this.getById(id);
  }

  // =========================
  // Create
  // =========================

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error("بيانات المزرعة مطلوبة");
    }

    if (!data.name || !String(data.name).trim()) {
      throw new Error("اسم المزرعة مطلوب");
    }

    return farmRepository.create(data);
  }

  async createFarm(data) {
    return this.create(data);
  }

  // =========================
  // Update
  // =========================

  async update(id, data) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    if (!data || typeof data !== "object") {
      throw new Error("بيانات التحديث مطلوبة");
    }

    return farmRepository.update(id, data);
  }

  async updateFarm(id, data) {
    return this.update(id, data);
  }

  // =========================
  // Delete
  // =========================

  async delete(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.delete(id);
  }

  async deleteFarm(id) {
    return this.delete(id);
  }

  // =========================
  // Utility
  // =========================

  async count() {
    return farmRepository.count();
  }

  async exists(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.exists(id);
  }
}

const farmService = new FarmService();

export default Object.freeze(farmService);
