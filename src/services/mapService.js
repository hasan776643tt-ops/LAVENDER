// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


class MapService {

  // =========================================================
  // Validate Coordinates
  // =========================================================

  validateCoordinates(
    latitude,
    longitude
  ) {

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


    return {
      latitude: lat,
      longitude: lon
    };

  }


  // =========================================================
  // Reverse Geocoding
  //
  // مهم:
  // هذه الوظيفة لا تحدد موقع المزرعة.
  // GPS هو الموقع الحقيقي.
  // Nominatim يستخدم فقط لوصف المنطقة المحيطة.
  // =========================================================

  async reverseGeocode(
    latitude,
    longitude,
    language = "ar"
  ) {

    const {
      latitude: lat,
      longitude: lon
    } =
      this.validateCoordinates(
        latitude,
        longitude
      );


    // -------------------------------------------------------
    // Language
    // -------------------------------------------------------

    const acceptLanguage =
      language === "tr"
        ? "tr"
        : language === "en"
        ? "en"
        : "ar";


    // -------------------------------------------------------
    // OpenStreetMap / Nominatim
    // -------------------------------------------------------

    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1` +
      `&accept-language=${encodeURIComponent(acceptLanguage)}`;


    const response =
      await fetch(
        url,
        {
          headers: {
            Accept:
              "application/json"
          }
        }
      );


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
    // Administrative information
    // =======================================================

    const village =
      address.village ||
      address.hamlet ||
      address.locality ||
      "";


    const town =
      address.town ||
      "";


    const municipality =
      address.municipality ||
      "";


    const city =
      address.city ||
      "";


    const district =
      address.county ||
      address.district ||
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


    // =======================================================
    // Nearest known place
    //
    // هذا وصف فقط وليس إحداثيات بديلة.
    // =======================================================

    const placeName =
      village ||
      town ||
      municipality ||
      city ||
      district ||
      "";


    return {

      // -----------------------------------------------------
      // GPS remains authoritative
      // -----------------------------------------------------

      latitude: lat,

      longitude: lon,


      // -----------------------------------------------------
      // Human readable information
      // -----------------------------------------------------

      village,

      town,

      municipality,

      city,

      district,

      region,

      country,

      placeName,

      displayName

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


    const {
      latitude,
      longitude
    } =
      this.validateCoordinates(
        data.latitude,
        data.longitude
      );


    const locationData = {

      ...data,


      // =====================================================
      // IMPORTANT
      // GPS coordinates are stored exactly as numeric values.
      // =====================================================

      latitude,

      longitude,


      farmId:
        String(
          data.farmId
        ),


      type:
        data.type ||
        "farm",


      status:
        data.status ||
        "active",


      createdAt:
        data.createdAt ||
        new Date().toISOString(),


      notes:
        data.notes ||
        "",


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


      const {
        latitude,
        longitude
      } =
        this.validateCoordinates(
          updateData.latitude,
          updateData.longitude
        );


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
