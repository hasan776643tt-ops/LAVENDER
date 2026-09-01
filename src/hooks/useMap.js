// src/hooks/useMap.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import mapService from "../services/mapService.js";
import farmService from "../services/farmService.js";
import { translate } from "../utils/translation";
import { useSettings } from "../context/SettingsContext";


/*
===========================================================
LAVENDER — useMap
===========================================================

المسؤولية:

إدارة موقع المزرعة على الخريطة.

المصدر الحقيقي للموقع:

latitude
longitude
points
boundary

الموقع النصي الناتج من Reverse Geocoding:
معلومات وصفية فقط.

المسار:

Map.jsx
   ↓
useMap.js
   ↓
mapService.js
   ↓
mapRepository.js
   ↓
storageService


لا يوجد هنا:

- CropModel
- MapModel
- منطق المحاصيل
- توصيات البذور
- منطق المناخ
===========================================================
*/


// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];


const EMPTY_FIELD = Object.freeze({

  farmId: "",

  latitude: "",
  longitude: "",

  points: [],
  boundary: [],

  area: null,
  perimeter: null,

  country: "",
  governorate: "",
  region: "",
  district: "",
  city: "",
  town: "",
  village: "",

  placeName: "",
  locationDescription: "",

  source: "map",
  status: "active",

});


const LOCATION_STORAGE_KEY =
  "mapLocation";


// =========================================================
// HELPERS
// =========================================================

function cleanString(value) {

  return String(
    value ?? ""
  ).trim();

}


function isValidCoordinate(
  latitude,
  longitude
) {

  const lat =
    Number(latitude);

  const lng =
    Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
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
        Number(point[0]),

      longitude:
        Number(point[1]),

    };
  }

  return {

    latitude:
      Number(point?.latitude),

    longitude:
      Number(point?.longitude),

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
        isValidCoordinate(
          point.latitude,
          point.longitude
        )
    );
}


function calculateBoundaryCenter(
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
      (total, point) =>
        total + point.latitude,
      0
    ) /
    safePoints.length;

  const longitude =
    safePoints.reduce(
      (total, point) =>
        total + point.longitude,
      0
    ) /
    safePoints.length;

  if (
    !isValidCoordinate(
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
// ADMINISTRATIVE DATA
// =========================================================

function normalizeAdministrativeLocation(
  result
) {

  if (
    !result ||
    typeof result !== "object"
  ) {

    return {

      country: "",
      governorate: "",
      region: "",
      district: "",
      city: "",
      town: "",
      village: "",
      placeName: "",
      locationDescription: "",

    };
  }

  const address =
    result.address &&
    typeof result.address === "object"
      ? result.address
      : {};

  const governorate =
    cleanString(
      result.governorate ||
      result.state ||
      address.state ||
      address.province ||
      ""
    );

  const region =
    cleanString(
      result.region ||
      address.region ||
      address.province ||
      ""
    );

  const district =
    cleanString(
      result.district ||
      address.district ||
      address.county ||
      address.municipality ||
      address.city_district ||
      address.suburb ||
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
      address.hamlet ||
      ""
    );

  return {

    country:
      cleanString(
        result.country ||
        address.country
      ),

    governorate,

    region,

    district,

    city,

    town,

    village,

    placeName:
      cleanString(
        result.placeName ||
        result.name ||
        address.road
      ),

    locationDescription:
      cleanString(
        result.displayName
      ),

  };
}


// =========================================================
// CACHE
// =========================================================

function cacheLocation(
  location
) {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    !location ||
    typeof location !== "object"
  ) {
    return;
  }

  try {

    window.localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(location)
    );

  } catch (error) {

    console.warn(
      "Map location cache failed:",
      error
    );
  }
}


function readSavedMapLocation() {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {

    const raw =
      window.localStorage.getItem(
        LOCATION_STORAGE_KEY
      );

    if (!raw) {
      return null;
    }

    const location =
      JSON.parse(raw);

    if (
      !location ||
      !isValidCoordinate(
        location.latitude,
        location.longitude
      )
    ) {
      return null;
    }

    return location;

  } catch {

    return null;
  }
}


// =========================================================
// HOOK
// =========================================================

