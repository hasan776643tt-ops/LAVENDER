// =========================================================
// LAVENDER — useMap
// src/hooks/useMap.js
// =========================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import mapService from "../services/mapService.js";
import farmService from "../services/farmService.js";
import { translate } from "../utils/translation";
import { useSettings } from "../context/SettingsContext";


// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];

const LOCATION_STORAGE_KEY = "mapLocation";

const EMPTY_ADMINISTRATIVE = {
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

const EMPTY_FIELD = {
  farmId: "",
  latitude: "",
  longitude: "",
  points: [],
  boundary: [],
  area: null,
  perimeter: null,
  ...EMPTY_ADMINISTRATIVE,
  locationType: "field",
  notes: "",
  source: "map",
  status: "active",
};


// =========================================================
// HELPERS
// =========================================================

function cleanString(value) {
  return String(value ?? "").trim();
}


function isValidCoordinate(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

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
  if (!point) {
    return null;
  }

  if (Array.isArray(point) && point.length >= 2) {
    const latitude = Number(point[0]);
    const longitude = Number(point[1]);

    if (!isValidCoordinate(latitude, longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }

  const latitude =
    point?.latitude ??
    point?.lat ??
    point?.y;

  const longitude =
    point?.longitude ??
    point?.lng ??
    point?.lon ??
    point?.x;

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}


function normalizePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(normalizePoint)
    .filter(Boolean);
}


function calculateBoundaryCenter(points) {
  const safePoints = normalizePoints(points);

  if (!safePoints.length) {
    return null;
  }

  const latitude =
    safePoints.reduce(
      (sum, point) => sum + point.latitude,
      0
    ) / safePoints.length;

  const longitude =
    safePoints.reduce(
      (sum, point) => sum + point.longitude,
      0
    ) / safePoints.length;

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}


// =========================================================
// ADMINISTRATIVE NORMALIZATION
// =========================================================

function getAdministrativeSource(result) {
  if (!result || typeof result !== "object") {
    return {};
  }

  return {
    ...result,
    ...(result.address || {}),
    ...(result.administrative || {}),
    ...(result.location || {}),
    ...(result.reverseGeocode || {}),
    ...(result.geocoding || {}),
    ...(result.geo || {}),
  };
}


function normalizeAdministrativeLocation(result) {
  const data = getAdministrativeSource(result);

  const country = cleanString(
    data.country ??
    data.countryName ??
    data.country_name ??
    ""
  );

  const governorate = cleanString(
    data.governorate ??
    data.governorateName ??
    data.province ??
    data.provinceName ??
    data.state ??
    data.stateName ??
    data.state_district ??
    data.region ??
    data.regionName ??
    data.county ??
    data.district ??
    ""
  );

  const region = cleanString(
    data.region ??
    data.regionName ??
    ""
  );

  const district = cleanString(
    data.district ??
    data.county ??
    data.municipality ??
    data.city_district ??
    ""
  );

  const city = cleanString(
    data.city ??
    data.cityName ??
    data.municipality ??
    data.municipalityName ??
    data.locality ??
    ""
  );

  const town = cleanString(
    data.town ??
    data.townName ??
    ""
  );

  const village = cleanString(
    data.village ??
    data.villageName ??
    data.hamlet ??
    data.suburb ??
    data.locality ??
    data.place ??
    data.placeName ??
    data.neighbourhood ??
    data.neighborhood ??
    ""
  );

  const placeName = cleanString(
    data.placeName ??
    data.place ??
    data.name ??
    ""
  );

  const locationDescription = cleanString(
    data.displayName ??
    data.locationDescription ??
    data.display_name ??
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
// CACHE
// =========================================================

function cacheLocation(location) {
  if (typeof window === "undefined") {
    return;
  }

  if (!location || typeof location !== "object") {
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
  if (typeof window === "undefined") {
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

    const location = JSON.parse(raw);

    if (!location || typeof location !== "object") {
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
  const { settings } = useSettings();

  const language =
    settings?.language || "ar";

  const t = useCallback(
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

  const [farms, setFarms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const [farmId, setFarmId] = useState("");

  const [locationType, setLocationType] =
    useState("field");

  const [notes, setNotes] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [points, setPoints] = useState([]);

  const [area, setArea] = useState(null);
  const [perimeter, setPerimeter] = useState(null);

  const [administrative, setAdministrative] =
    useState({
      ...EMPTY_ADMINISTRATIVE,
    });

  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [error, setError] = useState("");


  // =======================================================
  // LOAD FARMS + LOCATIONS
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

  const loadFarmLocation = useCallback(
    async selectedFarmId => {
      const id =
        cleanString(selectedFarmId);

      if (!id) {
        return null;
      }

      try {
        const location =
          await mapService.getLocationByFarmId(
            id
          );

        if (!location) {
          return null;
        }

        const normalizedPoints =
          normalizePoints(
            location.points ??
            location.boundary ??
            location.coordinates
          );

        const center =
          isValidCoordinate(
            location.latitude,
            location.longitude
          )
            ? {
                latitude:
                  Number(location.latitude),
                longitude:
                  Number(location.longitude),
              }
            : calculateBoundaryCenter(
                normalizedPoints
              );

        const normalizedAdmin =
          normalizeAdministrativeLocation(
            location
          );

        setFarmId(id);

        setLatitude(
          center?.latitude ?? ""
        );

        setLongitude(
          center?.longitude ?? ""
        );

        setPoints(
          normalizedPoints
        );

        setArea(
          location.area ?? null
        );

        setPerimeter(
          location.perimeter ?? null
        );

        setAdministrative(
          normalizedAdmin
        );

        setLocationType(
          cleanString(
            location.locationType ??
            location.type ??
            "field"
          )
        );

        setNotes(
          cleanString(
            location.notes
          )
        );

        const cachedLocation = {
          ...location,
          farmId: id,
          latitude:
            center?.latitude ??
            location.latitude ??
            "",
          longitude:
            center?.longitude ??
            location.longitude ??
            "",
          points: normalizedPoints,
          boundary: normalizedPoints,
          ...normalizedAdmin,
        };

        cacheLocation(
          cachedLocation
        );

        return cachedLocation;
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
  // SELECT MAP POINT
  // =======================================================

  const selectMapPoint = useCallback(
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
          Number(selectedLatitude),
        longitude:
          Number(selectedLongitude),
      };

      setPoints(currentPoints => {
        const nextPoints = [
          ...currentPoints,
          point,
        ];

        if (nextPoints.length >= 3) {
          try {
            const nextArea =
              mapService.calculateArea(
                nextPoints
              );

            const nextPerimeter =
              mapService.calculatePerimeter(
                nextPoints
              );

            setArea(
              Number.isFinite(
                Number(nextArea)
              )
                ? Number(nextArea)
                : null
            );

            setPerimeter(
              Number.isFinite(
                Number(nextPerimeter)
              )
                ? Number(nextPerimeter)
                : null
            );
          } catch {
            setArea(null);
            setPerimeter(null);
          }
        } else {
          setArea(null);
          setPerimeter(null);
        }

        return nextPoints;
      });

      /*
       * النقطة اليدوية هي التي تحدد
       * مركز الحدود الحالي.
       */
      setLatitude(
        point.latitude
      );

      setLongitude(
        point.longitude
      );

      setError("");

      return true;
    },
    [t]
  );


  // =======================================================
  // SET MAP CENTER
  // =======================================================

  const setMapCenter = useCallback(
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
        Number(selectedLatitude)
      );

      setLongitude(
        Number(selectedLongitude)
      );

      return true;
    },
    []
  );


  // =======================================================
  // SET COORDINATES
  // =======================================================

  const setCoordinates = useCallback(
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
        Number(selectedLatitude)
      );

      setLongitude(
        Number(selectedLongitude)
      );

      setError("");

      return true;
    },
    [t]
  );


  // =======================================================
  // REMOVE LAST POINT
  // =======================================================

  const removeLastPoint = useCallback(
    () => {
      setPoints(currentPoints => {
        const nextPoints =
          currentPoints.slice(0, -1);

        if (nextPoints.length >= 3) {
          try {
            const nextArea =
              mapService.calculateArea(
                nextPoints
              );

            const nextPerimeter =
              mapService.calculatePerimeter(
                nextPoints
              );

            setArea(
              Number.isFinite(
                Number(nextArea)
              )
                ? Number(nextArea)
                : null
            );

            setPerimeter(
              Number.isFinite(
                Number(nextPerimeter)
              )
                ? Number(nextPerimeter)
                : null
            );
          } catch {
            setArea(null);
            setPerimeter(null);
          }
        } else {
          setArea(null);
          setPerimeter(null);
        }

        const center =
          calculateBoundaryCenter(
            nextPoints
          );

        if (center) {
          setLatitude(
            center.latitude
          );

          setLongitude(
            center.longitude
          );
        }

        return nextPoints;
      });

      setError("");
    },
    []
  );


  // =======================================================
  // CLEAR POINTS
  // =======================================================

  const clearPoints = useCallback(
    () => {
      setPoints([]);
      setLatitude("");
      setLongitude("");
      setArea(null);
      setPerimeter(null);

      setAdministrative({
        ...EMPTY_ADMINISTRATIVE,
      });

      setLocationType("field");
      setNotes("");
      setError("");
    },
    []
  );


  // =======================================================
  // MEASUREMENTS
  // =======================================================

  const calculateMeasurements =
    useCallback(
      mapPoints => {
        const safePoints =
          normalizePoints(mapPoints);

        if (safePoints.length < 3) {
          setArea(null);
          setPerimeter(null);

          return {
            area: null,
            perimeter: null,
          };
        }

        try {
          const calculatedArea =
            mapService.calculateArea(
              safePoints
            );

          const calculatedPerimeter =
            mapService.calculatePerimeter(
              safePoints
            );

          const safeArea =
            Number.isFinite(
              Number(calculatedArea)
            )
              ? Number(calculatedArea)
              : null;

          const safePerimeter =
            Number.isFinite(
              Number(calculatedPerimeter)
            )
              ? Number(calculatedPerimeter)
              : null;

          setArea(safeArea);
          setPerimeter(safePerimeter);

          return {
            area: safeArea,
            perimeter: safePerimeter,
          };
        } catch (measurementError) {
          console.error(
            "Map measurements failed:",
            measurementError
          );

          setArea(null);
          setPerimeter(null);

          return {
            area: null,
            perimeter: null,
          };
        }
      },
      []
    );


  // =======================================================
  // REVERSE GEOCODING
  // =======================================================

  const reverseGeocode = useCallback(
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
            Number(selectedLatitude),
            Number(selectedLongitude),
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
          ...(result || {}),
          ...normalized,

          latitude:
            Number(selectedLatitude),

          longitude:
            Number(selectedLongitude),
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

        points: selectedPoints = [],

        locationType:
          selectedLocationType,

        notes:
          selectedNotes,

        country = "",
        governorate = "",
        region = "",
        district = "",
        city = "",
        town = "",
        village = "",
        placeName = "",
        locationDescription = "",

      } = {}) => {
        const id =
          cleanString(
            selectedFarmId ||
            farmId
          );

        if (!id) {
          setError(
            t("farmRequired") ||
            "يجب تحديد المزرعة"
          );

          return null;
        }

        const mapPoints =
          normalizePoints(
            selectedPoints ??
            points
          );

        if (mapPoints.length < 3) {
          setError(
            t("minimumThreePoints") ||
            "يجب تحديد ثلاث نقاط على الأقل"
          );

          return null;
        }

        /*
         * مركز الأرض الحقيقي:
         * يتم حسابه من الحدود اليدوية.
         */
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

          const calculatedArea =
            mapService.calculateArea(
              mapPoints
            );

          const calculatedPerimeter =
            mapService.calculatePerimeter(
              mapPoints
            );

          /*
           * القيم التي كتبها المستخدم
           * تُستخدم أولًا.
           */
          let administrativeData = {
            country:
              cleanString(country),

            governorate:
              cleanString(governorate),

            region:
              cleanString(region),

            district:
              cleanString(district),

            city:
              cleanString(city),

            town:
              cleanString(town),

            village:
              cleanString(village),

            placeName:
              cleanString(placeName),

            locationDescription:
              cleanString(
                locationDescription
              ),
          };

          /*
           * إذا كانت البيانات ناقصة،
           * نطلب reverse geocoding من مركز
           * الحدود.
           *
           * GPS ليس مصدر المركز هنا.
           * الحدود اليدوية هي المصدر الحقيقي.
           */
          const needsGeocoding =
            !administrativeData.country ||
            !administrativeData.governorate ||
            !administrativeData.city ||
            !administrativeData.village;

          if (needsGeocoding) {
            try {
              const geocoded =
                await mapService.reverseGeocode(
                  center.latitude,
                  center.longitude,
                  language
                );

              const normalized =
                normalizeAdministrativeLocation(
                  geocoded
                );

              administrativeData = {
                country:
                  administrativeData.country ||
                  normalized.country,

                governorate:
                  administrativeData.governorate ||
                  normalized.governorate,

                region:
                  administrativeData.region ||
                  normalized.region,

                district:
                  administrativeData.district ||
                  normalized.district,

                city:
                  administrativeData.city ||
                  normalized.city,

                town:
                  administrativeData.town ||
                  normalized.town,

                village:
                  administrativeData.village ||
                  normalized.village,

                placeName:
                  administrativeData.placeName ||
                  normalized.placeName,

                locationDescription:
                  administrativeData.locationDescription ||
                  normalized.locationDescription,
              };
            } catch (geocodeError) {
              console.warn(
                "Reverse geocoding failed while building location:",
                geocodeError
              );
            }
          }

          const farm =
            farms.find(item => {
              const candidate =
                item?.id ??
                item?._id ??
                item?.farmId ??
                item?.farm_id;

              return (
                String(candidate) ===
                String(id)
              );
            });

          const finalFarmName =
            cleanString(
              farmName ||
              farm?.name ||
              farm?.farmName ||
              farm?.title ||
              ""
            );

          const safeArea =
            Number.isFinite(
              Number(calculatedArea)
            )
              ? Number(calculatedArea)
              : null;

          const safePerimeter =
            Number.isFinite(
              Number(calculatedPerimeter)
            )
              ? Number(calculatedPerimeter)
              : null;

          const locationData = {
            farmId: id,

            farmName:
              finalFarmName,

            source: "map",

            /*
             * الإحداثيات الحقيقية لمركز
             * الحدود اليدوية.
             */
            latitude:
              center.latitude,

            longitude:
              center.longitude,

            /*
             * الحدود الحقيقية.
             */
            points:
              mapPoints,

            boundary:
              mapPoints,

            coordinates:
              mapPoints,

            area:
              safeArea,

            perimeter:
              safePerimeter,

            /*
             * البيانات الإدارية.
             */
            country:
              administrativeData.country,

            countryName:
              administrativeData.country,

            governorate:
              administrativeData.governorate,

            governorateName:
              administrativeData.governorate,

            province:
              administrativeData.governorate,

            provinceName:
              administrativeData.governorate,

            region:
              administrativeData.region ||
              administrativeData.governorate,

            regionName:
              administrativeData.region ||
              administrativeData.governorate,

            district:
              administrativeData.district,

            city:
              administrativeData.city,

            cityName:
              administrativeData.city,

            municipality:
              administrativeData.city,

            town:
              administrativeData.town,

            village:
              administrativeData.village,

            villageName:
              administrativeData.village,

            placeName:
              administrativeData.placeName,

            place:
              administrativeData.placeName,

            locationDescription:
              administrativeData.locationDescription,

            description:
              administrativeData.locationDescription,

            locationType:
              cleanString(
                selectedLocationType ||
                locationType ||
                "field"
              ),

            notes:
              cleanString(
                selectedNotes ??
                notes
              ),

            status:
              "active",
          };

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
            safeArea
          );

          setPerimeter(
            safePerimeter
          );

          setAdministrative(
            administrativeData
          );

          setLocationType(
            locationData.locationType
          );

          setNotes(
            locationData.notes
          );

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
        locationType,
        notes,
        t,
      ]
    );


  // =======================================================
  // SAVE LOCATION
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

          /*
           * نحافظ على نسخة واحدة فقط
           * للمزرعة نفسها.
           */
          setLocations(
            currentLocations => {
              const withoutFarm =
                currentLocations.filter(
                  location => {
                    const locationFarmId =
                      location?.farmId ??
                      location?.farm_id ??
                      location?.farmID;

                    return (
                      String(
                        locationFarmId
                      ) !==
                      String(
                        saved.farmId
                      )
                    );
                  }
                );

              return [
                ...withoutFarm,
                saved,
              ];
            }
          );

          cacheLocation(saved);

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
  // NEARBY PLACES
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

          setNearbyPlaces(safe);

          return safe;
        } catch (nearbyError) {
          console.warn(
            "Nearby places failed:",
            nearbyError
          );

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
          setError("");

          const deleted =
            await mapService.deleteLocation(
              id
            );

          if (!deleted) {
            return false;
          }

          setLocations(
            currentLocations =>
              currentLocations.filter(
                location => {
                  const locationId =
                    location?.id ??
                    location?._id ??
                    location?.locationId;

                  return (
                    String(locationId) !==
                    String(id)
                  );
                }
              )
          );

          return true;
        } catch (deleteError) {
          console.error(
            "Map location delete failed:",
            deleteError
          );

          setError(
            t("deleteError") ||
            "تعذر حذف موقع الأرض"
          );

          return false;
        } finally {
          setLoading(false);
        }
      },
      [t]
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

        setAdministrative({
          ...EMPTY_ADMINISTRATIVE,
        });

        setLocationType("field");
        setNotes("");

        setNearbyPlaces([]);
        setError("");
      },
      []
    );


  // =======================================================
  // RETURN
  // =======================================================

  return {
    farms,
    locations,
    nearbyPlaces,

    farmId,
    setFarmId,
    loadFarmLocation,

    locationType,
    setLocationType,

    notes,
    setNotes,

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    points,
    setPoints,

    area,
    setArea,

    perimeter,
    setPerimeter,

    setCoordinates,
    setMapCenter,

    selectMapPoint,
    removeLastPoint,
    clearPoints,

    calculateMeasurements,

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

    reverseGeocode,
    loadNearbyPlaces,

    buildMapLocationData,
    saveMapLocation,

    addLocation:
      saveMapLocation,

    deleteLocation,
    resetLocation,

    readSavedMapLocation,

    loading,
    mapLoading,
    error,

    DEFAULT_POSITION,
    EMPTY_FIELD,
  };
}
