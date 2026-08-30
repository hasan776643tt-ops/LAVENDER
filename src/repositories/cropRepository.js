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
          String(crop?.id) ===
          String(id)
      ) || null
    );
  }


  // =======================================================
  // GET BY FARM
  // =======================================================

  async getByFarmId(farmId) {
    const id =
      String(
        farmId ?? ""
      ).trim();

    if (!id) {
      return [];
    }

    const crops =
      await this.getAll();

    return crops.filter(
      crop =>
        String(
          crop?.farmId ?? ""
        ).trim() === id
    );
  }


  async create(data) {
    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "CROP_DATA_REQUIRED"
      );
    }

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
      farmId:
        data.farmId
          ? String(data.farmId)
          : "",
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
    if (!id) {
      return null;
    }

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "CROP_DATA_REQUIRED"
      );
    }

    const crops =
      await this.getAll();

    const index =
      crops.findIndex(
        crop =>
          String(crop?.id) ===
          String(id)
      );

    if (index < 0) {
      return null;
    }

    const updated = {
      ...crops[index],
      ...data,
      id:
        crops[index].id,
      farmId:
        data.farmId !== undefined
          ? String(data.farmId)
          : String(
              crops[index].farmId ?? ""
            ),
      createdAt:
        crops[index].createdAt,
      updatedAt:
        new Date().toISOString(),
    };

    crops[index] =
      updated;

    await storageService.save(
      CROPS_KEY,
      crops
    );

    return updated;
  }


  async delete(id) {
    if (!id) {
      return false;
    }

    const crops =
      await this.getAll();

    const next =
      crops.filter(
        crop =>
          String(crop?.id) !==
          String(id)
      );

    if (
      next.length ===
      crops.length
    ) {
      return false;
    }

    await storageService.save(
      CROPS_KEY,
      next
    );

    return true;
  }


  async exists(id) {
    return Boolean(
      await this.getById(id)
    );
  }


  async count() {
    const crops =
      await this.getAll();

    return crops.length;
  }


  async countByFarmId(farmId) {
    const crops =
      await this.getByFarmId(
        farmId
      );

    return crops.length;
  }
}


export default Object.freeze(
  new CropRepository()
);
