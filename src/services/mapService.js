// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// Map Service
// =========================================================
// GPS coordinates = authoritative
//
// Nominatim = address description
// Overpass = nearby named places / roads / POIs
//
// IMPORTANT:
// Reverse geocoding NEVER changes GPS coordinates.
// =========================================================

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

      longitude: lon,

    };

  }


  // =========================================================
  // Reverse Geocoding
  //
  // Gives the address of the GPS position.
  //
  // It does NOT give every nearby object.
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


    // =======================================================
    // Language
    // =======================================================

    const acceptLanguage =
      language === "tr"
        ? "tr,en"
        : language === "en"
        ? "en"
        : "ar,en";


    // =======================================================
    // Nominatim URL
    //
    // zoom=18 = building-level reverse geocoding
    // namedetails=1 = additional names
    // =======================================================

    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1` +
      `&namedetails=1` +
      `&extratags=1` +
      `&accept-language=${encodeURIComponent(acceptLanguage)}`;


    const response =
      await fetch(
        url,
        {
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


    // =======================================================
    // Address parts
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
    // Nearest settlement
    //
    // Descriptive only.
    // =======================================================

    const nearestPlace =
      village ||
      town ||
      municipality ||
      city ||
      neighbourhood ||
      district ||
      "";


    // =======================================================
    // Result name
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
      // REAL GPS
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
      // Place
      // -----------------------------------------------------

      nearestPlace,

      placeName:
        resultName ||
        nearestPlace ||
        "",

      displayName,


      // -----------------------------------------------------
      // Raw result
      //
      // Useful for future improvements.
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

    };

  }


  // =========================================================
  // Nearby Places
  //
  // IMPORTANT:
  //
  // This is what was missing before.
  //
  // We search around the REAL GPS position for:
  //
  // - mosques
  // - schools
  // - government buildings
  // - hospitals
  // - roads
  // - villages / settlements
  // - shops
  // - named places
  //
  // Overpass reads OpenStreetMap objects around the point.
  // =========================================================

  async getNearbyPlaces(
    latitude,
    longitude,
    radius = 1000,
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


    // =======================================================
    // Overpass Query
    //
    // Search only named objects.
    // =======================================================

    const query = `
      [out:json][timeout:25];

      (
        nwr["name"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="school"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="college"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="university"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="place_of_worship"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="hospital"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="clinic"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="townhall"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="police"](around:${Number(radius)},${lat},${lon});

        nwr["amenity"="fire_station"](around:${Number(radius)},${lat},${lon});

        nwr["office"="government"](around:${Number(radius)},${lat},${lon});

        nwr["highway"](around:${Number(radius)},${lat},${lon});

        nwr["place"="village"](around:${Number(radius)},${lat},${lon});

        nwr["place"="hamlet"](around:${Number(radius)},${lat},${lon});

        nwr["place"="town"](around:${Number(radius)},${lat},${lon});

        nwr["place"="city"](around:${Number(radius)},${lat},${lon});
      );

      out center tags;
    `;


    // =======================================================
    // Overpass servers
    //
    // First server
    // Second server = fallback
    // =======================================================

    const endpoints = [

      "https://overpass-api.de/api/interpreter",

      "https://overpass.kumi.systems/api/interpreter",

    ];


    let result = null;


    for (
      const endpoint of endpoints
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
                `data=${encodeURIComponent(query)}`,

            }
          );


        if (
          !response.ok
        ) {

          continue;

        }


        result =
          await response.json();


        break;

      } catch (error) {

        console.warn(
          "Overpass server failed:",
          endpoint,
          error
        );

      }

    }


    // =======================================================
    // No result
    //
    // GPS must remain valid even if nearby search fails.
    // =======================================================

    if (
      !result ||
      !Array.isArray(
        result.elements
      )
    ) {

      return [];

    }


    // =======================================================
    // Convert OSM objects
    // =======================================================

    const places =
      result.elements
        .map(
          (item) => {

            const tags =
              item.tags || {};


            // -------------------------------------------------
            // Coordinates
            // -------------------------------------------------

            let itemLatitude =
              item.lat;

            let itemLongitude =
              item.lon;


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


            if (
              !Number.isFinite(
                Number(itemLatitude)
              ) ||
              !Number.isFinite(
                Number(itemLongitude)
              )
            ) {

              return null;

            }


            // -------------------------------------------------
            // Name
            //
            // Prefer language-specific name.
            // -------------------------------------------------

            const localizedName =

              language === "ar"

                ? (
                    tags["name:ar"] ||
                    tags.name ||
                    ""
                  )

                : language === "tr"

                ? (
                    tags["name:tr"] ||
                    tags.name ||
                    ""
                  )

                : (
                    tags["name:en"] ||
                    tags.name ||
                    ""
                  );


            // -------------------------------------------------
            // Type
            // -------------------------------------------------

            let category =
              "place";


            let label =
              "مكان";


            if (
              tags.amenity ===
              "place_of_worship"
            ) {

              category =
                "worship";

              label =
                "مكان عبادة";

            } else if (
              tags.amenity ===
              "school"
            ) {

              category =
                "school";

              label =
                "مدرسة";

            } else if (
              tags.amenity ===
              "college"
            ) {

              category =
                "college";

              label =
                "كلية";

            } else if (
              tags.amenity ===
              "university"
            ) {

              category =
                "university";

              label =
                "جامعة";

            } else if (
              tags.amenity ===
              "hospital"
            ) {

              category =
                "hospital";

              label =
                "مشفى";

            } else if (
              tags.amenity ===
              "clinic"
            ) {

              category =
                "clinic";

              label =
                "عيادة";

            } else if (
              tags.amenity ===
              "police"
            ) {

              category =
                "police";

              label =
                "شرطة";

            } else if (
              tags.amenity ===
              "townhall"
            ) {

              category =
                "government";

              label =
                "مركز حكومي";

            } else if (
              tags.office ===
              "government"
            ) {

              category =
                "government";

              label =
                "جهة حكومية";

            } else if (
              tags.highway
            ) {

              category =
                "road";

              label =
                "طريق";

            } else if (
              tags.place ===
              "village"
            ) {

              category =
                "village";

              label =
                "قرية";

            } else if (
              tags.place ===
              "hamlet"
            ) {

              category =
                "hamlet";

              label =
                "تجمع سكني";

            } else if (
              tags.place ===
              "town"
            ) {

              category =
                "town";

              label =
                "بلدة";

            } else if (
              tags.place ===
              "city"
            ) {

              category =
                "city";

              label =
                "مدينة";

            }


            // -------------------------------------------------
            // Return normalized object
            // -------------------------------------------------

            return {

              id:
                `${item.type}-${item.id}`,

              osmType:
                item.type,

              osmId:
                item.id,


              name:
                localizedName,


              category,

              label,


              latitude:
                Number(itemLatitude),

              longitude:
                Number(itemLongitude),


              highway:
                tags.highway ||
                "",


              amenity:
                tags.amenity ||
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
        )
        .filter(
          Boolean
        )
        .filter(
          (item) =>
            item.name
        );


    // =======================================================
    // Remove duplicates
    // =======================================================

    const unique =
      Array.from(
        new Map(

          places.map(
            (item) => [

              `${item.name}|${item.latitude}|${item.longitude}`,

              item,

            ]
          )

        ).values()
      );


    // =======================================================
    // Calculate distance
    //
    // Sort nearest objects first.
    // =======================================================

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


    withDistance.sort(
      (a, b) =>
        a.distance -
        b.distance
    );


    // =======================================================
    // Limit results
    //
    // Prevent thousands of labels.
    // =======================================================

    return withDistance.slice(
      0,
      80
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

    const earthRadius =
      6371000;


    const toRadians =
      (value) =>
        value *
        Math.PI /
        180;


    const dLatitude =
      toRadians(
        latitude2 -
        latitude1
      );


    const dLongitude =
      toRadians(
        longitude2 -
        longitude1
      );


    const a =

      Math.sin(
        dLatitude / 2
      ) ** 2

      +

      Math.cos(
        toRadians(latitude1)
      )

      *

      Math.cos(
        toRadians(latitude2)
      )

      *

      Math.sin(
        dLongitude / 2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
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

  async getLocationById(id) {

    if (!id) {

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
      longitude,
    } =
      this.validateCoordinates(
        data.latitude,
        data.longitude
      );


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


      accuracy:

        data.accuracy !==
          undefined &&

        data.accuracy !==
          null

          ? Number(
              data.accuracy
            )

          : null,

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
      ...data,
    };


    if (
      updateData.latitude !==
        undefined ||

      updateData.longitude !==
        undefined
    ) {

      if (
        updateData.latitude ===
          undefined ||

        updateData.longitude ===
          undefined
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
