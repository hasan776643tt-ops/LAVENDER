// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — MAP SERVICE
// =========================================================
//
// مصادر الموقع:
//
// 1. MAP
//    المستخدم يرسم الأرض يدويًا.
//    النقاط التي يحددها المستخدم هي المصدر الحقيقي للموقع.
//
// 2. TEXT
//    المستخدم يكتب:
//    البلد
//    المحافظة / المنطقة
//    المدينة
//    البلدة / القرية
//    وصف الأرض
//    جار الشمال
//    جار الجنوب
//    جار الشرق
//    جار الغرب
//
// Nominatim / Overpass:
// معلومات جغرافية مساعدة فقط.
// NEVER تستبدل موقع المستخدم.
//
// =========================================================


class MapService {


  // =======================================================
  // CONSTANTS
  // =======================================================

  static DEFAULT_RADIUS = 1000;

  static MIN_RADIUS = 50;

  static MAX_RADIUS = 5000;

  static MAX_RESULTS = 100;


  static NOMINATIM_URL =
    "https://nominatim.openstreetmap.org/reverse";


  static OVERPASS_ENDPOINTS = [

    "https://overpass-api.de/api/interpreter",

    "https://overpass.kumi.systems/api/interpreter",

  ];


  // =======================================================
  // COORDINATES
  // =======================================================

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
      !Number.isFinite(lon) ||
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

