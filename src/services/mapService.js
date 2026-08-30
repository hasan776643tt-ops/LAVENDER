// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — MAP SERVICE
// =========================================================
//
// المصدر الحقيقي لموقع الأرض:
// نقاط الخريطة التي يحددها المستخدم.
//
// Nominatim:
// يستخدم فقط لاستخراج المعلومات الإدارية والوصفية.
//
// لا يستبدل:
// latitude
// longitude
// boundary
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

  static EARTH_RADIUS = 6378137;

  static NOMINATIM_URL =
    "https://nominatim.openstreetmap.org/reverse";

  static OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];


  // =======================================================
  // COORDINATES
  // =======================================================

  validateCoordinates(latitude, longitude) {

    const lat = Number(latitude);
    const lon = Number(longitude);

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

    const value = Number(radius);

    if (!Number.isFinite(value)) {
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
      this.normalizeLanguage(language);

    if (lang === "en") {
      return "en";
    }

    if (lang === "tr") {
      return "tr,en";
    }

    return "ar,en";
  }


  // =======================================================
  // POINTS
  // =======================================================

  validatePoints(points) {

    if (!Array.isArray(points)) {
      throw new Error(
        "MAP_POINTS_REQUIRED"
      );
    }

    if (points.length < 3) {
      throw new Error(
        "MAP_THREE_POINTS_REQUIRED"
      );
    }

    return points.map(point => {

      if (Array.isArray(point)) {

        const coordinates =
          this.validateCoordinates(
            point[0],
            point[1]
          );

        return {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
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
    });
  }


  // =======================================================
  // CENTER OF FIELD
  // =======================================================
  //
  // نحسب مركز المضلع بدل استخدام أول نقطة.
  //
  // نستخدم إسقاطًا محليًا بسيطًا مناسبًا لحساب مركز
  // الأراضي الزراعية ذات المساحة المحلية.
  //
  // =======================================================

  calculateCentroid(points) {

    const safePoints =
      this.validatePoints(points);

    const referenceLatitude =
      safePoints.reduce(
        (sum, point) =>
          sum +
          Number(point.latitude),
        0
      ) /
      safePoints.length;

    const referenceLatitudeRad =
      referenceLatitude *
      Math.PI /
      180;

    const cosLatitude =
      Math.cos(
        referenceLatitudeRad
      );

    const earthRadius =
      MapService.EARTH_RADIUS;

    const projected =
      safePoints.map(point => {

        const lat =
          Number(point.latitude) *
          Math.PI /
          180;

        const lon =
          Number(point.longitude) *
          Math.PI /
          180;

        return {
          x:
            earthRadius *
            lon *
            cosLatitude,

          y:
            earthRadius *
            lat,
        };
      });


    let crossSum = 0;
    let xSum = 0;
    let ySum = 0;


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

      const cross =
        (
          current.x *
          next.y
        ) -
        (
          next.x *
          current.y
        );

      crossSum += cross;

      xSum +=
        (
          current.x +
          next.x
        ) *
        cross;

      ySum +=
        (
          current.y +
          next.y
        ) *
        cross;
    }


    // إذا كان المضلع غير صالح حسابيًا،
    // نعود إلى المتوسط الجغرافي الآمن.

    if (
      Math.abs(crossSum) < 0.000001
    ) {

      return this.validateCoordinates(
        referenceLatitude,

        safePoints.reduce(
          (sum, point) =>
            sum +
            Number(point.longitude),
          0
        ) /
        safePoints.length
      );
    }


    const centroidX =
      xSum /
      (
        3 *
        crossSum
      );

    const centroidY =
      ySum /
      (
        3 *
        crossSum
      );


    const latitude =
      centroidY /
      earthRadius *
      180 /
      Math.PI;

    const longitude =
      centroidX /
      (
        earthRadius *
        cosLatitude
      ) *
      180 /
      Math.PI;


    return this.validateCoordinates(
      latitude,
      longitude
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
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

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

  calculatePerimeter(points) {

    const safePoints =
      this.validatePoints(points);

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

  calculateArea(points) {

    const safePoints =
      this.validatePoints(points);

    const earthRadius =
      MapService.EARTH_RADIUS;

    const referenceLatitude =
      safePoints.reduce(
        (total, point) =>
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
      safePoints.map(point => {

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
      });

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
  // ADMINISTRATIVE NORMALIZATION
  // =======================================================

  normalizeAdministrativeAddress(
    address = {}
  ) {

    const country =
      String(
        address.country || ""
      ).trim();

    const governorate =
      String(
        address.governorate ||
        address.state ||
        address.province ||
        address.region ||
        ""
      ).trim();

    const district =
      String(
        address.district ||
        address.county ||
        address.municipality ||
        ""
      ).trim();

    const city =
      String(
        address.city ||
        address.city_district ||
        ""
      ).trim();

    const town =
      String(
        address.town ||
        address.municipality ||
        ""
      ).trim();

    const village =
      String(
        address.village ||
        address.hamlet ||
        ""
      ).trim();

    const hamlet =
      String(
        address.hamlet ||
        ""
      ).trim();


    return {

      country,

      governorate,

      state:
        governorate,

      province:
        governorate,

      region:
        governorate,

      district,

      municipality:
        String(
          address.municipality ||
          ""
        ).trim(),

      city,

      town,

      village,

      hamlet,

      road:
        String(
          address.road ||
          address.pedestrian ||
          ""
        ).trim(),

      postcode:
        String(
          address.postcode ||
          ""
        ).trim(),
    };
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

      const administrative =
        this.normalizeAdministrativeAddress(
          address
        );


      return {

        // الموقع الحقيقي الذي أرسلناه
        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,


        // الإدارة
        ...administrative,


        // الاسم الأقرب
        placeName:
          result?.name ||
          administrative.village ||
          administrative.town ||
          administrative.city ||
          "",


        displayName:
          result?.display_name ||
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


      // مهم:
      // لا نفقد إحداثيات الأرض إذا فشل Nominatim.

      return {

        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        country: "",

        governorate: "",

        state: "",

        province: "",

        region: "",

        district: "",

        municipality: "",

        city: "",

        town: "",

        village: "",

        hamlet: "",

        road: "",

        postcode: "",

        placeName: "",

        displayName: "",

        osmType: null,

        osmId: null,

        address: {},
      };
    }
  }


  // =======================================================
  // CREATE LOCATION
  // =======================================================

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


      // ---------------------------------------------------
      // مركز الأرض الحقيقي
      // ---------------------------------------------------

      const center =
        this.calculateCentroid(
          points
        );


      // ---------------------------------------------------
      // المساحة والمحيط
      // ---------------------------------------------------

      const area =
        this.calculateArea(
          points
        );

      const perimeter =
        this.calculatePerimeter(
          points
        );


      // ---------------------------------------------------
      // Reverse Geocoding
      //
      // نستخدم مركز الأرض وليس أول نقطة.
      // ---------------------------------------------------

      let geocoded = null;

      try {

        geocoded =
          await this.reverseGeocode(
            center.latitude,
            center.longitude,
            data.language || "ar"
          );

      } catch {
        geocoded = null;
      }


      const safeGeocode =
        geocoded || {

          latitude:
            center.latitude,

          longitude:
            center.longitude,

          country: "",
          governorate: "",
          state: "",
          province: "",
          region: "",
          district: "",
          municipality: "",
          city: "",
          town: "",
          village: "",
          hamlet: "",
          road: "",
          placeName: "",
          displayName: "",
        };


      // ---------------------------------------------------
      // البيانات الإدارية
      // ---------------------------------------------------

      const country =
        String(
          data.country ||
          safeGeocode.country ||
          ""
        ).trim();

      const governorate =
        String(
          data.governorate ||
          safeGeocode.governorate ||
          safeGeocode.state ||
          safeGeocode.province ||
          safeGeocode.region ||
          ""
        ).trim();

      const district =
        String(
          data.district ||
          safeGeocode.district ||
          ""
        ).trim();

      const city =
        String(
          data.city ||
          safeGeocode.city ||
          ""
        ).trim();

      const town =
        String(
          data.town ||
          safeGeocode.town ||
          ""
        ).trim();

      const village =
        String(
          data.village ||
          safeGeocode.village ||
          ""
        ).trim();


      const placeName =
        String(
          data.placeName ||
          safeGeocode.placeName ||
          village ||
          town ||
          city ||
          ""
        ).trim();


      // ---------------------------------------------------
      // LocationData واحد
      // ---------------------------------------------------

      const location = {

        ...data,

        id: undefined,

        farmId:
          String(
            data.farmId
          ),

        farmName:
          String(
            data.farmName ||
            ""
          ).trim(),

        source:
          "map",

        type:
          data.type ||
          "field",

        status:
          data.status ||
          "active",


        // الحدود الأصلية
        points,


        // مركز الأرض
        latitude:
          center.latitude,

        longitude:
          center.longitude,


        // القياسات
        area,

        perimeter,

        boundaryWidth:
          data.boundaryWidth ??
          "",


        // الإدارة
        country,

        governorate,

        state:
          governorate,

        province:
          governorate,

        region:
          governorate,

        district,

        municipality:
          String(
            data.municipality ||
            safeGeocode.municipality ||
            ""
          ).trim(),

        city,

        town,

        village,

        hamlet:
          String(
            data.hamlet ||
            safeGeocode.hamlet ||
            ""
          ).trim(),


        placeName,

        road:
          String(
            data.road ||
            safeGeocode.road ||
            ""
          ).trim(),


        locationDescription:
          String(
            data.locationDescription ||
            safeGeocode.displayName ||
            ""
          ).trim(),


        northNeighbor:
          String(
            data.northNeighbor ||
            data.north ||
            ""
          ).trim(),

        southNeighbor:
          String(
            data.southNeighbor ||
            data.south ||
            ""
          ).trim(),

        eastNeighbor:
          String(
            data.eastNeighbor ||
            data.east ||
            ""
          ).trim(),

        westNeighbor:
          String(
            data.westNeighbor ||
            data.west ||
            ""
          ).trim(),


        notes:
          String(
            data.notes ||
            ""
          ).trim(),


        // وقت الإنشاء
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
    // TEXT MODE — يبقى لدعم Map الحالي
    // =====================================================

    const country =
      String(
        data.country || ""
      ).trim();

    const region =
      String(
        data.region ||
        data.province ||
        ""
      ).trim();

    const city =
      String(
        data.city || ""
      ).trim();

    const town =
      String(
        data.town ||
        data.village ||
        ""
      ).trim();

    const village =
      String(
        data.village ||
        data.town ||
        ""
      ).trim();

    const locationDescription =
      String(
        data.locationDescription || ""
      ).trim();

    const northNeighbor =
      String(
        data.northNeighbor ||
        data.north ||
        ""
      ).trim();

    const southNeighbor =
      String(
        data.southNeighbor ||
        data.south ||
        ""
      ).trim();

    const eastNeighbor =
      String(
        data.eastNeighbor ||
        data.east ||
        ""
      ).trim();

    const westNeighbor =
      String(
        data.westNeighbor ||
        data.west ||
        ""
      ).trim();


    if (
      !country &&
      !region &&
      !city &&
      !town &&
      !village &&
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
        String(
          data.farmId
        ),

      source:
        "text",

      points: [],

      latitude: null,

      longitude: null,

      area: null,

      perimeter: null,

      country,

      governorate:
        String(
          data.governorate ||
          region
        ).trim(),

      state:
        String(
          data.governorate ||
          region
        ).trim(),

      province:
        String(
          data.governorate ||
          region
        ).trim(),

      region,

      district:
        String(
          data.district ||
          ""
        ).trim(),

      city,

      town,

      village,

      placeName:
        String(
          data.placeName ||
          village ||
          town ||
          city
        ).trim(),

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

  async updateLocation(id, data) {

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

      const center =
        this.calculateCentroid(
          points
        );

      updateData.points =
        points;

      updateData.latitude =
        center.latitude;

      updateData.longitude =
        center.longitude;

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
      "governorate",
      "state",
      "province",
      "region",
      "district",
      "municipality",
      "city",
      "town",
      "village",
      "hamlet",
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

  async deleteLocation(id) {

    if (!id) {
      throw new Error(
        "MAP_ID_REQUIRED"
      );
    }

    return mapRepository.delete(id);
  }


  // =======================================================
  // GET
  // =======================================================

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


  async getLocationsByFarmId(farmId) {
    return mapRepository.getByFarmId(
      farmId
    );
  }


  // =======================================================
  // EXISTS
  // =======================================================

  async locationExists(id) {
    return mapRepository.exists(id);
  }


  // =======================================================
  // COUNT
  // =======================================================

  async countLocations() {
    return mapRepository.count();
  }


  // =======================================================
  // NEARBY PLACES
  // =======================================================
  //
  // نحافظ على الوظيفة الموجودة في مشروعك.
  //
  // =======================================================

  async getNearbyPlaces(
    latitude,
    longitude,
    radius = MapService.DEFAULT_RADIUS,
    language = "ar"
  ) {

    const coordinates =
      this.validateCoordinates(
        latitude,
        longitude
      );

    const safeRadius =
      this.validateRadius(
        radius
      );

    const query = `
      [out:json][timeout:20];
      (
        node(
          around:${safeRadius},
          ${coordinates.latitude},
          ${coordinates.longitude}
        )["place"];

        way(
          around:${safeRadius},
          ${coordinates.latitude},
          ${coordinates.longitude}
        )["place"];
      );
      out center tags ${MapService.MAX_RESULTS};
    `;


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
                `data=${encodeURIComponent(
                  query
                )}`,
            }
          );


        if (!response.ok) {
          continue;
        }


        const result =
          await response.json();


        const elements =
          Array.isArray(
            result?.elements
          )
            ? result.elements
            : [];


        return elements.map(
          element => {

            const tags =
              element?.tags || {};

            const center =
              element?.center || element;


            return {

              id:
                element?.id ??
                null,

              type:
                element?.type ||
                null,

              name:
                tags.name ||
                tags[
                  `name:${this.normalizeLanguage(
                    language
                  )}`
                ] ||
                "",

              latitude:
                Number(
                  center?.lat
                ),

              longitude:
                Number(
                  center?.lon
                ),

              place:
                tags.place ||
                "",

              distance:
                this.calculateDistance(
                  coordinates.latitude,
                  coordinates.longitude,
                  Number(center?.lat),
                  Number(center?.lon)
                ),
            };
          }
        );

      } catch (error) {

        console.warn(
          "Overpass endpoint failed:",
          endpoint,
          error
        );
      }
    }


    return [];
  }
}


const mapService =
  new MapService();


export default Object.freeze(
  mapService
);
