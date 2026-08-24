// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


class MapService {

  // =========================================================
  // Reverse Geocoding
  // تحويل الإحداثيات إلى اسم المكان
  // =========================================================

  async reverseGeocode(
    latitude,
    longitude
  ) {

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    const lat =
      Number(latitude);

    const lon =
      Number(longitude);


    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    if (
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    // -------------------------------------------------------
    // OpenStreetMap / Nominatim
    // -------------------------------------------------------

    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1`;


    const response =
      await fetch(url, {

        headers: {
          Accept:
            "application/json"
        }

      });


    if (!response.ok) {

      throw new Error(
        "MAP_GEOCODING_FAILED"
      );

    }


    const result =
      await response.json();


    const address =
      result?.address || {};


    // =======================================================
    // استخراج أسماء المكان
    // =======================================================

    const village =
      address.village ||
      address.hamlet ||
      address.locality ||
      address.town ||
      address.city ||
      "";


    const district =
      address.county ||
      address.district ||
      address.municipality ||
      "";


    const region =
      address.state ||
      address.province ||
      address.region ||
      "";


    const country =
      address.country ||
      "";


    const displayName =
      result?.display_name ||
      "";


    return {

      village,

      district,

      region,

      country,

      displayName,

      latitude: lat,

      longitude: lon

    };

  }


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
