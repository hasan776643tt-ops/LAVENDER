// src/utils/geoUtils.js

const EARTH_RADIUS_M = 6371008.8;
const EARTH_RADIUS_KM = EARTH_RADIUS_M / 1000;

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

const isFiniteNumber = (value) =>
  Number.isFinite(Number(value));

const toRadians = (degrees) =>
  Number(degrees) * Math.PI / 180;

const toDegrees = (radians) =>
  Number(radians) * 180 / Math.PI;


/**
 * التحقق من صحة الإحداثيات.
 */
export function validateCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= MIN_LATITUDE &&
    lat <= MAX_LATITUDE &&
    lon >= MIN_LONGITUDE &&
    lon <= MAX_LONGITUDE
  );
}


/**
 * حساب المسافة بين نقطتين بالمتر.
 */
export function calculateDistanceMeters(
  lat1,
  lon1,
  lat2,
  lon2
) {
  if (
    !validateCoordinates(lat1, lon1) ||
    !validateCoordinates(lat2, lon2)
  ) {
    return 0;
  }

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const deltaPhi = toRadians(
    Number(lat2) - Number(lat1)
  );

  const deltaLambda = toRadians(
    Number(lon2) - Number(lon1)
  );

  const sinLat = Math.sin(deltaPhi / 2);
  const sinLon = Math.sin(deltaLambda / 2);

  const a =
    sinLat * sinLat +
    Math.cos(phi1) *
      Math.cos(phi2) *
      sinLon * sinLon;

  const safeA = Math.min(
    1,
    Math.max(0, a)
  );

  return (
    EARTH_RADIUS_M *
    2 *
    Math.atan2(
      Math.sqrt(safeA),
      Math.sqrt(1 - safeA)
    )
  );
}


/**
 * حساب المسافة بالكيلومتر.
 * للتوافق مع الأكواد القديمة.
 */
export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  return (
    calculateDistanceMeters(
      lat1,
      lon1,
      lat2,
      lon2
    ) / 1000
  );
}


/**
 * تطبيع نقطة [latitude, longitude].
 */
export function normalizePoint(point) {
  if (
    !Array.isArray(point) ||
    point.length < 2
  ) {
    return null;
  }

  const latitude = Number(point[0]);
  const longitude = Number(point[1]);

  if (
    !validateCoordinates(
      latitude,
      longitude
    )
  ) {
    return null;
  }

  return [
    latitude,
    longitude,
  ];
}


/**
 * تطبيع مجموعة نقاط.
 */
export function normalizePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(normalizePoint)
    .filter(Boolean);
}


/**
 * تحويل نقطة إلى كائن.
 */
export function createLocationObject(
  latitude,
  longitude,
  accuracy = null
) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const numericAccuracy = Number(accuracy);

  if (
    !validateCoordinates(
      lat,
      lon
    )
  ) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lon,
    accuracy:
      Number.isFinite(numericAccuracy)
        ? Math.max(0, numericAccuracy)
        : null,
    timestamp: Date.now(),
  };
}


/**
 * إنشاء نقطة حدود.
 */
export function createBoundaryPoint(
  latitude,
  longitude
) {
  const location =
    createLocationObject(
      latitude,
      longitude
    );

  if (!location) {
    return null;
  }

  return {
    latitude:
      location.latitude,
    longitude:
      location.longitude,
  };
}


/**
 * تحويل نقاط Leaflet إلى كائنات.
 */
export function pointsToObjects(points) {
  return normalizePoints(points).map(
    ([latitude, longitude]) => ({
      latitude,
      longitude,
    })
  );
}


/**
 * تحويل الكائنات إلى نقاط Leaflet.
 */
export function objectsToPoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map((point) => {
      if (!point) {
        return null;
      }

      return normalizePoint([
        point.latitude,
        point.longitude,
      ]);
    })
    .filter(Boolean);
}


/**
 * حساب محيط الأرض بالمتر.
 */
export function calculatePerimeter(points) {
  const normalized =
    normalizePoints(points);

  if (normalized.length < 2) {
    return 0;
  }

  let perimeter = 0;

  for (
    let i = 0;
    i < normalized.length;
    i += 1
  ) {
    const current =
      normalized[i];

    const next =
      normalized[
        (i + 1) %
          normalized.length
      ];

    perimeter +=
      calculateDistanceMeters(
        current[0],
        current[1],
        next[0],
        next[1]
      );
  }

  return perimeter;
}


/**
 * حساب مساحة الأرض بالمتر المربع.
 */
export function calculateArea(points) {
  const normalized =
    normalizePoints(points);

  if (normalized.length < 3) {
    return 0;
  }

  const meanLatitude =
    normalized.reduce(
      (sum, point) =>
        sum + point[0],
      0
    ) / normalized.length;

  const meanLatitudeRadians =
    toRadians(meanLatitude);

  const coordinates =
    normalized.map(
      ([latitude, longitude]) => [
        EARTH_RADIUS_M *
          toRadians(longitude) *
          Math.cos(
            meanLatitudeRadians
          ),

        EARTH_RADIUS_M *
          toRadians(latitude),
      ]
    );

  let area = 0;

  for (
    let i = 0;
    i < coordinates.length;
    i += 1
  ) {
    const current =
      coordinates[i];

    const next =
      coordinates[
        (i + 1) %
          coordinates.length
      ];

    area +=
      current[0] * next[1] -
      next[0] * current[1];
  }

  return Math.abs(area / 2);
}


