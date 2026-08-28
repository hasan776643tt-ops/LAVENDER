import farmRepository from "../repositories/farmRepository.js";

class FarmService {
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

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error("بيانات المزرعة مطلوبة");
    }

    if (!String(data.name ?? "").trim()) {
      throw new Error("اسم المزرعة مطلوب");
    }

    return farmRepository.create(data);
  }

  async createFarm(data) {
    return this.create(data);
  }

  async update(id, data) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.update(id, data);
  }

  async updateFarm(id, data) {
    return this.update(id, data);
  }

  async delete(id) {
    if (!id) {
      throw new Error("معرف المزرعة مطلوب");
    }

    return farmRepository.delete(id);
  }

  async deleteFarm(id) {
    return this.delete(id);
  }
}

export default Object.freeze(
  new FarmService()
);
