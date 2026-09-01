// src/repositories/mapRepository.js

import { storageService } from "../storage";


// =========================================================
// LAVENDER — MAP REPOSITORY
// =========================================================
//
// المسؤول فقط عن تخزين واسترجاع LocationData.
//
// لا يحتوي على:
// - MapModel
// - Leaflet
// - Nominatim
// - حسابات جغرافية
// - React
// - منطق المحاصيل
//
// العلاقة:
// farmId → LocationData
//
// =========================================================


const LOCATIONS_KEY = "locations";


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

    if (!id) {
      return null;
    }

    const locations =
      await this.getAll();

    return (
      locations.find(
        item =>
          String(item?.id) ===
          String(id)
      ) || null
    );
  }


  // =======================================================
  // GET BY FARM
  // =======================================================

  async getByFarmId(farmId) {

    if (!farmId) {
      return [];
    }

    const locations =
      await this.getAll();

    return locations.filter(
      item =>
        String(item?.farmId) ===
        String(farmId)
    );
  }


  // =======================================================
  // GET ACTIVE LOCATION BY FARM
  // =======================================================

  async getLatestByFarmId(farmId) {

    const locations =
      await this.getByFarmId(
        farmId
      );

    if (!locations.length) {
      return null;
    }

    const active =
      locations.filter(
        item =>
          item?.status !==
          "archived"
      );

    const source =
      active.length
        ? active
        : locations;

    return (
      [...source]
        .sort(
          (a, b) =>
            new Date(
              b?.updatedAt ||
              b?.createdAt ||
              0
            ) -
            new Date(
              a?.updatedAt ||
              a?.createdAt ||
              0
            )
        )[0] || null
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

    if (!data.farmId) {
      throw new Error(
        "MAP_FARM_REQUIRED"
      );
    }

    const locations =
      await this.getAll();

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

      id,

      ...data,

      farmId:
        String(data.farmId),

      createdAt:
        data.createdAt ||
        now,

      updatedAt:
        now,

      status:
        data.status ||
        "active",

    };

    locations.push(
      location
    );

    await storageService.save(
      LOCATIONS_KEY,
      locations
    );

    return location;
  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(
    id,
    data
  ) {

    if (!id) {
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
        item =>
          String(item?.id) ===
          String(id)
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
        String(
          data.farmId ??
          locations[index].farmId ??
          ""
        ),

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

    if (!id) {
      return false;
    }

    const locations =
      await this.getAll();

    const next =
      locations.filter(
        item =>
          String(item?.id) !==
          String(id)
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