export default function useMap() {

  const {
    settings,
  } = useSettings();

  const language =
    settings?.language || "ar";


  const t =
    useCallback(
      key =>
        translate(
          `map.${key}`,
          language
        ),
      [language]
    );


  // =======================================================
  // DATA
  // =======================================================

  const [
    farms,
    setFarms,
  ] = useState([]);


  const [
    locations,
    setLocations,
  ] = useState([]);


  const [
    nearbyPlaces,
    setNearbyPlaces,
  ] = useState([]);


  // =======================================================
  // CURRENT FARM
  // =======================================================

  const [
    farmId,
    setFarmId,
  ] = useState("");


  // =======================================================
  // LOCATION
  // =======================================================

  const [
    latitude,
    setLatitude,
  ] = useState("");


  const [
    longitude,
    setLongitude,
  ] = useState("");


  const [
    points,
    setPoints,
  ] = useState([]);


  const [
    area,
    setArea,
  ] = useState(null);


  const [
    perimeter,
    setPerimeter,
  ] = useState(null);


  // =======================================================
  // ADMINISTRATIVE DATA
  // =======================================================

  const [
    administrative,
    setAdministrative,
  ] = useState(
    () => ({
      ...EMPTY_FIELD,
    })
  );


  // =======================================================
  // STATE
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    mapLoading,
    setMapLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =======================================================
  // LOAD
  // =======================================================

  useEffect(() => {

    let active = true;

    async function load() {

      try {

        setLoading(true);
        setError("");

        const [
          farmsData,
          locationsData,
        ] = await Promise.all([

          farmService.getAllFarms(),

          mapService.getAllLocations(),

        ]);

        if (!active) {
          return;
        }

        setFarms(
          Array.isArray(farmsData)
            ? farmsData
            : []
        );

        setLocations(
          Array.isArray(locationsData)
            ? locationsData
            : []
        );

      } catch (loadError) {

        console.error(
          "Map loading failed:",
          loadError
        );

        if (active) {

          setFarms([]);
          setLocations([]);

          setError(
            t("loadError") ||
            "تعذر تحميل بيانات الخريطة"
          );
        }

      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };

  }, [t]);


  // =======================================================
  // LOAD FARM LOCATION
  // =======================================================

  const loadFarmLocation =
    useCallback(
      async selectedFarmId => {

        const id =
          cleanString(
            selectedFarmId
          );

        if (!id) {
          return null;
        }

        try {

          const location =
            await mapService.getLocationByFarmId(
              id
            );

          if (location) {

            setFarmId(id);

            setLatitude(
              Number(
                location.latitude
              )
            );

            setLongitude(
              Number(
                location.longitude
              )
            );

            setPoints(
              normalizePoints(
                location.points ||
                location.boundary
              )
            );

            setArea(
              location.area ?? null
            );

            setPerimeter(
              location.perimeter ?? null
            );

            setAdministrative(
              normalizeAdministrativeLocation(
                location
              )
            );

            cacheLocation(
              location
            );

            return location;
          }

          return null;

        } catch (loadError) {

          console.warn(
            "Farm location loading failed:",
            loadError
          );

          return null;
        }

      },
      []
    );


  // =======================================================
  // SELECT POINT
  // =======================================================

  const selectMapPoint =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !isValidCoordinate(
            selectedLatitude,
            selectedLongitude
          )
        ) {

          setError(
            t("coordinatesRequired") ||
            "إحداثيات الموقع غير صحيحة"
          );

          return false;
        }

        const point = {

          latitude:
            Number(
              selectedLatitude
            ),

          longitude:
            Number(
              selectedLongitude
            ),

        };

        setPoints(
          current => [
            ...current,
            point,
          ]
        );

        setLatitude(
          Number(
            selectedLatitude
          )
        );

        setLongitude(
          Number(
            selectedLongitude
          )
        );

        setError("");

        return true;

      },
      [t]
    );


  // =======================================================
  // SET CENTER
  // =======================================================

  const setMapCenter =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !isValidCoordinate(
            selectedLatitude,
            selectedLongitude
          )
        ) {
          return false;
        }

        setLatitude(
          Number(
            selectedLatitude
          )
        );

        setLongitude(
          Number(
            selectedLongitude
          )
        );

        return true;

      },
      []
    );


  // =======================================================
  // SET COORDINATES
  // =======================================================

  const setCoordinates =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !isValidCoordinate(
            selectedLatitude,
            selectedLongitude
          )
        ) {

          setError(
            t("coordinatesRequired") ||
            "إحداثيات الموقع غير صحيحة"
          );

          return false;
        }

        setLatitude(
          Number(
            selectedLatitude
          )
        );

        setLongitude(
          Number(
            selectedLongitude
          )
        );

        setError("");

        return true;

      },
      [t]
    );


  // =======================================================
  // REMOVE LAST POINT
  // =======================================================

  const removeLastPoint =
    useCallback(
      () => {

        setPoints(
          current => {

            const next =
              current.slice(
                0,
                -1
              );

            const center =
              calculateBoundaryCenter(
                next
              );

            if (center) {

              setLatitude(
                center.latitude
              );

              setLongitude(
                center.longitude
              );

            } else {

              setLatitude("");
              setLongitude("");

            }

            return next;

          }
        );

        setArea(null);
        setPerimeter(null);

      },
      []
    );


  // =======================================================
  // CLEAR
  // =======================================================

  const clearPoints =
    useCallback(
      () => {

        setPoints([]);

        setLatitude("");
        setLongitude("");

        setArea(null);
        setPerimeter(null);

        setError("");

      },
      []
    );


  // =======================================================
  // CALCULATE MEASUREMENTS
  // =======================================================

  const calculateMeasurements =
    useCallback(
      mapPoints => {

        const safePoints =
          normalizePoints(
            mapPoints
          );

        if (
          safePoints.length < 3
        ) {

          return {

            area: null,
            perimeter: null,

          };
        }

        const calculatedArea =
          mapService.calculateArea(
            safePoints
          );

        const calculatedPerimeter =
          mapService.calculatePerimeter(
            safePoints
          );

        setArea(
          calculatedArea
        );

        setPerimeter(
          calculatedPerimeter
        );

        return {

          area:
            calculatedArea,

          perimeter:
            calculatedPerimeter,

        };

      },
      []
    );


  // =======================================================
  // REVERSE GEOCODING
  // =======================================================

  const reverseGeocode =
    useCallback(
      async (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !isValidCoordinate(
            selectedLatitude,
            selectedLongitude
          )
        ) {
          return null;
        }

        try {

          setMapLoading(true);

          const result =
            await mapService.reverseGeocode(
              selectedLatitude,
              selectedLongitude,
              language
            );

          const normalized =
            normalizeAdministrativeLocation(
              result
            );

          setAdministrative(
            normalized
          );

          return {

            ...result,

            ...normalized,

            latitude:
              Number(
                selectedLatitude
              ),

            longitude:
              Number(
                selectedLongitude
              ),

          };

        } catch (geocodeError) {

          console.warn(
            "Reverse geocoding failed:",
            geocodeError
          );

          return null;

        } finally {

          setMapLoading(false);
        }

      },
      [language]
    );


  // =======================================================
  // BUILD LOCATION
  // =======================================================

  const buildMapLocationData =
    useCallback(
      async ({
        farmId: selectedFarmId,
        farmName = "",
        points: selectedPoints,
      } = {}) => {

        const id =
          cleanString(
            selectedFarmId ||
            farmId
          );

        if (!id) {

          setError(
            t("farmRequired") ||
            "اختر المزرعة أولًا"
          );

          return null;
        }

        const mapPoints =
          normalizePoints(
            selectedPoints ??
            points
          );

        if (
          mapPoints.length < 3
        ) {

          setError(
            t("minimumThreePoints") ||
            "يجب تحديد ثلاث نقاط على الأقل"
          );

          return null;
        }

        const center =
          calculateBoundaryCenter(
            mapPoints
          );

        if (!center) {

          setError(
            t("coordinatesRequired") ||
            "تعذر حساب مركز الأرض"
          );

          return null;
        }

        try {

          setMapLoading(true);
          setError("");


          // -------------------------------------------------
          // القياسات
          // -------------------------------------------------

          const calculatedArea =
            mapService.calculateArea(
              mapPoints
            );

          const calculatedPerimeter =
            mapService.calculatePerimeter(
              mapPoints
            );


          // -------------------------------------------------
          // الموقع الإداري
          //
          // المركز فقط يستخدم للـ reverse geocoding.
          // لا نسمح له بتغيير الإحداثيات الحقيقية.
          // -------------------------------------------------

          const geocoded =
            await mapService.reverseGeocode(
              center.latitude,
              center.longitude,
              language
            );

          const administrativeData =
            normalizeAdministrativeLocation(
              geocoded
            );


          const farm =
            farms.find(
              item =>
                String(item?.id) ===
                id
            );


          const locationData = {

            farmId:
              id,

            farmName:
              cleanString(
                farmName ||
                farm?.name
              ),

            source:
              "map",

            latitude:
              center.latitude,

            longitude:
              center.longitude,

            points:
              mapPoints,

            boundary:
              mapPoints,

            area:
              Number.isFinite(
                Number(
                  calculatedArea
                )
              )
                ? Number(
                    calculatedArea
                  )
                : null,

            perimeter:
              Number.isFinite(
                Number(
                  calculatedPerimeter
                )
              )
                ? Number(
                    calculatedPerimeter
                  )
                : null,

            ...administrativeData,

            status:
              "active",

          };


          // -------------------------------------------------
          // تحديث الحالة
          // -------------------------------------------------

          setFarmId(id);

          setLatitude(
            center.latitude
          );

          setLongitude(
            center.longitude
          );

          setPoints(
            mapPoints
          );

          setArea(
            calculatedArea
          );

          setPerimeter(
            calculatedPerimeter
          );

          setAdministrative(
            administrativeData
          );


          // -------------------------------------------------
          // Cache
          // -------------------------------------------------

          cacheLocation(
            locationData
          );


          return locationData;

        } catch (buildError) {

          console.error(
            "Building location failed:",
            buildError
          );

          setError(
            t("saveError") ||
            "تعذر تجهيز موقع الأرض"
          );

          return null;

        } finally {

          setMapLoading(false);
        }

      },
      [
        farmId,
        points,
        farms,
        language,
        t,
      ]
    );


  // =======================================================
  // SAVE
  // =======================================================

  const saveMapLocation =
    useCallback(
      async options => {

        const locationData =
          await buildMapLocationData(
            options
          );

        if (!locationData) {
          return false;
        }

        try {

          setLoading(true);
          setError("");

          const saved =
            await mapService.createLocation(
              locationData
            );

          if (!saved) {
            throw new Error(
              "MAP_SAVE_FAILED"
            );
          }

          setLocations(
            current => {

              const withoutFarm =
                current.filter(
                  location =>
                    String(
                      location?.farmId
                    ) !==
                    String(
                      saved.farmId
                    )
                );

              return [
                ...withoutFarm,
                saved,
              ];

            }
          );


          cacheLocation(
            saved
          );


          return saved;

        } catch (saveError) {

          console.error(
            "Map location save failed:",
            saveError
          );

          setError(
            t("saveError") ||
            "تعذر حفظ موقع الأرض"
          );

          return false;

        } finally {

          setLoading(false);
        }

      },
      [
        buildMapLocationData,
        t,
      ]
    );


  // =======================================================
  // NEARBY
  // =======================================================

  const loadNearbyPlaces =
    useCallback(
      async (
        selectedLatitude,
        selectedLongitude,
        radius = 1000
      ) => {

        if (
          !isValidCoordinate(
            selectedLatitude,
            selectedLongitude
          )
        ) {

          setNearbyPlaces([]);

          return [];

        }

        try {

          setMapLoading(true);

          const result =
            await mapService.getNearbyPlaces(
              selectedLatitude,
              selectedLongitude,
              radius,
              language
            );

          const safe =
            Array.isArray(result)
              ? result
              : [];

          setNearbyPlaces(
            safe
          );

          return safe;

        } catch {

          setNearbyPlaces([]);

          return [];

        } finally {

          setMapLoading(false);
        }

      },
      [language]
    );


  // =======================================================
  // DELETE
  // =======================================================

  const deleteLocation =
    useCallback(
      async id => {

        if (!id) {
          return false;
        }

        try {

          setLoading(true);

          const deleted =
            await mapService.deleteLocation(
              id
            );

          if (!deleted) {
            return false;
          }

          setLocations(
            current =>
              current.filter(
                location =>
                  String(
                    location?.id
                  ) !==
                  String(id)
              )
          );

          return true;

        } catch (deleteError) {

          console.error(
            "Map location delete failed:",
            deleteError
          );

          return false;

        } finally {

          setLoading(false);
        }

      },
      []
    );


  // =======================================================
  // RESET
  // =======================================================

  const resetLocation =
    useCallback(
      () => {

        setFarmId("");

        setLatitude("");
        setLongitude("");

        setPoints([]);

        setArea(null);
        setPerimeter(null);

        setAdministrative(
          {
            ...EMPTY_FIELD,
          }
        );

        setNearbyPlaces([]);

        setError("");

      },
      []
    );


  // =======================================================
  // RETURN
  // =======================================================

  return {

    // DATA

    farms,
    locations,
    nearbyPlaces,

    // FARM

    farmId,
    setFarmId,

    loadFarmLocation,

    // COORDINATES

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    setCoordinates,
    setMapCenter,

    // BOUNDARY

    points,
    setPoints,

    selectMapPoint,
    removeLastPoint,
    clearPoints,

    // MEASUREMENTS

    area,
    setArea,

    perimeter,
    setPerimeter,

    calculateMeasurements,

    // ADMINISTRATIVE

    administrative,

    country:
      administrative.country,

    governorate:
      administrative.governorate,

    region:
      administrative.region,

    district:
      administrative.district,

    city:
      administrative.city,

    town:
      administrative.town,

    village:
      administrative.village,

    placeName:
      administrative.placeName,

    locationDescription:
      administrative.locationDescription,

    // MAP SERVICES

    reverseGeocode,
    loadNearbyPlaces,

    // PIPELINE

    buildMapLocationData,
    saveMapLocation,

    // CRUD

    deleteLocation,
    resetLocation,

    // CACHE

    readSavedMapLocation,

    // STATE

    loading,
    mapLoading,
    error,

    // CONSTANTS

    DEFAULT_POSITION,
    EMPTY_FIELD,

  };

}
