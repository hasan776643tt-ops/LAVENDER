// src/repositories/mapRepository.js

import { storageService } from "../storage";


class MapRepository {

  // =========================================================
  // Constructor
  // =========================================================

  constructor() {

    this.key =
      "locations";

  }


  // =========================================================
  // Get All Locations
  // =========================================================

  async getAll() {

    const locations =
      await storageService.load(
        this.key,
        []
      );


    return Array.isArray(locations)
      ? locations
      : [];

  }


  // =========================================================
  // Get Location By ID
  // =========================================================

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


  // =========================================================
  // Create Location
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


    // -------------------------------------------------------
    // Generate ID
    // -------------------------------------------------------

    let id;


    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID ===
        "function"
    ) {

      id =
        crypto.randomUUID();

    } else {

      id =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

    }


    // -------------------------------------------------------
    // Create Location
    // -------------------------------------------------------

    const newLocation = {

      id,

      ...data,

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

      status:
        data.status ||
        "active"

    };


    locations.push(
      newLocation
    );


    await storageService.save(
      this.key,
      locations
    );


    return newLocation;

  }


  // =========================================================
  // Update Location
  // =========================================================

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

      id:
        locations[index].id

    };


    locations[index] =
      updatedLocation;


    await storageService.save(
      this.key,
      locations
    );


    return updatedLocation;

  }


  // =========================================================
  // Delete Location
  // =========================================================

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


    // -------------------------------------------------------
    // Location Not Found
    // -------------------------------------------------------

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


  // =========================================================
  // Check Location Exists
  // =========================================================

  async exists(id) {

    if (!id) {

      return false;

    }


    const location =
      await this.getById(id);


    return Boolean(
      location
    );

  }


  // =========================================================
  // Count Locations
  // =========================================================

  async count() {

    const locations =
      await this.getAll();


    return locations.length;

  }

}


// ===========================================================
// Repository Instance
// ===========================================================

const mapRepository =
  new MapRepository();


// ===========================================================
// Export
// ===========================================================

export default Object.freeze(
  mapRepository
);