/**
 * إنشاء Bounding Box حول نقطة.
 */
export function getBoundingBox(
  latitude,
  longitude,
  radiusKm = 1
) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const radius = Number(radiusKm);

  if (
    !validateCoordinates(lat, lon) ||
    !Number.isFinite(radius) ||
    radius < 0
  ) {
    return null;
  }

  const latDelta =
    radius / 111.32;

  const cosLatitude =
    Math.cos(toRadians(lat));

  const lonDelta =
    cosLatitude === 0
      ? 180
      : radius /
        (111.32 *
          Math.abs(cosLatitude));

  return {
    north: Math.min(
      MAX_LATITUDE,
      lat + latDelta
    ),

    south: Math.max(
      MIN_LATITUDE,
      lat - latDelta
    ),

    east: Math.min(
      MAX_LONGITUDE,
      lon + lonDelta
    ),

    west: Math.max(
      MIN_LONGITUDE,
      lon - lonDelta
    ),
  };
}


/**
 * تحديد مركز مجموعة نقاط.
 */
export function getCenter(points) {
  const normalized =
    normalizePoints(points);

  if (!normalized.length) {
    return null;
  }

  const result =
    normalized.reduce(
      (center, [lat, lon]) => ({
        latitude:
          center.latitude + lat,

        longitude:
          center.longitude + lon,
      }),
      {
        latitude: 0,
        longitude: 0,
      }
    );

  return [
    result.latitude /
      normalized.length,

    result.longitude /
      normalized.length,
  ];
}


/**
 * اسم بديل للتوافق مع Map.jsx.
 *
 * Map.jsx يستخدم calculateCenter
 * بينما بعض الأكواد تستخدم getCenter.
 */
export function calculateCenter(points) {
  return getCenter(points);
}


/**
 * فحص دقة GPS.
 */
export function classifyAccuracy(
  accuracy
) {
  const value = Number(accuracy);

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return "unknown";
  }

  if (value <= 10) {
    return "excellent";
  }

  if (value <= 30) {
    return "very-good";
  }

  if (value <= 50) {
    return "good";
  }

  if (value <= 100) {
    return "acceptable";
  }

  return "poor";
}


/**
 * هل دقة GPS جيدة؟
 */
export function isGoodAccuracy(
  accuracy,
  maximum = 50
) {
  const value = Number(accuracy);
  const max = Number(maximum);

  return (
    Number.isFinite(value) &&
    value >= 0 &&
    Number.isFinite(max) &&
    value <= max
  );
}


/**
 * اختيار أفضل قراءة GPS.
 */
export function selectBestPosition(
  positions
) {
  if (!Array.isArray(positions)) {
    return null;
  }

  const valid =
    positions.filter(
      (position) =>
        position &&
        validateCoordinates(
          position.latitude,
          position.longitude
        ) &&
        isFiniteNumber(
          position.accuracy
        )
    );

  if (!valid.length) {
    return null;
  }

  return valid.reduce(
    (best, current) =>
      Number(current.accuracy) <
      Number(best.accuracy)
        ? current
        : best
  );
}


/**
 * تنسيق المسافة.
 */
export function formatDistance(
  meters
) {
  const value = Number(meters);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "0 م";
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(2)} كم`;
  }

  return `${value.toFixed(1)} م`;
}


/**
 * تنسيق المساحة.
 */
export function formatArea(
  squareMeters
) {
  const value =
    Number(squareMeters);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "0 م²";
  }

  if (value >= 10000) {
    return `${(
      value / 10000
    ).toFixed(2)} هكتار`;
  }

  return `${value.toFixed(1)} م²`;
}


/**
 * فحص صلاحية المضلع.
 */
export function isValidPolygon(
  points
) {
  return (
    normalizePoints(points)
      .length >= 3
  );
}


/**
 * ملخص هندسي كامل.
 */
export function getGeometrySummary(
  points
) {
  const normalized =
    normalizePoints(points);

  return {
    points: normalized,

    pointCount:
      normalized.length,

    valid:
      normalized.length >= 3,

    area:
      calculateArea(normalized),

    perimeter:
      calculatePerimeter(normalized),

    center:
      calculateCenter(normalized),
  };
}


/**
 * الثوابت.
 */
export {
  EARTH_RADIUS_M,
  EARTH_RADIUS_KM,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
  toRadians,
  toDegrees,
};


/**
 * Default API
 */
export default {
  calculateDistance,
  calculateDistanceMeters,
  calculatePerimeter,
  calculateArea,
  calculateCenter,
  getCenter,

  toRadians,
  toDegrees,

  validateCoordinates,

  normalizePoint,
  normalizePoints,

  createLocationObject,
  createBoundaryPoint,

  pointsToObjects,
  objectsToPoints,

  getBoundingBox,

  classifyAccuracy,
  isGoodAccuracy,
  selectBestPosition,

  formatDistance,
  formatArea,

  isValidPolygon,
  getGeometrySummary,
};
