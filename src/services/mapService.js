 // src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


class MapService {

  // =========================================================
  // Get All Locations
  // =========================================================

  async getAllLocations() {

    return mapRepository.getAll();

  }


  // =========================================================
  // Get Location By ID
  // =========================================================

  async getLocationById(id) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }

    return mapRepository.getById(id);

  }


  // =========================================================
  // Create Location
  // =========================================================

  async createLocation(data) {

    // -------------------------------------------------------
    // Validate Object
    // -------------------------------------------------------

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "MAP_DATA_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Validate Farm
    // -------------------------------------------------------

    if (!data.farmId) {

      throw new Error(
        "MAP_FARM_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Validate Coordinates
    // -------------------------------------------------------

    if (
      data.latitude === undefined ||
      data.latitude === null ||
      data.latitude === "" ||
      data.longitude === undefined ||
      data.longitude === null ||
      data.longitude === ""
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Validate Numeric Coordinates
    // -------------------------------------------------------

    const latitude =
      Number(data.latitude);

    const longitude =
      Number(data.longitude);


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Latitude Range
    // -------------------------------------------------------

    if (
      latitude < -90 ||
      latitude > 90
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Longitude Range
    // -------------------------------------------------------

    if (
      longitude < -180 ||
      longitude > 180
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // Normalize Data
    // -------------------------------------------------------

    const locationData = {

      ...data,

      latitude,

      longitude,

      farmId:
        String(data.farmId),

      type:
        data.type || "farm",

      status:
        data.status || "active",

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

      notes:
        data.notes || "",

      accuracy:
        data.accuracy !== undefined &&
        data.accuracy !== null
          ? Number(data.accuracy)
          : null

    };


    // -------------------------------------------------------
    // Create
    // -------------------------------------------------------

    return mapRepository.create(
      locationData
    );

  }


  // =========================================================
  // Update Location
  // =========================================================

  async updateLocation(
    id,
    data
  ) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }


    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "MAP_DATA_REQUIRED"
      );

    }


    const updateData = {
      ...data
    };


    // -------------------------------------------------------
    // Validate Coordinates If Provided
    // -------------------------------------------------------

    if (
      updateData.latitude !== undefined ||
      updateData.longitude !== undefined
    ) {

      if (
        updateData.latitude === undefined ||
        updateData.longitude === undefined
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      const latitude =
        Number(
          updateData.latitude
        );

      const longitude =
        Number(
          updateData.longitude
        );


      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      if (
        latitude < -90 ||
        latitude > 90
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      if (
        longitude < -180 ||
        longitude > 180
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      updateData.latitude =
        latitude;

      updateData.longitude =
        longitude;

    }


    return mapRepository.update(
      id,
      updateData
    );

  }


  // =========================================================
  // Delete Location
  // =========================================================

  async deleteLocation(id) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }


    return mapRepository.delete(
      id
    );

  }


  // =========================================================
  // Check Location Exists
  // =========================================================

  async locationExists(id) {

    if (!id) {

      return false;

    }


    return mapRepository.exists(
      id
    );

  }


  // =========================================================
  // Count Locations
  // =========================================================

  async countLocations() {

    return mapRepository.count();

  }

}


// ===========================================================
// Service Instance
// ===========================================================

const mapService =
  new MapService();


// ===========================================================
// Export
// ===========================================================

export default Object.freeze(
  mapService
);
