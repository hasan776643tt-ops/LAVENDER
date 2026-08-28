// src/repositories/cropRepository.js

import {
  storageService,
} from "../storage";

import {
  createError,
} from "../utils/errorHandler.js";

class CropRepository {
  constructor() {
    this.key = "crops";
  }

  async getAll() {
    return storageService.load(this.key, []);
  }

  async getById(id) {
    if (!id) return null;

    const crops = await this.getAll();

    return (
      crops.find(
        (crop) =>
          String(crop.id) === String(id)
      ) ?? null
    );
  }

  async create(data) {
    if (!data) {
      throw createError(
        "Crop data is required",
        "CROP_DATA_REQUIRED"
      );
    }

    const crops = await this.getAll();
    const now = new Date().toISOString();

    const crop = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await storageService.save(
      this.key,
      [...crops, crop]
    );

    return crop;
  }

  async update(id, data) {
    if (!id) return null;

    const crops = await this.getAll();

    const index = crops.findIndex(
      (crop) =>
        String(crop.id) === String(id)
    );

    if (index === -1) return null;

    const crop = {
      ...crops[index],
      ...data,
      id: crops[index].id,
      createdAt: crops[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    const next = [...crops];
    next[index] = crop;

    await storageService.save(
      this.key,
      next
    );

    return crop;
  }

  async delete(id) {
    if (!id) return false;

    const crops = await this.getAll();

    const next = crops.filter(
      (crop) =>
        String(crop.id) !== String(id)
    );

    if (next.length === crops.length) {
      return false;
    }

    await storageService.save(
      this.key,
      next
    );

    return true;
  }
}

export default Object.freeze(
  new CropRepository()
);
