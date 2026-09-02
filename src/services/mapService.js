// src/services/mapService.js

import mapRepository from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — MAP SERVICE
// =========================================================
//
// المسؤول عن:
// - منطق المواقع
// - الحسابات الجغرافية
// - Reverse Geocoding
// - توحيد بيانات الموقع الإداري
//
// لا يحتوي على React.
// لا يحتوي على UI.
// لا يحتوي على منطق المحاصيل.
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const EARTH_RADIUS =
  6378137;

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org";


// =========================================================
// HELPERS
// =========================================================

function toNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function cleanString(value) {

  return String(
    value ?? ""
  ).trim();
}


function validateCoordinates(
  latitude,
  longitude
) {

  const lat =
    toNumber(latitude);

  const lng =
    toNumber(longitude);

  return (
    lat !== null &&
    lng !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}


function normalizePoint(point) {

  if (Array.isArray(point)) {

    return {

      latitude:
        toNumber(point[0]),

      longitude:
        toNumber(point[1]),

    };
  }

  if (
    point &&
    typeof point === "object"
  ) {

    return {

      latitude:
        toNumber(
          point.latitude ??
          point.lat
        ),

      longitude:
        toNumber(
          point.longitude ??
          point.lng ??
          point.lon
        ),

    };
  }

  return {

    latitude: null,

    longitude: null,

  };
}


function normalizePoints(points) {

  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(normalizePoint)
    .filter(
      point =>
        validateCoordinates(
          point.latitude,
          point.longitude
        )
    );
}


// =========================================================
// ADMINISTRATIVE NORMALIZATION
// =========================================================

function normalizeAdministrativeLocation(
  result = {}
) {

  const address =
    result?.address &&
    typeof result.address === "object"
      ? result.address
      : {};


  const country =
    cleanString(
      result.country ||
      address.country ||
      ""
    );


  const governorate =
    cleanString(
      result.governorate ||
      result.state ||
      result.province ||
      address.state ||
      address.province ||
      ""
    );


  const region =
    cleanString(
      result.region ||
      address.region ||
      ""
    );


  const district =
    cleanString(
      result.district ||
      address.district ||
      address.county ||
      address.municipality ||
      address.city_district ||
      ""
    );


  const city =
    cleanString(
      result.city ||
      address.city ||
      ""
    );


  const town =
    cleanString(
      result.town ||
      address.town ||
      ""
    );


  const village =
    cleanString(
      result.village ||
      address.village ||
      result.hamlet ||
      address.hamlet ||
      ""
    );


  const placeName =
    cleanString(
      result.placeName ||
      result.name ||
      address.road ||
      ""
    );


  const locationDescription =
    cleanString(
      result.locationDescription ||
      result.displayName ||
      ""
    );


  return {

    country,

    governorate,

    region,

    district,

    city,

    town,

    village,

    placeName,

    locationDescription,

  };
}


// =========================================================
// NORMALIZE LOCATION DATA
// =========================================================

function normalizeLocationData(
  data = {}
) {

  const points =
    normalizePoints(
      data.points ??
      data.boundary ??
      []
    );


  const latitude =
    toNumber(
      data.latitude
    );


  const longitude =
    toNumber(
      data.longitude
    );


  return {

    ...data,

    farmId:
      cleanString(
        data.farmId
      ),

    latitude,

    longitude,

    points,

    boundary:
      points,

    area:
      toNumber(
        data.area
      ),

    perimeter:
      toNumber(
        data.perimeter
      ),

    ...normalizeAdministrativeLocation(
      data
    ),

  };
}


// =========================================================
// CENTER
// =========================================================

function calculateCenter(
  points
) {

  const safePoints =
    normalizePoints(points);

  if (
    safePoints.length === 0
  ) {
    return null;
  }


  const latitude =
    safePoints.reduce(
      (sum, point) =>
        sum + point.latitude,
      0
    ) /
    safePoints.length;


  const longitude =
    safePoints.reduce(
      (sum, point) =>
        sum + point.longitude,
      0
    ) /
    safePoints.length;


  if (
    !validateCoordinates(
      latitude,
      longitude
    )
  ) {
    return null;
  }


  return {

    latitude,

    longitude,

  };
}


// =========================================================
// HAVERSINE
// =========================================================

function calculateDistance(
  pointA,
  pointB
) {

  const a =
    normalizePoint(pointA);

  const b =
    normalizePoint(pointB);


  if (
    !validateCoordinates(
      a.latitude,
      a.longitude
    ) ||
    !validateCoordinates(
      b.latitude,
      b.longitude
    )
  ) {

    return 0;
  }


  const lat1 =
    (
      a.latitude *
      Math.PI
    ) /
    180;


  const lat2 =
    (
      b.latitude *
      Math.PI
    ) /
    180;


  const deltaLat =
    (
      b.latitude -
      a.latitude
    ) *
    Math.PI /
    180;


  const deltaLng =
    (
      b.longitude -
      a.longitude
    ) *
    Math.PI /
    180;


  const sinLat =
    Math.sin(
      deltaLat / 2
    );


  const sinLng =
    Math.sin(
      deltaLng / 2
    );


  const h =
    sinLat * sinLat +
    Math.cos(lat1) *
    Math.cos(lat2) *
    sinLng *
    sinLng;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(h),
      Math.sqrt(
        1 - h
      )
    );


  return (
    EARTH_RADIUS *
    c
  );
}