      longitude: lon,

    };

  }


  // =======================================================
  // RADIUS
  // =======================================================

  validateRadius(radius) {

    const value =
      Number(radius);


    if (
      !Number.isFinite(value)
    ) {

      return MapService.DEFAULT_RADIUS;

    }


    return Math.min(

      Math.max(
        value,
        MapService.MIN_RADIUS
      ),

      MapService.MAX_RADIUS

    );

  }


  // =======================================================
  // LANGUAGE
  // =======================================================

  normalizeLanguage(language) {

    if (language === "en") {

      return "en";

    }


    if (language === "tr") {

      return "tr";

    }


    return "ar";

  }


  getAcceptLanguage(language) {

    const lang =
      this.normalizeLanguage(
        language
      );


    if (lang === "en") {

      return "en";

    }


    if (lang === "tr") {

      return "tr,en";

    }


    return "ar,en";

  }


  // =======================================================
  // VALIDATE POINTS
  // =======================================================

  validatePoints(points) {

    if (
      !Array.isArray(points)
    ) {

      throw new Error(
        "MAP_POINTS_REQUIRED"
      );

    }


    if (
      points.length < 3
    ) {

      throw new Error(
        "MAP_THREE_POINTS_REQUIRED"
      );

    }


    return points.map(
      point => {

        if (
          Array.isArray(point)
        ) {

          const coordinates =
            this.validateCoordinates(
              point[0],
              point[1]
            );


          return {

            latitude:
              coordinates.latitude,

            longitude:
              coordinates.longitude,

          };

        }


        if (
          point &&
          typeof point === "object"
        ) {

          return this.validateCoordinates(
            point.latitude,
            point.longitude
          );

        }


        throw new Error(
          "MAP_INVALID_POINT"
        );

      }
    );

  }


  // =======================================================
  // DISTANCE
  // =======================================================

  calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) {

    const first =
      this.validateCoordinates(
        latitude1,
        longitude1
      );


    const second =
      this.validateCoordinates(
        latitude2,
        longitude2
      );


    const earthRadius =
      6371008.8;


    const toRadians =
      value =>
        Number(value) *
        Math.PI /
        180;


    const dLat =
      toRadians(
        second.latitude -
        first.latitude
      );


    const dLon =
      toRadians(
        second.longitude -
        first.longitude
      );


    const lat1 =
      toRadians(
        first.latitude
      );


    const lat2 =
      toRadians(
        second.latitude
      );


    const a =
      Math.sin(
        dLat / 2
      ) ** 2 +

      Math.cos(lat1) *
      Math.cos(lat2) *

      Math.sin(
        dLon / 2
      ) ** 2;


    return (
      earthRadius *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );

  }


  // =======================================================
  // PERIMETER
  // =======================================================

  calculatePerimeter(
    points
  ) {

    const safePoints =
      this.validatePoints(
        points
      );


    let total = 0;


    for (
      let index = 0;
      index < safePoints.length;
      index++
    ) {

      const current =
        safePoints[index];


      const next =
        safePoints[
          (index + 1) %
          safePoints.length
        ];


      total +=
        this.calculateDistance(

          current.latitude,

          current.longitude,

          next.latitude,

          next.longitude

        );

    }


    return total;

  }


  // =======================================================
  // AREA
  // =======================================================

  calculateArea(
    points
  ) {

    const safePoints =
      this.validatePoints(
        points
      );


    const earthRadius =
      6378137;


    const referenceLatitude =
      safePoints.reduce(
        (
          total,
          point
        ) =>
          total +
          (
            Number(point.latitude) *
            Math.PI /
            180
          ),
        0
      ) /
      safePoints.length;


    const cosLatitude =
      Math.cos(
        referenceLatitude
      );


    const projected =
      safePoints.map(
        point => {

          const latitude =
            Number(point.latitude) *
            Math.PI /
            180;


          const longitude =
            Number(point.longitude) *
            Math.PI /
            180;


          return [

            earthRadius *
            longitude *
            cosLatitude,

            earthRadius *
            latitude,

          ];

        }
      );


    let area = 0;


    for (
      let index = 0;
      index < projected.length;
      index++
    ) {

      const current =
        projected[index];


      const next =
        projected[
          (index + 1) %
          projected.length
        ];


      area +=
        (
          current[0] *
          next[1]
        ) -
        (
          next[0] *
          current[1]
        );

    }


    return Math.abs(
      area / 2
    );

  }


  // =======================================================
  // REVERSE GEOCODING
  // =======================================================

  async reverseGeocode(
    latitude,
    longitude,
    language = "ar"
  ) {

    const coordinates =
      this.validateCoordinates(
        latitude,
        longitude
      );


    const url =
      `${MapService.NOMINATIM_URL}` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(
        coordinates.latitude
      )}` +
      `&lon=${encodeURIComponent(
        coordinates.longitude
      )}` +
      `&zoom=18` +
      `&addressdetails=1` +
      `&namedetails=1` +
      `&accept-language=${encodeURIComponent(
        this.getAcceptLanguage(language)
      )}`;


    try {

      const response =
        await fetch(
          url,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
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


      return {

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        country:
          address.country ||
          "",

        region:
          address.state ||
          address.province ||
          address.region ||
          "",

        city:
          address.city ||
          "",

        town:
          address.town ||
          "",

        village:
          address.village ||
          address.hamlet ||
          "",

        road:
          address.road ||
          address.pedestrian ||
          "",

        displayName:
          result?.display_name ||
          "",

        placeName:
          result?.name ||
          "",

        osmType:
          result?.osm_type ||
          null,

        osmId:
          result?.osm_id ||
          null,

        address,

      };

    } catch (error) {

      console.warn(
        "Reverse geocoding failed:",
        error
      );


      return {

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        country: "",

        region: "",

        city: "",

        town: "",

        village: "",

        road: "",

        displayName: "",

        placeName: "",

        osmType: null,

        osmId: null,

        address: {},

      };

    }

  }


  // =======================================================
  // CREATE LOCATION
  // =======================================================

  async createLocation(
    data
  ) {

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


    const source =
      data.source ||
      data.locationMode ||
      "text";


    if (
      source !== "map" &&
      source !== "text"
    ) {

      throw new Error(
        "MAP_SOURCE_INVALID"
      );

    }


    // =====================================================
    // MAP MODE
    // =====================================================

    if (source === "map") {

      const points =
        this.validatePoints(
          data.points
        );


      const firstPoint =
        points[0];


      const location = {

        ...data,

        id:
          undefined,

        farmId:
          String(data.farmId),

        source:
          "map",

        points,

        latitude:
          firstPoint.latitude,

        longitude:
          firstPoint.longitude,

        area:
          this.calculateArea(
            points
          ),

        perimeter:
          this.calculatePerimeter(
            points
          ),

        country:
          String(
            data.country || ""
          ).trim(),

        region:
          String(
            data.region || ""
          ).trim(),

        city:
          String(
            data.city || ""
          ).trim(),

        village:
          String(
            data.village || ""
          ).trim(),

        town:
          String(
            data.town || ""
          ).trim(),

        placeName:
          String(
            data.placeName || ""
          ).trim(),

        locationDescription:
          String(
            data.locationDescription || ""
          ).trim(),

        northNeighbor:
          String(
            data.northNeighbor || ""
          ).trim(),

        southNeighbor:
          String(
            data.southNeighbor || ""
          ).trim(),

        eastNeighbor:
          String(
            data.eastNeighbor || ""
          ).trim(),

        westNeighbor:
          String(
            data.westNeighbor || ""
          ).trim(),

        notes:
          String(
            data.notes || ""
          ).trim(),

        type:
          data.type ||
          "field",

        status:
          data.status ||
          "active",

        createdAt:
          data.createdAt ||
          new Date().toISOString(),

      };


      delete location.id;


      return mapRepository.create(
        location
      );

    }


    // =====================================================
    // TEXT MODE
    // =====================================================

    const country =
      String(
        data.country || ""
      ).trim();


    const region =
      String(
        data.region || ""
      ).trim();


    const city =
      String(
        data.city || ""
      ).trim();


    const town =
      String(
        data.town || ""
      ).trim();


    const locationDescription =
      String(
        data.locationDescription || ""
      ).trim();


    const northNeighbor =
      String(
        data.northNeighbor || ""
      ).trim();


    const southNeighbor =
      String(
        data.southNeighbor || ""
      ).trim();


    const eastNeighbor =
      String(
        data.eastNeighbor || ""
      ).trim();


    const westNeighbor =
      String(
        data.westNeighbor || ""
      ).trim();


    if (
      !country &&
      !region &&
      !city &&
      !town &&
      !locationDescription &&
      !northNeighbor &&
      !southNeighbor &&
      !eastNeighbor &&
      !westNeighbor
    ) {

      throw new Error(
        "MAP_LOCATION_TEXT_REQUIRED"
      );

    }


    const location = {

      ...data,

      farmId:
        String(data.farmId),

      source:
        "text",

      points: [],

      latitude:
        null,

      longitude:
        null,

      area:
        null,

      perimeter:
        null,

      country,

      region,

      city,

      town,

      village:
        town,

      placeName:
        town ||
        city,

      locationDescription,

      northNeighbor,

      southNeighbor,

      eastNeighbor,

      westNeighbor,

      notes:
        String(
          data.notes || ""
        ).trim(),

      type:
        data.type ||
        "field",

      status:
        data.status ||
        "active",

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

    };


    return mapRepository.create(
      location
    );

  }


  // =======================================================
  // UPDATE
  // =======================================================

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
      ...data,
    };


    if (
      Array.isArray(
        updateData.points
      )
    ) {

      const points =
        this.validatePoints(
          updateData.points
        );


      updateData.points =
        points;


      updateData.latitude =
        points[0].latitude;


      updateData.longitude =
        points[0].longitude;


      updateData.area =
        this.calculateArea(
          points
        );


      updateData.perimeter =
        this.calculatePerimeter(
          points
        );

    }


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


      const coordinates =
        this.validateCoordinates(
          updateData.latitude,
          updateData.longitude
        );


      updateData.latitude =
        coordinates.latitude;


      updateData.longitude =
        coordinates.longitude;

    }


    const textFields = [

      "country",
      "region",
      "city",
      "town",
      "village",
      "placeName",
      "locationDescription",
      "northNeighbor",
      "southNeighbor",
      "eastNeighbor",
      "westNeighbor",
      "notes",

    ];


    textFields.forEach(
      field => {

        if (
          updateData[field] !== undefined
        ) {

          updateData[field] =
            String(
              updateData[field] || ""
            ).trim();

        }

      }
    );


    return mapRepository.update(
      id,
      updateData
    );

  }


  // =======================================================
  // DELETE
  // =======================================================

  async deleteLocation(
    id
  ) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }


    return mapRepository.delete(
      id
    );

  }


  // =======================================================
  // GET
  // =======================================================

  async getAllLocations() {

    return mapRepository.getAll();

  }


  async getLocationById(
    id
  ) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }


    return mapRepository.getById(
      id
    );

  }


  async getLocationsByFarmId(
    farmId
  ) {

    return mapRepository.getByFarmId(
      farmId
    );

  }


  // =======================================================
  // EXISTS
  // =======================================================

  async locationExists(
    id
  ) {

    return mapRepository.exists(
      id
    );

  }


  // =======================================================
  // COUNT
  // =======================================================

  async countLocations() {

    return mapRepository.count();

  }

}


const mapService =
  new MapService();


export default Object.freeze(
  mapService
);
