// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — MAP SERVICE
// =========================================================
//
// الخريطة الخارجية:
// OpenStreetMap / Nominatim / Overpass
//
// وظيفتها:
// - عرض المعلومات الجغرافية
// - القرى
// - البلدات
// - المدن
// - الطرق
// - الخدمات
// - المراكز الحكومية
//
// لكنها NEVER تستبدل إحداثيات المستخدم.
//
// مصدر موقع الأرض:
// 1. تحديد يدوي على الخريطة
// 2. أو إدخال كتابي
//
// =========================================================


class MapService {


  // =========================================================
  // CONSTANTS
  // =========================================================

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


  // =========================================================
  // COORDINATES
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


  // =========================================================
  // RADIUS
  // =========================================================

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


  // =========================================================
  // LANGUAGE
  // =========================================================

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


  // =========================================================
  // REVERSE GEOCODING
  // =========================================================
  //
  // معلومات وصفية فقط.
  //
  // لا يتم استخدامها لتغيير موقع الأرض.
  // =========================================================

  async reverseGeocode(
    latitude,
    longitude,
    language = "ar"
  ) {

    const {
      latitude: lat,
      longitude: lon,
    } =
      this.validateCoordinates(
        latitude,
        longitude
      );

    const url =
      `${MapService.NOMINATIM_URL}` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1` +
      `&namedetails=1` +
      `&accept-language=${encodeURIComponent(
        this.getAcceptLanguage(language)
      )}`;


    try {

      const response =
        await fetch(url, {
          method: "GET",
          headers: {
            Accept:
              "application/json",
          },
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


      const village =
        address.village ||
        address.hamlet ||
        "";


      const town =
        address.town ||
        "";


      const city =
        address.city ||
        "";


      const region =
        address.state ||
        address.province ||
        address.region ||
        "";


      const country =
        address.country ||
        "";


      const road =
        address.road ||
        address.pedestrian ||
        address.footway ||
        "";


      return {

        latitude: lat,

        longitude: lon,

        country,

        region,

        village,

        town,

        city,

        road,

        displayName:
          result?.display_name ||
          "",

        placeName:
          result?.name ||
          village ||
          town ||
          city ||
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

        latitude: lat,

        longitude: lon,

        country: "",

        region: "",

        village: "",

        town: "",

        city: "",

        road: "",

        displayName: "",

        placeName: "",

        osmType: null,

        osmId: null,

        address: {},

      };

    }

  }


  // =========================================================
  // OVERPASS QUERY
  // =========================================================

  buildNearbyQuery(
    latitude,
    longitude,
    radius
  ) {

    const {
      latitude: lat,
      longitude: lon,
    } =
      this.validateCoordinates(
        latitude,
        longitude
      );


    const safeRadius =
      this.validateRadius(radius);


    return `
      [out:json][timeout:30];

      (
        nwr["name"](around:${safeRadius},${lat},${lon});

        nwr["highway"](around:${safeRadius},${lat},${lon});

        nwr["place"="village"](around:${safeRadius},${lat},${lon});

        nwr["place"="hamlet"](around:${safeRadius},${lat},${lon});

        nwr["place"="town"](around:${safeRadius},${lat},${lon});

        nwr["place"="city"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="school"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="hospital"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="clinic"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="pharmacy"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="townhall"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="police"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="fire_station"](around:${safeRadius},${lat},${lon});

        nwr["office"="government"](around:${safeRadius},${lat},${lon});

        nwr["shop"](around:${safeRadius},${lat},${lon});
      );

      out center tags;
    `;

  }


  // =========================================================
  // FETCH OVERPASS
  // =========================================================

  async fetchOverpass(query) {

    for (
      const endpoint
      of MapService.OVERPASS_ENDPOINTS
    ) {

      try {

        const response =
          await fetch(
            endpoint,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/x-www-form-urlencoded",

                Accept:
                  "application/json",

              },

              body:
                `data=${encodeURIComponent(query)}`,

            }
          );


        if (!response.ok) {
          continue;
        }


        const result =
          await response.json();


        if (
          Array.isArray(
            result?.elements
          )
        ) {

          return result;

        }

      } catch (error) {

        console.warn(
          "Overpass endpoint failed:",
          endpoint,
          error
        );

      }

    }


    return null;

  }


  // =========================================================
  // LOCALIZED NAME
  // =========================================================

  getLocalizedName(
    tags,
    language
  ) {

    const lang =
      this.normalizeLanguage(
        language
      );


    if (lang === "ar") {

      return (
        tags["name:ar"] ||
        tags.name ||
        tags["name:en"] ||
        ""
      );

    }


    if (lang === "tr") {

      return (
        tags["name:tr"] ||
        tags.name ||
        tags["name:en"] ||
        ""
      );

    }


    return (
      tags["name:en"] ||
      tags.name ||
      tags["name:ar"] ||
      ""
    );

  }


  // =========================================================
  // CATEGORY
  // =========================================================

  getPlaceCategory(tags) {

    if (
      tags.place === "village"
    ) {

      return "village";

    }

    if (
      tags.place === "hamlet"
    ) {

      return "hamlet";

    }

    if (
      tags.place === "town"
    ) {

      return "town";

    }

    if (
      tags.place === "city"
    ) {

      return "city";

    }

    if (
      tags.highway
    ) {

      return "road";

    }

    if (
      tags.amenity === "school"
    ) {

      return "school";

    }

    if (
      tags.amenity === "hospital"
    ) {

      return "hospital";

    }

    if (
      tags.amenity === "clinic"
    ) {

      return "clinic";

    }

    if (
      tags.amenity === "pharmacy"
    ) {

      return "pharmacy";

    }

    if (
      tags.amenity === "townhall" ||
      tags.office === "government"
    ) {

      return "government";

    }

    if (
      tags.amenity === "police"
    ) {

      return "police";

    }

    if (
      tags.amenity === "fire_station"
    ) {

      return "fire_station";

    }

    if (
      tags.shop
    ) {

      return "shop";

    }

    return "place";

  }


  // =========================================================
  // NORMALIZE OSM ELEMENT
  // =========================================================

  normalizeNearbyElement(
    item,
    language
  ) {

    if (!item) {
      return null;
    }


    const tags =
      item.tags || {};


    const latitude =
      Number(
        item.lat ??
        item.center?.lat
      );


    const longitude =
      Number(
        item.lon ??
        item.center?.lon
      );


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      return null;

    }


    const name =
      this.getLocalizedName(
        tags,
        language
      );


    if (!name) {
      return null;
    }


    return {

      id:
        `${item.type}-${item.id}`,

      osmType:
        item.type,

      osmId:
        item.id,

      name,

      category:
        this.getPlaceCategory(tags),

      latitude,

      longitude,

      tags,

    };

  }


  // =========================================================
  // NEARBY PLACES
  // =========================================================

  async getNearbyPlaces(
    latitude,
    longitude,
    radius = MapService.DEFAULT_RADIUS,
    language = "ar"
  ) {

    const {
      latitude: lat,
      longitude: lon,
    } =
      this.validateCoordinates(
        latitude,
        longitude
      );


    const safeRadius =
      this.validateRadius(radius);


    const query =
      this.buildNearbyQuery(
        lat,
        lon,
        safeRadius
      );


    const result =
      await this.fetchOverpass(
        query
      );


    if (
      !result ||
      !Array.isArray(
        result.elements
      )
    ) {

      return [];

    }


    const places =
      result.elements

        .map(
          item =>
            this.normalizeNearbyElement(
              item,
              language
            )
        )

        .filter(Boolean)

        .map(
          item => ({

            ...item,

            distance:
              this.calculateDistance(
                lat,
                lon,
                item.latitude,
                item.longitude
              ),

          })
        )

        .filter(
          item =>
            item.distance <=
            safeRadius
        );


    places.sort(
      (a, b) =>
        a.distance -
        b.distance
    );


    return places.slice(
      0,
      MapService.MAX_RESULTS
    );

  }


  // =========================================================
  // DISTANCE
  // =========================================================

  calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) {

    const {
      latitude: lat1,
      longitude: lon1,
    } =
      this.validateCoordinates(
        latitude1,
        longitude1
      );


    const {
      latitude: lat2,
      longitude: lon2,
    } =
      this.validateCoordinates(
        latitude2,
        longitude2
      );


    const R = 6371000;


    const toRad =
      value =>
        value *
        Math.PI /
        180;


    const dLat =
      toRad(
        lat2 - lat1
      );


    const dLon =
      toRad(
        lon2 - lon1
      );


    const a =
      Math.sin(dLat / 2) ** 2 +

      Math.cos(toRad(lat1)) *

      Math.cos(toRad(lat2)) *

      Math.sin(dLon / 2) ** 2;


    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );

  }


  // =========================================================
  // STORAGE
  // =========================================================

  async getAllLocations() {

    return mapRepository.getAll();

  }


  async getLocationById(id) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }

    return mapRepository.getById(id);

  }


  // =========================================================
  // CREATE LOCATION
  // =========================================================
  //
  // IMPORTANT:
  //
  // Written mode:
  // coordinates may be null.
  //
  // Map mode:
  // coordinates are required.
  //
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


    const mode =
      data.source ||
      data.locationMode ||
      "text";


    let latitude = null;

    let longitude = null;


    const hasLatitude =
      data.latitude !== undefined &&
      data.latitude !== null &&
      data.latitude !== "";


    const hasLongitude =
      data.longitude !== undefined &&
      data.longitude !== null &&
      data.longitude !== "";


    // -------------------------------------------------------
    // MAP MODE
    // -------------------------------------------------------

    if (mode === "map") {

      if (
        !hasLatitude ||
        !hasLongitude
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      const coordinates =
        this.validateCoordinates(
          data.latitude,
          data.longitude
        );


      latitude =
        coordinates.latitude;


      longitude =
        coordinates.longitude;

    }


    // -------------------------------------------------------
    // TEXT MODE
    // -------------------------------------------------------

    if (mode === "text") {

      if (
        !data.country?.trim() &&
        !data.region?.trim() &&
        !data.village?.trim() &&
        !data.placeName?.trim() &&
        !data.locationDescription?.trim()
      ) {

        throw new Error(
          "MAP_LOCATION_TEXT_REQUIRED"
        );

      }


      // إذا أدخل المستخدم إحداثيات أيضًا،
      // نتحقق منها، لكن لا نجبره عليها.

      if (
        hasLatitude &&
        hasLongitude
      ) {

        const coordinates =
          this.validateCoordinates(
            data.latitude,
            data.longitude
          );


        latitude =
          coordinates.latitude;


        longitude =
          coordinates.longitude;

      }

    }


    // -------------------------------------------------------
    // POINTS
    // -------------------------------------------------------

    const points =
      Array.isArray(data.points)

        ? data.points
            .filter(
              point =>
                point &&
                point.latitude !== undefined &&
                point.longitude !== undefined
            )
            .map(
              point => {

                const coordinates =
                  this.validateCoordinates(
                    point.latitude,
                    point.longitude
                  );

                return coordinates;

              }
            )

        : [];


    // -------------------------------------------------------
    // FINAL DATA
    // -------------------------------------------------------

    const location = {

      ...data,

      farmId:
        String(data.farmId),

      latitude,

      longitude,

      points,

      source: mode,

      type:
        data.type ||
        "farm",

      status:
        data.status ||
        "active",

      country:
        data.country?.trim() ||
        "",

      region:
        data.region?.trim() ||
        "",

      village:
        data.village?.trim() ||
        "",

      placeName:
        data.placeName?.trim() ||
        "",

      locationDescription:
        data.locationDescription?.trim() ||
        "",

      notes:
        data.notes?.trim() ||
        "",

      area:
        data.area !== null &&
        data.area !== undefined &&
        data.area !== ""

          ? Number(data.area)

          : null,

      perimeter:
        data.perimeter !== null &&
        data.perimeter !== undefined &&
        data.perimeter !== ""

          ? Number(data.perimeter)

          : null,

      boundaryWidth:
        data.boundaryWidth !== null &&
        data.boundaryWidth !== undefined &&
        data.boundaryWidth !== ""

          ? Number(data.boundaryWidth)

          : null,

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

    };


    return mapRepository.create(
      location
    );

  }


  // =========================================================
  // UPDATE
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
      ...data,
    };


    const hasLatitude =
      updateData.latitude !== undefined;


    const hasLongitude =
      updateData.longitude !== undefined;


    if (
      hasLatitude ||
      hasLongitude
    ) {

      if (
        !hasLatitude ||
        !hasLongitude
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


    if (
      Array.isArray(
        updateData.points
      )
    ) {

      updateData.points =
        updateData.points.map(
          point =>
            this.validateCoordinates(
              point.latitude,
              point.longitude
            )
        );

    }


    return mapRepository.update(
      id,
      updateData
    );

  }


  // =========================================================
  // DELETE
  // =========================================================

  async deleteLocation(id) {

    if (!id) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }

    return mapRepository.delete(id);

  }


  // =========================================================
  // EXISTS
  // =========================================================

  async locationExists(id) {

    return mapRepository.exists(id);

  }


  // =========================================================
  // COUNT
  // =========================================================

  async countLocations() {

    return mapRepository.count();

  }

}


const mapService =
  new MapService();


export default Object.freeze(
  mapService
);