// =========================================================
// PERIMETER
// =========================================================

function calculatePerimeter(
  points
) {

  const safePoints =
    normalizePoints(points);


  if (
    safePoints.length < 2
  ) {
    return 0;
  }


  let perimeter = 0;


  for (
    let index = 0;
    index < safePoints.length;
    index += 1
  ) {

    const current =
      safePoints[index];


    const next =
      safePoints[
        (index + 1) %
        safePoints.length
      ];


    perimeter +=
      calculateDistance(
        current,
        next
      );
  }


  return perimeter;
}


// =========================================================
// AREA
// =========================================================

function calculateArea(
  points
) {

  const safePoints =
    normalizePoints(points);


  if (
    safePoints.length < 3
  ) {
    return 0;
  }


  const center =
    calculateCenter(
      safePoints
    );


  if (!center) {
    return 0;
  }


  const latFactor =
    Math.PI /
    180;


  const metersPerDegreeLatitude =
    EARTH_RADIUS *
    latFactor;


  const metersPerDegreeLongitude =
    EARTH_RADIUS *
    Math.cos(
      center.latitude *
      latFactor
    ) *
    latFactor;


  const projected =
    safePoints.map(
      point => ({

        x:
          (
            point.longitude -
            center.longitude
          ) *
          metersPerDegreeLongitude,

        y:
          (
            point.latitude -
            center.latitude
          ) *
          metersPerDegreeLatitude,

      })
    );


  let area = 0;


  for (
    let index = 0;
    index < projected.length;
    index += 1
  ) {

    const current =
      projected[index];


    const next =
      projected[
        (index + 1) %
        projected.length
      ];


    area +=
      current.x *
      next.y -
      next.x *
      current.y;
  }


  return Math.abs(
    area / 2
  );
}


// =========================================================
// REVERSE GEOCODING
// =========================================================

async function reverseGeocode(
  latitude,
  longitude,
  language = "ar"
) {

  if (
    !validateCoordinates(
      latitude,
      longitude
    )
  ) {

    throw new Error(
      "INVALID_COORDINATES"
    );
  }


  const url =
    new URL(
      "/reverse",
      NOMINATIM_URL
    );


  url.searchParams.set(
    "format",
    "jsonv2"
  );


  url.searchParams.set(
    "lat",
    String(latitude)
  );


  url.searchParams.set(
    "lon",
    String(longitude)
  );


  url.searchParams.set(
    "zoom",
    "18"
  );


  url.searchParams.set(
    "addressdetails",
    "1"
  );


  url.searchParams.set(
    "accept-language",
    language || "ar"
  );


  const response =
    await fetch(
      url.toString(),
      {
        headers: {

          Accept:
            "application/json",

        },
      }
    );


  if (
    !response.ok
  ) {

    throw new Error(
      `NOMINATIM_${response.status}`
    );
  }


  const data =
    await response.json();


  const administrative =
    normalizeAdministrativeLocation(
      data
    );


  return {

    ...data,

    latitude:
      toNumber(
        data.latitude ??
        latitude
      ),

    longitude:
      toNumber(
        data.longitude ??
        longitude
      ),

    ...administrative,

  };
}


