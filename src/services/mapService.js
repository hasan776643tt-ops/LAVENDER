// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — Map Service
// =========================================================
//
// GPS coordinates = authoritative
//
// Nominatim:
//   - Reverse geocoding
//   - Address description
//
// Overpass:
//   - Nearby named places
//   - Roads
//   - Villages
//   - Cities
//   - Schools
//   - Hospitals
//   - Clinics
//   - Worship places
//   - Government
//   - Police
//   - Fire stations
//   - Shops / services
//
// IMPORTANT:
//
// External map services NEVER modify the real GPS
// coordinates supplied by the device.
//
// GPS latitude / longitude always remain authoritative.
//
// Architecture:
//
// Map
//   ↓
// useMap
//   ↓
// mapService
//   ↓
// mapRepository
//
// External APIs are used only for descriptive
// geographical information.
// =========================================================


class MapService {


  // =========================================================
  // Constants
  // =========================================================

  static DEFAULT_NEARBY_RADIUS = 1000;

  static MIN_NEARBY_RADIUS = 50;

  static MAX_NEARBY_RADIUS = 5000;

  static MAX_NEARBY_RESULTS = 80;


  static NOMINATIM_URL =
    "https://nominatim.openstreetmap.org/reverse";


  static OVERPASS_ENDPOINTS = [

    "https://overpass-api.de/api/interpreter",

    "https://overpass.kumi.systems/api/interpreter",

  ];


  // =========================================================
  // Validate Coordinates
  // =========================================================
  //
  // GPS is authoritative.
  //
  // Strings such as "50.123" are accepted and normalized
  // to numbers.
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

