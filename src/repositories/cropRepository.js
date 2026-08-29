// src/repositories/cropRepository.js

import { storageService } from "../storage";

const CROPS_KEY = "crops";

class CropRepository {
  async getAll() {
    const data =
      await storageService.load(
        CROPS_KEY,
        []
      );

    return Array.isArray(data)
      ? data
      : [];
  }

  async getById(id) {
    if (!id) return null;

    const crops =
      await this.getAll();

    return (
      crops.find(
        crop =>
          String(crop.id) ===
          String(id)
      ) || null
    );
  }

  async create(data) {
    const crops =
      await this.getAll();

    const now =
      new Date().toISOString();

    const id =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const crop = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await storageService.save(
      CROPS_KEY,
      [...crops, crop]
    );

    return crop;
  }

  async update(id, data) {
    const crops =
      await this.getAll();

    const index =
      crops.findIndex(
        crop =>
          String(crop.id) ===
          String(id)
      );

    if (index < 0) {
      return null;
    }

    const updated = {
      ...crops[index],
      ...data,
      id: crops[index].id,
      createdAt:
        crops[index].createdAt,
      updatedAt:
        new Date().toISOString(),
    };

    crops[index] = updated;

    await storageService.save(
      CROPS_KEY,
      crops
    );

    return updated;
  }

  async delete(id) {
    const crops =
      await this.getAll();

    const next =
      crops.filter(
        crop =>
          String(crop.id) !==
          String(id)
      );

    if (next.length === crops.length) {
      return false;
    }

    await storageService.save(
      CROPS_KEY,
      next
    );

    return true;
  }
}

export default Object.freeze(
  new CropRepository()
);