// =========================================================
// GET ALL
// =========================================================

async function getAllLocations() {

  const data =
    await mapRepository.getAll();


  return Array.isArray(data)
    ? data.map(
        normalizeLocationData
      )
    : [];
}


// =========================================================
// GET BY ID
// =========================================================

async function getLocationById(
  id
) {

  const data =
    await mapRepository.getById(
      id
    );


  return data
    ? normalizeLocationData(
        data
      )
    : null;
}


// =========================================================
// GET BY FARM
// =========================================================

async function getLocationsByFarmId(
  farmId
) {

  if (!farmId) {
    return [];
  }


  const data =
    await mapRepository.getByFarmId(
      farmId
    );


  return Array.isArray(data)
    ? data.map(
        normalizeLocationData
      )
    : [];
}


// =========================================================
// GET LATEST BY FARM
// =========================================================

async function getLocationByFarmId(
  farmId
) {

  if (!farmId) {
    return null;
  }


  const data =
    await mapRepository.getLatestByFarmId(
      farmId
    );


  return data
    ? normalizeLocationData(
        data
      )
    : null;
}


// =========================================================
// CREATE
// =========================================================

async function createLocation(
  data
) {

  const normalized =
    normalizeLocationData(
      data
    );


  if (
    !normalized.farmId
  ) {

    throw new Error(
      "MAP_FARM_REQUIRED"
    );
  }


  if (
    !validateCoordinates(
      normalized.latitude,
      normalized.longitude
    )
  ) {

    throw new Error(
      "MAP_COORDINATES_REQUIRED"
    );
  }


  const created =
    await mapRepository.create(
      normalized
    );


  return normalizeLocationData(
    created
  );
}


// =========================================================
// UPDATE
// =========================================================

async function updateLocation(
  id,
  data
) {

  const normalized =
    normalizeLocationData(
      data
    );


  const updated =
    await mapRepository.update(
      id,
      normalized
    );


  return updated
    ? normalizeLocationData(
        updated
      )
    : null;
}


// =========================================================
// DELETE
// =========================================================

async function deleteLocation(
  id
) {

  return mapRepository.delete(
    id
  );
}


// =========================================================
// NEARBY
// =========================================================

async function getNearbyPlaces(
  latitude,
  longitude,
  radius = 1000,
  language = "ar"
) {

  if (
    !validateCoordinates(
      latitude,
      longitude
    )
  ) {
    return [];
  }


  const query =
    `
    [out:json];
    (
      node(around:${Number(radius)},${Number(latitude)},${Number(longitude)});
      way(around:${Number(radius)},${Number(latitude)},${Number(longitude)});
    );
    out center tags;
    `;


  const response =
    await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",

        headers: {

          "Content-Type":
            "text/plain",

          Accept:
            "application/json",

          "Accept-Language":
            language || "ar",

        },

        body:
          query,

      }
    );


  if (
    !response.ok
  ) {

    throw new Error(
      `OVERPASS_${response.status}`
    );
  }


  const data =
    await response.json();


  const elements =
    Array.isArray(
      data?.elements
    )
      ? data.elements
      : [];


  return elements.map(
    item => ({

      id:
        item.id,

      type:
        item.type,

      name:
        cleanString(
          item.tags?.name ||
          ""
        ),

      latitude:
        toNumber(
          item.lat ??
          item.center?.lat
        ),

      longitude:
        toNumber(
          item.lon ??
          item.center?.lon
        ),

      tags:
        item.tags || {},

    })
  );
}


// =========================================================
// EXPORT
// =========================================================

const mapService = {

  getAllLocations,

  getLocationById,

  getLocationsByFarmId,

  getLocationByFarmId,

  createLocation,

  updateLocation,

  deleteLocation,

  reverseGeocode,

  calculateCenter,

  calculateDistance,

  calculatePerimeter,

  calculateArea,

  getNearbyPlaces,

};


export default Object.freeze(
  mapService
);