      longitude: lon,

    };

  }


  // =========================================================
  // Validate Nearby Radius
  // =========================================================

  validateRadius(
    radius
  ) {

    const value =
      Number(radius);


    if (
      !Number.isFinite(value)
    ) {

      return (
        MapService.DEFAULT_NEARBY_RADIUS
      );

    }


    return Math.min(

      Math.max(

        value,

        MapService.MIN_NEARBY_RADIUS

      ),

      MapService.MAX_NEARBY_RADIUS

    );

  }


  // =========================================================
  // Normalize Language
  // =========================================================

  normalizeLanguage(
    language
  ) {

    if (
      language === "tr"
    ) {

      return "tr";

    }


    if (
      language === "en"
    ) {

      return "en";

    }


    return "ar";

  }


  // =========================================================
  // Get Accept Language
  // =========================================================

  getAcceptLanguage(
    language
  ) {

    const normalized =
      this.normalizeLanguage(
        language
      );


    if (
      normalized === "tr"
    ) {

      return "tr,en";

    }


    if (
      normalized === "en"
    ) {

      return "en";

    }


    return "ar,en";

  }


  // =========================================================
  // Reverse Geocoding
  // =========================================================
  //
  // Nominatim describes the GPS position.
  //
  // It does NOT change the GPS coordinates.
  //
  // IMPORTANT:
  // This function should be called only when needed.
  // Do not continuously call it on every GPS update.
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


    const acceptLanguage =
      this.getAcceptLanguage(
        language
      );


    const url =
      `${MapService.NOMINATIM_URL}` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1` +
      `&namedetails=1` +
      `&extratags=1` +
      `&accept-language=${encodeURIComponent(
        acceptLanguage
      )}`;


    let response;


    try {

      response =
        await fetch(
          url,
          {

            method:
              "GET",

            headers: {

              Accept:
                "application/json",

            },

          }
        );

    } catch (error) {

      console.warn(
        "Nominatim request failed:",
        error
      );


      throw new Error(
        "MAP_GEOCODING_FAILED"
      );

    }


    if (
      !response.ok
    ) {

      throw new Error(
        "MAP_GEOCODING_FAILED"
      );

    }


    let result;


    try {

      result =
        await response.json();

    } catch (error) {

      console.warn(
        "Nominatim JSON parsing failed:",
        error
      );


      throw new Error(
        "MAP_GEOCODING_FAILED"
      );

    }


    const address =
      result?.address || {};


    // =======================================================
    // Address Parts
    // =======================================================

    const houseNumber =
      address.house_number ||
      "";


    const road =
      address.road ||
      address.pedestrian ||
      address.footway ||
      "";


    const village =
      address.village ||
      address.hamlet ||
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


    const neighbourhood =
      address.neighbourhood ||
      address.suburb ||
      "";


    const district =
      address.district ||
      address.county ||
      "";


    const region =
      address.state ||
      address.province ||
      address.region ||
      "";


    const country =
      address.country ||
      "";


    // =======================================================
    // Settlement
    //
    // This is descriptive information only.
    //
    // It NEVER replaces GPS.
    // =======================================================

    const nearestPlace =
      village ||
      town ||
      city ||
      municipality ||
      neighbourhood ||
      district ||
      "";


    // =======================================================
    // Result Name
    // =======================================================

    const resultName =
      result?.name ||
      "";


    const displayName =
      result?.display_name ||
      "";


    // =======================================================
    // Return
    // =======================================================

    return {

      // -----------------------------------------------------
      // AUTHORITATIVE GPS
      // -----------------------------------------------------

      latitude:
        lat,

      longitude:
        lon,


      // -----------------------------------------------------
      // Address
      // -----------------------------------------------------

      houseNumber,

      road,

      village,

      town,

      municipality,

      city,

      neighbourhood,

      district,

      region,

      country,


      // -----------------------------------------------------
      // Descriptive Place
      // -----------------------------------------------------

      nearestPlace,

      placeName:
        resultName ||
        nearestPlace ||
        "",

      displayName,


      // -----------------------------------------------------
      // OSM Information
      // -----------------------------------------------------

      osmType:
        result?.osm_type ||
        null,

      osmId:
        result?.osm_id ||
        null,

      category:
        result?.category ||
        null,

      type:
        result?.type ||
        null,

      namedetails:
        result?.namedetails ||
        {},

      extratags:
        result?.extratags ||
        {},

    };

  }


  // =========================================================
  // Build Overpass Query
  // =========================================================
  //
  // We search around the REAL GPS point.
  //
  // Named objects are included.
  // Important unnamed services are also searched.
  //
  // The query uses the Overpass "around" filter with
  // latitude / longitude and radius in meters.
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
      this.validateRadius(
        radius
      );


    return `
      [out:json][timeout:25];

      (
        nwr["name"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="school"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="college"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="university"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="place_of_worship"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="hospital"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="clinic"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="pharmacy"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="townhall"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="police"](around:${safeRadius},${lat},${lon});

        nwr["amenity"="fire_station"](around:${safeRadius},${lat},${lon});

        nwr["office"="government"](around:${safeRadius},${lat},${lon});

        nwr["shop"](around:${safeRadius},${lat},${lon});

        nwr["highway"](around:${safeRadius},${lat},${lon});

        nwr["place"="village"](around:${safeRadius},${lat},${lon});

        nwr["place"="hamlet"](around:${safeRadius},${lat},${lon});

        nwr["place"="town"](around:${safeRadius},${lat},${lon});

        nwr["place"="city"](around:${safeRadius},${lat},${lon});
      );

      out center tags;
    `;

  }


  // =========================================================
  // Fetch Overpass
  // =========================================================

  async fetchOverpass(
    query
  ) {

    for (
      const endpoint
      of MapService.OVERPASS_ENDPOINTS
    ) {

      try {

        const response =
          await fetch(
            endpoint,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/x-www-form-urlencoded",

                Accept:
                  "application/json",

              },

              body:
                `data=${encodeURIComponent(
                  query
                )}`,

            }
          );


        if (
          !response.ok
        ) {

          console.warn(
            "Overpass HTTP error:",
            endpoint,
            response.status
          );


          continue;

        }


        const result =
          await response.json();


        if (
          result &&
          Array.isArray(
            result.elements
          )
        ) {

          return result;

        }

      } catch (error) {

        console.warn(
          "Overpass server failed:",
          endpoint,
          error
        );

      }

    }


    return null;

  }


  // =========================================================
  // Localized OSM Name
  // =========================================================

  getLocalizedName(
    tags,
    language
  ) {

    const normalized =
      this.normalizeLanguage(
        language
      );


    if (
      normalized === "ar"
    ) {

      return (

        tags["name:ar"] ||

        tags.name ||

        tags["name:en"] ||

        ""

      );

    }


    if (
      normalized === "tr"
    ) {

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
  // Detect Place Category
  // =========================================================

  getPlaceCategory(
    tags
  ) {

    const amenity =
      tags.amenity ||
      "";


    const shop =
      tags.shop ||
      "";


    const place =
      tags.place ||
      "";


    const highway =
      tags.highway ||
      "";


    const office =
      tags.office ||
      "";


    // -------------------------------------------------------
    // Worship
    // -------------------------------------------------------

    if (
      amenity ===
      "place_of_worship"
    ) {

      return {

        category:
          "worship",

        label:
          "مكان عبادة",

      };

    }


    // -------------------------------------------------------
    // Education
    // -------------------------------------------------------

    if (
      amenity ===
      "school"
    ) {

      return {

        category:
          "school",

        label:
          "مدرسة",

      };

    }


    if (
      amenity ===
      "college"
    ) {

      return {

        category:
          "college",

        label:
          "كلية",

      };

    }


    if (
      amenity ===
      "university"
    ) {

      return {

        category:
          "university",

        label:
          "جامعة",

      };

    }


    // -------------------------------------------------------
    // Health
    // -------------------------------------------------------

    if (
      amenity ===
      "hospital"
    ) {

      return {

        category:
          "hospital",

        label:
          "مشفى",

      };

    }


    if (
      amenity ===
      "clinic"
    ) {

      return {

        category:
          "clinic",

        label:
          "عيادة",

      };

    }


    if (
      amenity ===
      "pharmacy"
    ) {

      return {

        category:
          "pharmacy",

        label:
          "صيدلية",

      };

    }


    // -------------------------------------------------------
    // Government
    // -------------------------------------------------------

    if (
      amenity ===
      "townhall"
    ) {

      return {

        category:
          "government",

        label:
          "مركز حكومي",

      };

    }


    if (
      office ===
      "government"
    ) {

      return {

        category:
          "government",

        label:
          "جهة حكومية",

      };

    }


    // -------------------------------------------------------
    // Emergency
    // -------------------------------------------------------

    if (
      amenity ===
      "police"
    ) {

      return {

        category:
          "police",

        label:
          "شرطة",

      };

    }


    if (
      amenity ===
      "fire_station"
    ) {

      return {

        category:
          "fire_station",

        label:
          "إطفاء",

      };

    }


    // -------------------------------------------------------
    // Roads
    // -------------------------------------------------------

    if (
      highway
    ) {

      return {

        category:
          "road",

        label:
          "طريق",

      };

    }


    // -------------------------------------------------------
    // Shops
    // -------------------------------------------------------

    if (
      shop
    ) {

      return {

        category:
          "shop",

        label:
          "متجر",

      };

    }


    // -------------------------------------------------------
    // Settlements
    // -------------------------------------------------------

    if (
      place ===
      "village"
    ) {

      return {

        category:
          "village",

        label:
          "قرية",

      };

    }


    if (
      place ===
      "hamlet"
    ) {

      return {

        category:
          "hamlet",

        label:
          "تجمع سكني",

      };

    }


    if (
      place ===
      "town"
    ) {

      return {

        category:
          "town",

        label:
          "بلدة",

      };

    }


    if (
      place ===
      "city"
    ) {

      return {

        category:
          "city",

        label:
          "مدينة",

      };

    }


    // -------------------------------------------------------
    // Generic Place
    // -------------------------------------------------------

    return {

      category:
        "place",

      label:
        "مكان",

    };

  }


  // =========================================================
  // Convert OSM Element
  // =========================================================

  normalizeNearbyElement(
    item,
    language
  ) {

    if (
      !item
    ) {

      return null;

    }


    const tags =
      item.tags || {};


    // -------------------------------------------------------
    // Coordinates
    // -------------------------------------------------------

    let itemLatitude =
      item.lat;


    let itemLongitude =
      item.lon;


    // Ways / relations use center
    // because query uses "out center".

    if (
      itemLatitude === undefined &&
      item.center
    ) {

      itemLatitude =
        item.center.lat;

    }


    if (
      itemLongitude === undefined &&
      item.center
    ) {

      itemLongitude =
        item.center.lon;

    }


    const normalizedLatitude =
      Number(
        itemLatitude
      );


    const normalizedLongitude =
      Number(
        itemLongitude
      );


    if (
      !Number.isFinite(
        normalizedLatitude
      ) ||
      !Number.isFinite(
        normalizedLongitude
      )
    ) {

      return null;

    }


    // -------------------------------------------------------
    // Name
    // -------------------------------------------------------

    const name =
      this.getLocalizedName(
        tags,
        language
      );


    // -------------------------------------------------------
    // Category
    // -------------------------------------------------------

    const {
      category,
      label,
    } =
      this.getPlaceCategory(
        tags
      );


    // -------------------------------------------------------
    // Return
    // -------------------------------------------------------

    return {

      id:
        `${item.type}-${item.id}`,

      osmType:
        item.type,

      osmId:
        item.id,


      name,


      category,

      label,


      latitude:
        normalizedLatitude,

      longitude:
        normalizedLongitude,


      highway:
        tags.highway ||
        "",


      amenity:
        tags.amenity ||
        "",


      shop:
        tags.shop ||
        "",


      office:
        tags.office ||
        "",


      place:
        tags.place ||
        "",


      religion:
        tags.religion ||
        "",


      denomination:
        tags.denomination ||
        "",


      tags,

    };

  }


  // =========================================================
  // Nearby Places
  // =========================================================
  //
  // Returns nearby OSM objects around the REAL GPS point.
  //
  // The GPS coordinates supplied to this method remain
  // untouched.
  // =========================================================

  async getNearbyPlaces(
    latitude,
    longitude,
    radius = MapService.DEFAULT_NEARBY_RADIUS,
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
      this.validateRadius(
        radius
      );


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


    // -------------------------------------------------------
    // Nearby lookup failure must NOT invalidate GPS.
    // -------------------------------------------------------

    if (
      !result ||
      !Array.isArray(
        result.elements
      )
    ) {

      return [];

    }


    // -------------------------------------------------------
    // Normalize
    // -------------------------------------------------------

    const places =
      result.elements

        .map(
          (item) =>
            this.normalizeNearbyElement(
              item,
              language
            )
        )

        .filter(
          Boolean
        )

        .filter(
          (item) =>
            Boolean(item.name)
        );


    // -------------------------------------------------------
    // Remove duplicates
    // -------------------------------------------------------

    const unique =
      Array.from(

        new Map(

          places.map(
            (item) => [

              `${item.osmType}|${item.osmId}`,

              item,

            ]
          )

        ).values()

      );


    // -------------------------------------------------------
    // Calculate distance
    // -------------------------------------------------------

    const withDistance =
      unique.map(
        (item) => ({

          ...item,

          distance:
            this.calculateDistance(
              lat,
              lon,
              item.latitude,
              item.longitude
            ),

        })
      );


    // -------------------------------------------------------
    // Protect against unexpected OSM data outside radius
    // -------------------------------------------------------

    const withinRadius =
      withDistance.filter(
        (item) =>
          item.distance <=
          safeRadius
      );


    // -------------------------------------------------------
    // Nearest first
    // -------------------------------------------------------

    withinRadius.sort(
      (a, b) =>
        a.distance -
        b.distance
    );


    // -------------------------------------------------------
    // Limit
    // -------------------------------------------------------

    return withinRadius.slice(
      0,
      MapService.MAX_NEARBY_RESULTS
    );

  }


  // =========================================================
  // Distance
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


    const earthRadius =
      6371000;


    const toRadians =
      (value) =>
        value *
        Math.PI /
        180;


    const dLatitude =
      toRadians(
        lat2 -
        lat1
      );


    const dLongitude =
      toRadians(
        lon2 -
        lon1
      );


    const a =

      Math.sin(
        dLatitude / 2
      ) ** 2

      +

      Math.cos(
        toRadians(lat1)
      )

      *

      Math.cos(
        toRadians(lat2)
      )

      *

      Math.sin(
        dLongitude / 2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(
          1 - a
        )
      );


    return (
      earthRadius *
      c
    );

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

  async getLocationById(
    id
  ) {

    if (
      !id
    ) {

      throw new Error(
        "MAP_ID_REQUIRED"
      );

    }


    return mapRepository.getById(
      id
    );

  }


  // =========================================================
  // Create Location
  // =========================================================

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


    if (
      !data.farmId
    ) {

      throw new Error(
        "MAP_FARM_REQUIRED"
      );

    }


    if (
      data.latitude ===
        undefined ||

      data.latitude ===
        null ||

      data.latitude ===
        "" ||

      data.longitude ===
        undefined ||

      data.longitude ===
        null ||

      data.longitude ===
        ""
    ) {

      throw new Error(
        "MAP_COORDINATES_REQUIRED"
      );

    }


    const {
      latitude,
      longitude,
    } =
      this.validateCoordinates(
        data.latitude,
        data.longitude
      );


    let accuracy =
      null;


    if (
      data.accuracy !==
        undefined &&

      data.accuracy !==
        null &&

      data.accuracy !==
        ""
    ) {

      const numericAccuracy =
        Number(
          data.accuracy
        );


      if (
        Number.isFinite(
          numericAccuracy
        ) &&
        numericAccuracy >= 0
      ) {

        accuracy =
          numericAccuracy;

      }

    }


    const locationData = {

      ...data,


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


      accuracy,

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

    if (
      !id
    ) {

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


    // -------------------------------------------------------
    // Coordinates
    //
    // If one coordinate is supplied, the other must also
    // be supplied.
    // -------------------------------------------------------

    const hasLatitude =
      updateData.latitude !==
      undefined;


    const hasLongitude =
      updateData.longitude !==
      undefined;


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


      const {
        latitude,
        longitude,
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


    // -------------------------------------------------------
    // Accuracy
    // -------------------------------------------------------

    if (
      updateData.accuracy !==
        undefined &&

      updateData.accuracy !==
        null &&

      updateData.accuracy !==
        ""
    ) {

      const numericAccuracy =
        Number(
          updateData.accuracy
        );


      if (
        !Number.isFinite(
          numericAccuracy
        ) ||
        numericAccuracy < 0
      ) {

        updateData.accuracy =
          null;

      } else {

        updateData.accuracy =
          numericAccuracy;

      }

    }


    return mapRepository.update(
      id,
      updateData
    );

  }


  // =========================================================
  // Delete Location
  // =========================================================

  async deleteLocation(
    id
  ) {

    if (
      !id
    ) {

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

  async locationExists(
    id
  ) {

    if (
      !id
    ) {

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
