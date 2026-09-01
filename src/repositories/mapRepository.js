// src/repositories/mapRepository.js

import { storageService } from "../storage";


// =========================================================
// LAVENDER — MAP REPOSITORY
// =========================================================
//
// مسؤول فقط عن تخزين واسترجاع LocationData.
//
// لا يحتوي على:
// - Leaflet
// - GPS
// - Nominatim
// - حساب المساحة
// - حساب المحيط
// - منطق المحاصيل
// - منطق الواجهة
// - MapModel
//
// العلاقة الأساسية:
//
// farmId → LocationData
//
// =========================================================


const LOCATIONS_KEY = "locations";


function normalizeId(value) {
  return value == null
    ? ""
    : String(value);
}


class MapRepository {


  // =======================================================
  // GET ALL
  // =======================================================

  async getAll() {

    const data =
      await storageService.load(
        LOCATIONS_KEY,
        []
      );

    return Array.isArray(data)
      ? data
      : [];
  }


  // =======================================================
  // GET BY ID
  // =======================================================

  async getById(id) {

    const normalizedId =
      normalizeId(id);

    if (!normalizedId) {
      return null;
    }

    const locations =
      await this.getAll();

    return (
      locations.find(
        location =>
          normalizeId(location?.id) ===
          normalizedId
      ) || null
    );
  }


  // =======================================================
  // GET BY FARM
  // =======================================================

  async getByFarmId(farmId) {

    const normalizedFarmId =
      normalizeId(farmId);

    if (!normalizedFarmId) {
      return null;
    }

    const locations =
      await this.getAll();

    return (
      locations.find(
        location =>
          normalizeId(location?.farmId) ===
          normalizedFarmId &&
          location?.status !== "deleted"
      ) || null
    );
  }


  // =======================================================
  // CREATE
  // =======================================================

  async create(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "MAP_DATA_REQUIRED"
      );
    }

    const farmId =
      normalizeId(data.farmId);

    if (!farmId) {
      throw new Error(
        "FARM_ID_REQUIRED"
      );
    }

    const locations =
      await this.getAll();

    const existingIndex =
      locations.findIndex(
        location =>
          normalizeId(location?.farmId) ===
          farmId &&
          location?.status !== "deleted"
      );

    const id =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const now =
      new Date().toISOString();

    const location = {

      ...data,

      id,

      farmId,

      source:
        data.source || "map",

      status:
        data.status || "active",

      createdAt:
        data.createdAt || now,

      updatedAt:
        now,

    };


    // -----------------------------------------------------
    // إذا كان للمزرعة موقع سابق:
    // تحديثه بدل إنشاء موقع ثانٍ.
    // -----------------------------------------------------

    if (existingIndex !== -1) {

      const existing =
        locations[existingIndex];

      const updated = {

        ...existing,

        ...location,

        id:
          existing.id,

        farmId,

        createdAt:
          existing.createdAt ||
          now,

        updatedAt:
          now,

      };

      locations[existingIndex] =
        updated;

      await storageService.save(
        LOCATIONS_KEY,
        locations
      );

      return updated;
    }


    locations.push(location);

    await storageService.save(
      LOCATIONS_KEY,
      locations
    );

    return location;
  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(id, data) {

    const normalizedId =
      normalizeId(id);

    if (!normalizedId) {
      return null;
    }

    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "MAP_DATA_REQUIRED"
      );
    }

    const locations =
      await this.getAll();

    const index =
      locations.findIndex(
        location =>
          normalizeId(location?.id) ===
          normalizedId
      );

    if (index === -1) {
      return null;
    }

    const updated = {

      ...locations[index],

      ...data,

      id:
        locations[index].id,

      farmId:
        locations[index].farmId,

      updatedAt:
        new Date().toISOString(),

    };

    locations[index] =
      updated;

    await storageService.save(
      LOCATIONS_KEY,
      locations
    );

    return updated;
  }


  // =======================================================
  // DELETE
  // =======================================================

  async delete(id) {

    const normalizedId =
      normalizeId(id);

    if (!normalizedId) {
      return false;
    }

    const locations =
      await this.getAll();

    const next =
      locations.filter(
        location =>
          normalizeId(location?.id) !==
          normalizedId
      );

    if (
      next.length ===
      locations.length
    ) {
      return false;
    }

    await storageService.save(
      LOCATIONS_KEY,
      next
    );

    return true;
  }


  // =======================================================
  // DELETE BY FARM
  // =======================================================

  async deleteByFarmId(farmId) {

    const normalizedFarmId =
      normalizeId(farmId);

    if (!normalizedFarmId) {
      return false;
    }

    const locations =
      await this.getAll();

    const next =
      locations.filter(
        location =>
          normalizeId(location?.farmId) !==
          normalizedFarmId
      );

    if (
      next.length ===
      locations.length
    ) {
      return false;
    }

    await storageService.save(
      LOCATIONS_KEY,
      next
    );

    return true;
  }


  // =======================================================
  // EXISTS
  // =======================================================

  async exists(id) {

    return Boolean(
      await this.getById(id)
    );
  }


  // =======================================================
  // COUNT
  // =======================================================

  async count() {

    const locations =
      await this.getAll();

    return locations.length;
  }

}


const mapRepository =
  new MapRepository();


export default Object.freeze(
  mapRepository
);
