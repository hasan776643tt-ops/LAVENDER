// src/services/mapService.js

import mapRepository
  from "../repositories/mapRepository.js";


// =========================================================
// LAVENDER — MAP SERVICE
// =========================================================
//
// المسؤول عن:
// - التحقق من الإحداثيات
// - حساب المساحة
// - حساب المحيط
// - Reverse Geocoding
// - الأماكن القريبة
// - إنشاء / تعديل / حذف Location
//
// لا يحتوي على:
// - React
// - JSX
// - MapModel
// - localStorage مباشر
//
// =========================================================


const EARTH_RADIUS = 6378137;

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org";


function toNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


// =========================================================
// VALIDATE COORDINATES
// =========================================================

function validateCoordinates(
  latitude,
  longitude
) {

  const lat =
    toNumber(latitude);

  const lng =
    toNumber(longitude);

  if (
    lat === null ||
    lng === null
  ) {
    throw new Error(
      "INVALID_COORDINATES"
    );
  }

  if (
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    throw new Error(
      "INVALID_COORDINATES"
    );
  }

  return true;
}


// =========================================================
// NORMALIZE POINT
// =========================================================

function normalizePoint(point) {

  if (Array.isArray(point)) {

    const latitude =
      toNumber(point[0]);

    const longitude =
      toNumber(point[1]);

    if (
      latitude === null ||
      longitude === null
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }


  if (
    point &&
    typeof point === "object"
  ) {

    const latitude =
      toNumber(
        point.latitude
      );

    const longitude =
      toNumber(
        point.longitude
      );

    if (
      latitude === null ||
      longitude === null
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }


  return null;
}


// =========================================================
// NORMALIZE POINTS
// =========================================================

function normalizePoints(
  points
) {

  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(normalizePoint)
    .filter(Boolean);
}


// =========================================================
// CENTER
// =========================================================

function calculateCenter(
  points
) {

  const safe =
    normalizePoints(points);

  if (!safe.length) {
    return null;
  }

  const latitude =
    safe.reduce(
      (sum, point) =>
        sum + point.latitude,
      0
    ) / safe.length;

  const longitude =
    safe.reduce(
      (sum, point) =>
        sum + point.longitude,
      0
    ) / safe.length;

  validateCoordinates(
    latitude,
    longitude
  );

  return {
    latitude,
    longitude,
  };
}


// =========================================================
// HAVERSINE
// =========================================================

function distance(
  pointA,
  pointB
) {

  const lat1 =
    pointA.latitude *
    Math.PI /
    180;

  const lat2 =
    pointB.latitude *
    Math.PI /
    180;

  const dLat =
    (pointB.latitude -
      pointA.latitude) *
    Math.PI /
    180;

  const dLng =
    (pointB.longitude -
      pointA.longitude) *
    Math.PI /
    180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(dLng / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}


// =========================================================
// PERIMETER
// =========================================================

function calculatePerimeter(
  points
) {

  const safe =
    normalizePoints(points);

  if (safe.length < 2) {
    return 0;
  }

  let total = 0;

  for (
    let index = 0;
    index < safe.length;
    index++
  ) {

    const current =
      safe[index];

    const next =
      safe[
        (index + 1) %
        safe.length
      ];

    total +=
      distance(
        current,
        next
      );
  }

  return total;
}


// =========================================================
// AREA
// =========================================================

function calculateArea(
  points
) {

  const safe =
    normalizePoints(points);

  if (safe.length < 3) {
    return 0;
  }

  const center =
    calculateCenter(safe);

  if (!center) {
    return 0;
  }

  const coordinates =
    safe.map(point => {

      const x =
        (
          point.longitude -
          center.longitude
        ) *
        Math.PI /
        180 *
        EARTH_RADIUS *
        Math.cos(
          center.latitude *
          Math.PI /
          180
        );

      const y =
        (
          point.latitude -
          center.latitude
        ) *
        Math.PI /
        180 *
        EARTH_RADIUS;

      return {
        x,
        y,
      };
    });


  let area = 0;

  for (
    let index = 0;
    index < coordinates.length;
    index++
  ) {

    const current =
      coordinates[index];

    const next =
      coordinates[
        (index + 1) %
        coordinates.length
      ];

    area +=
      current.x * next.y -
      next.x * current.y;
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

  validateCoordinates(
    latitude,
    longitude
  );

  const params =
    new URLSearchParams({

      format:
        "json",

      lat:
        String(latitude),

      lon:
        String(longitude),

      zoom:
        "18",

      addressdetails:
        "1",

      "accept-language":
        language,

    });


  const response =
    await fetch(
      `${NOMINATIM_URL}/reverse?${params.toString()}`,
      {
        headers: {
          Accept:
            "application/json",
        },
      }
    );


  if (!response.ok) {
    throw new Error(
      "GEOCODING_FAILED"
    );
  }


  const data =
    await response.json();


  return {

    latitude:
      toNumber(
        data?.lat
      ),

    longitude:
      toNumber(
        data?.lon
      ),

    displayName:
      data?.display_name ||
      "",

    address:
      data?.address ||
      {},

    country:
      data?.address?.country ||
      "",

    state:
      data?.address?.state ||
      "",

    province:
      data?.address?.province ||
      "",

    region:
      data?.address?.region ||
      "",

    district:
      data?.address?.county ||
      data?.address?.district ||
      "",

    city:
      data?.address?.city ||
      "",

    town:
      data?.address?.town ||
      "",

    village:
      data?.address?.village ||
      data?.address?.hamlet ||
      "",

    road:
      data?.address?.road ||
      "",

    placeName:
      data?.name ||
      data?.address?.road ||
      "",

  };
}


// =========================================================
// NEARBY PLACES
// =========================================================

async function getNearbyPlaces(
  latitude,
  longitude,
  radius = 1000,
  language = "ar"
) {

  validateCoordinates(
    latitude,
    longitude
  );

  const query = `
    [out:json];
    (
      node
        (around:${Number(radius)},${Number(latitude)},${Number(longitude)})
        ["place"];

      node
        (around:${Number(radius)},${Number(latitude)},${Number(longitude)})
        ["amenity"];

      node
        (around:${Number(radius)},${Number(latitude)},${Number(longitude)})
        ["shop"];
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
            "application/x-www-form-urlencoded",
        },
        body:
          `data=${encodeURIComponent(
            query
          )}`,
      }
    );


  if (!response.ok) {
    return [];
  }


  const data =
    await response.json();


  return Array.isArray(
    data?.elements
  )
    ? data.elements.map(
        item => ({

          id:
            item.id,

          latitude:
            item.lat ??
            item.center?.lat,

          longitude:
            item.lon ??
            item.center?.lon,

          name:
            item.tags?.name ||
            "",

          type:
            item.tags?.place ||
            item.tags?.amenity ||
            item.tags?.shop ||
            "",

          language,

        })
      )
    : [];
}


// =========================================================
// CRUD
// =========================================================

async function getAllLocations() {

  return mapRepository.getAll();
}


async function getLocationById(
  id
) {

  return mapRepository.getById(
    id
  );
}


async function getLocationsByFarmId(
  farmId
) {

  return mapRepository.getByFarmId(
    farmId
  );
}


async function getLocationByFarmId(
  farmId
) {

  return mapRepository.getLatestByFarmId(
    farmId
  );
}


async function createLocation(
  data
) {

  if (!data?.farmId) {
    throw new Error(
      "MAP_FARM_REQUIRED"
    );
  }

  return mapRepository.create(
    data
  );
}


async function updateLocation(
  id,
  data
) {

  return mapRepository.update(
    id,
    data
  );
}


async function deleteLocation(
  id
) {

  return mapRepository.delete(
    id
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

  getNearbyPlaces,

  calculateCenter,

  calculateArea,

  calculatePerimeter,

  validateCoordinates,

};


export default Object.freeze(
  mapService
);
