// src/services/farmService.js

import farmRepository
  from "../repositories/farmRepository.js";

class FarmService {
  async getAll() {
    return farmRepository.getAll();
  }

  async getAllFarms() {
    return this.getAll();
  }

  async getById(id) {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.getById(id);
  }

  async getFarmById(id) {
    return this.getById(id);
  }

  async create(data) {
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      throw new Error("بيانات المزرعة مطلوبة");
    }

    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new Error("اسم المزرعة مطلوب");
    }

    return farmRepository.create({
      ...data,
      name: data.name.trim(),
    });
  }

  async createFarm(data) {
    return this.create(data);
  }

  async update(id, data) {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      throw new Error("معرف المزرعة مطلوب");
    }

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      throw new Error("بيانات التحديث مطلوبة");
    }

    return farmRepository.update(id, data);
  }

  async updateFarm(id, data) {
    return this.update(id, data);
  }

  async delete(id) {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.delete(id);
  }

  async deleteFarm(id) {
    return this.delete(id);
  }

  async count() {
    return farmRepository.count();
  }

  async exists(id) {
    if (!id) return false;

    return farmRepository.exists(id);
  }
}

export default Object.freeze(
  new FarmService()
);
