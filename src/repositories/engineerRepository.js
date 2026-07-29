// src/repositories/engineerRepository.js

import * as engineerApi from "../api/engineerService.js";

/**
 * EngineerRepository
 * ----------------------------------------------------
 * مسؤول عن إدارة بيانات المهندسين الزراعيين.
 * يدعم:
 * - Cache ذكي
 * - CRUD كامل
 * - البحث
 * - الإحصائيات
 * - سهولة استبدال مصدر البيانات مستقبلاً
 * ----------------------------------------------------
 */
class EngineerRepository {
  #cache = new Map();
  #cacheTTL = 5 * 60 * 1000; // 5 دقائق

  #createKey(key) {
    return String(key);
  }

  #isExpired(timestamp) {
    return Date.now() - timestamp > this.#cacheTTL;
  }

  #setCache(key, value) {
    this.#cache.set(this.#createKey(key), {
      value,
      timestamp: Date.now(),
    });
  }

  #getCache(key) {
    const cache = this.#cache.get(this.#createKey(key));

    if (!cache) return null;

    if (this.#isExpired(cache.timestamp)) {
      this.#cache.delete(this.#createKey(key));
      return null;
    }

    return cache.value;
  }

  async getAll() {
    const cache = this.#getCache("engineers");

    if (cache) {
      return cache;
    }

    const engineers = await engineerApi.getAllEngineers();

    this.#setCache("engineers", engineers);

    return engineers;
  }

  async getById(id) {
    if (!id) {
      throw new Error("Engineer ID is required.");
    }

    const cache = this.#getCache(id);

    if (cache) {
      return cache;
    }

    const engineer = await engineerApi.getEngineerById(id);

    if (engineer) {
      this.#setCache(id, engineer);
    }

    return engineer;
  }

  async create(data) {
    this.#validate(data);

    const engineer = await engineerApi.createEngineer(data);

    this.clearCache();

    return engineer;
  }

  async update(id, data) {
    if (!id) {
      throw new Error("Engineer ID is required.");
    }

    this.#validate(data);

    const engineer = await engineerApi.updateEngineer(id, data);

    this.clearCache();

    return engineer;
  }

  async delete(id) {
    if (!id) {
      throw new Error("Engineer ID is required.");
    }

    await engineerApi.deleteEngineer(id);

    this.clearCache();

    return true;
  }

  async search(keyword = "") {
    const engineers = await this.getAll();

    const search = keyword.trim().toLowerCase();

    return engineers.filter((engineer) =>
      [
        engineer.name,
        engineer.specialization,
        engineer.city,
        engineer.phone,
        engineer.email,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(search)
        )
    );
  }

  async getStatistics() {
    const engineers = await this.getAll();

    return {
      total: engineers.length,
      available: engineers.filter(
        (e) => e.status === "Available"
      ).length,
      busy: engineers.filter(
        (e) => e.status === "Busy"
      ).length,
      offline: engineers.filter(
        (e) => e.status === "Offline"
      ).length,
    };
  }

  clearCache() {
    this.#cache.clear();
  }

  #validate(engineer) {
    if (!engineer) {
      throw new Error("Engineer data is required.");
    }

    if (!engineer.name?.trim()) {
      throw new Error("Engineer name is required.");
    }

    if (!engineer.specialization?.trim()) {
      throw new Error("Engineer specialization is required.");
    }

    if (!engineer.phone?.trim()) {
      throw new Error("Engineer phone is required.");
    }

    return true;
  }
}

export default Object.freeze(new EngineerRepository());
