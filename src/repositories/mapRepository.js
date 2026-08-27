// src/repositories/mapRepository.js

import { storageService } from "../storage";


const LOCATIONS_KEY = "locations";


class MapRepository {

  // =========================================================
  // GET ALL
  // =========================================================

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


  // =========================================================
  // GET BY ID
  // =========================================================

  async getById(id) {

    if (!id) {
      return null;
    }

    const locations =
      await this.getAll();

    return (
      locations.find(
        item =>
          String(item.id) ===
          String(id)
      ) || null
    );

  }


  // =========================================================
  // CREATE
  // =========================================================

  async create(data) {

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

    const id =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"

        ? crypto.randomUUID()

        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const location = {

      id,

      ...data,

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

      status:
        data.status ||
        "active",

    };

    locations.push(location);

    await storageService.save(
      LOCATIONS_KEY,
      locations
    );

    return location;

  }


  // =========================================================
  // UPDATE
  // =========================================================

  async update(id, data) {

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
          String(item.id) ===
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


  // =========================================================
  // DELETE
  // =========================================================

  async delete(id) {

    if (!id) {
      return false;
    }

    const locations =
      await this.getAll();

    const next =
      locations.filter(
        item =>
          String(item.id) !==
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


  // =========================================================
  // EXISTS
  // =========================================================

  async exists(id) {

    return Boolean(
      await this.getById(id)
    );

  }


  // =========================================================
  // COUNT
  // =========================================================

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
