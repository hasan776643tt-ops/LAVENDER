// src/repositories/mapRepository.js

import { storageService } from "../storage";

class MapRepository {
  constructor() {
    this.key = "locations";
  }

  async getAll() {
    return storageService.load(
      this.key,
      []
    );
  }

  async getById(id) {
    if (!id) {
      return null;
    }

    const locations =
      await this.getAll();

    return (
      locations.find(
        (location) =>
          String(location.id) ===
          String(id)
      ) || null
    );
  }

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error(
        "بيانات الموقع مطلوبة"
      );
    }

    const locations =
      await this.getAll();

    const newLocation = {
      id: crypto.randomUUID(),
      ...data,
    };

    locations.push(newLocation);

    await storageService.save(
      this.key,
      locations
    );

    return newLocation;
  }

  async update(id, data) {
    if (!id) {
      return null;
    }

    const locations =
      await this.getAll();

    const index =
      locations.findIndex(
        (location) =>
          String(location.id) ===
          String(id)
      );

    if (index === -1) {
      return null;
    }

    const updatedLocation = {
      ...locations[index],
      ...data,
      id: locations[index].id,
    };

    locations[index] =
      updatedLocation;

    await storageService.save(
      this.key,
      locations
    );

    return updatedLocation;
  }

  async delete(id) {
    if (!id) {
      return false;
    }

    const locations =
      await this.getAll();

    const filteredLocations =
      locations.filter(
        (location) =>
          String(location.id) !==
          String(id)
      );

    if (
      filteredLocations.length ===
      locations.length
    ) {
      return false;
    }

    await storageService.save(
      this.key,
      filteredLocations
    );

    return true;
  }

  async exists(id) {
    return Boolean(
      await this.getById(id)
    );
  }

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
