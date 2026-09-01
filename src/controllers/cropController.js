// src/controllers/cropController.js

import cropService from "../services/cropService.js";

class CropController {

  async getAll() {
    return cropService.getAll();
  }

  async getById(id) {
    return cropService.getById(id);
  }

  async getByFarmId(farmId) {
    if (!farmId) {
      return [];
    }

    const crops =
      await cropService.getAll();

    return crops.filter(
      crop =>
        String(crop?.farmId ?? "").trim() ===
        String(farmId).trim()
    );
  }

  async create(data) {
    return cropService.create(data);
  }

  async update(id, data) {
    return cropService.update(
      id,
      data
    );
  }

  async delete(id) {
    return cropService.delete(id);
  }

  async exists(id) {
    try {
      await cropService.getById(id);
      return true;
    } catch {
      return false;
    }
  }

  async count() {
    const crops =
      await cropService.getAll();

    return Array.isArray(crops)
      ? crops.length
      : 0;
  }
}

export default Object.freeze(
  new CropController()
);
