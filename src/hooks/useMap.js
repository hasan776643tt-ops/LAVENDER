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

إدارة موقع الأرض فقط.

المصدر الحقيقي للموقع:
latitude / longitude / boundary

الموقع النصي:
معلومات وصفية فقط.

المسار المعماري:

Map.jsx
   ↓
useMap.js
   ↓
mapService.js
   ↓
mapRepository.js
   ↓
storage / DataModel

لا يوجد هنا أي منطق خاص بالمحاصيل.

مهم:
- لا نعتمد على اسم القرية أو المدينة لتحديد الإحداثيات.
- الإحداثيات الناتجة من الخريطة هي المصدر الحقيقي.
- boundary / points تمثل حدود الأرض.
- الموقع الإداري الناتج من reverse geocoding معلومات وصفية.
- يتم حفظ نسخة mapLocation لتستطيع Crops قراءتها.
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

  country: "",
  governorate: "",
  region: "",
  district: "",
  city: "",
  town: "",
  village: "",
  placeName: "",
  locationDescription: "",
  notes: "",

  north: "",
  south: "",
  east: "",
  west: "",

  northNeighbor: "",
  southNeighbor: "",
  eastNeighbor: "",
  westNeighbor: "",

  points: [],

  latitude: "",
  longitude: "",

  area: null,
  perimeter: null,

  boundaryWidth: "",

});


const LOCATION_STORAGE_KEYS = Object.freeze([
  "mapLocation",
  "selectedLocation",
  "selectedFarmLocation",
  "farmLocation",
  "fieldLocation",
]);


// =========================================================
// BASIC HELPERS
// =========================================================

function cleanString(value) {

  return String(
    value ?? ""
  ).trim();

}


function validCoordinates(
  latitude,
  longitude
) {

  try {

    mapService.validateCoordinates(
      latitude,
      longitude
    );

    return true;

  } catch {

    return false;

  }

}


function normalizePoint(point) {

  if (Array.isArray(point)) {

    return {

      latitude: Number(point[0]),
      longitude: Number(point[1]),

    };

  }


  return {

    latitude: Number(point?.latitude),
    longitude: Number(point?.longitude),

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
        validCoordinates(
          point.latitude,
          point.longitude
        )
    );

}


function calculateBoundaryCenter(points) {

  const safePoints =
    normalizePoints(points);


  if (
    safePoints.length === 0
  ) {

    return null;

  }


  const latitude =
    safePoints.reduce(
      (
        total,
        point
      ) =>
        total +
        point.latitude,
      0
    ) /
    safePoints.length;


  const longitude =
    safePoints.reduce(
      (
        total,
        point
      ) =>
        total +
        point.longitude,
      0
    ) /
    safePoints.length;


  if (
    !validCoordinates(
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


/*
-----------------------------------------------------------
مساعد لاختيار أول قيمة موجودة.

استخدمناه بدل خلط ?? مع || في نفس التعبير.

مثال خاطئ:

options.north ?? northNeighbor || north

الصحيح:

firstValue(
  options.north,
  northNeighbor,
  north
)

وهذا يمنع خطأ Vite/Rollup:
Nullish coalescing operator requires parens
-----------------------------------------------------------
*/

function firstValue(...values) {

  for (
    const value of values
  ) {

    if (
      value !== null &&
      value !== undefined &&
      cleanString(value) !== ""
    ) {

      return value;

    }

  }


  return "";

}


// =========================================================
// ADMINISTRATIVE LOCATION
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
      displayName: "",
      road: "",

    };

  }


  const address =
    result.address &&
    typeof result.address === "object"
      ? result.address
      : {};


  const governorate =
    cleanString(
      firstValue(
        result.governorate,
        result.state,
        address.state,
        address.province,
        address.governorate
      )
    );


  const region =
    cleanString(
      firstValue(
        result.region,
        address.region,
        address.province,
        address.state_district
      )
    );


  const district =
    cleanString(
      firstValue(
        result.district,
        address.district,
        address.county,
        address.municipality,
        address.city_district,
        address.suburb
      )
    );


  const city =
    cleanString(
      firstValue(
        result.city,
        address.city
      )
    );


  const town =
    cleanString(
      firstValue(
        result.town,
        address.town
      )
    );


  const village =
    cleanString(
      firstValue(
        result.village,
        address.village,
        address.hamlet
      )
    );


  return {

    country:
      cleanString(
        firstValue(
          result.country,
          address.country
        )
      ),

    governorate,

    region,

    district,

    city,

    town:
      town ||
      village ||
      city,

    village:
      village ||
      town ||
      city,

    placeName:
      cleanString(
        firstValue(
          result.placeName,
          result.nearestPlace,
          result.name,
          address.road
        )
      ),

    displayName:
      cleanString(
        result.displayName
      ),

    road:
      cleanString(
        firstValue(
          result.road,
          address.road
        )
      ),

  };

}


// =========================================================
// MAP LOCATION CACHE
// =========================================================

function cacheMapLocation(location) {

  if (
    typeof window === "undefined" ||
    !location ||
    typeof location !== "object"
  ) {

    return;

  }


  try {

    const serialized =
      JSON.stringify(location);


    /*
    ---------------------------------------------------------
    المصدر الأساسي الذي ستقرأ منه Crops.
    ---------------------------------------------------------
    */

    window.localStorage.setItem(
      "mapLocation",
      serialized
    );


    /*
    ---------------------------------------------------------
    نسخة توافقية قديمة.
    لا نستخدمها كمصدر مختلف، وإنما كنسخة مساعدة.
    ---------------------------------------------------------
    */

    window.localStorage.setItem(
      "selectedLocation",
      serialized
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


  for (
    const key of LOCATION_STORAGE_KEYS
  ) {

    try {

      const raw =
        window.localStorage.getItem(
          key
        );


      if (!raw) {

        continue;

      }


      const parsed =
        JSON.parse(raw);


      if (
        parsed &&
        validCoordinates(
          parsed.latitude,
          parsed.longitude
        )
      ) {

        return parsed;

      }

    } catch {

      /*
      -------------------------------------------------------
      إذا كان المفتاح تالفًا ننتقل للمفتاح التالي.
      -------------------------------------------------------
      */

    }

  }


  return null;

}


// =========================================================
// HOOK
// =========================================================

export default function useMap() {


  // =======================================================
  // SETTINGS
  // =======================================================

  const {
    settings,
  } = useSettings();


  const language =
    settings?.language ||
    "ar";


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
  // FORM
  // =======================================================

  const [
    farmId,
    setFarmId,
  ] = useState("");


  const [
    locationType,
    setLocationType,
  ] = useState("farm");


  const [
    locationMode,
    setLocationMode,
  ] = useState("text");


  // =======================================================
  // ADMINISTRATIVE LOCATION
  // =======================================================

  const [
    country,
    setCountry,
  ] = useState("");


  const [
    governorate,
    setGovernorate,
  ] = useState("");


  const [
    region,
    setRegion,
  ] = useState("");


  const [
    district,
    setDistrict,
  ] = useState("");


  const [
    city,
    setCity,
  ] = useState("");


  const [
    town,
    setTown,
  ] = useState("");


  const [
    village,
    setVillage,
  ] = useState("");


  const [
    placeName,
    setPlaceName,
  ] = useState("");


  const [
    locationDescription,
    setLocationDescription,
  ] = useState("");


  const [
    notes,
    setNotes,
  ] = useState("");


  // =======================================================
  // DIRECTIONS
  // =======================================================

  const [
    north,
    setNorth,
  ] = useState("");


  const [
    south,
    setSouth,
  ] = useState("");


  const [
    east,
    setEast,
  ] = useState("");


  const [
    west,
    setWest,
  ] = useState("");


  const [
    northNeighbor,
    setNorthNeighbor,
  ] = useState("");


  const [
    southNeighbor,
    setSouthNeighbor,
  ] = useState("");


  const [
    eastNeighbor,
    setEastNeighbor,
  ] = useState("");


  const [
    westNeighbor,
    setWestNeighbor,
  ] = useState("");


  // =======================================================
  // COORDINATES
  // =======================================================

  const [
    latitude,
    setLatitude,
  ] = useState("");


  const [
    longitude,
    setLongitude,
  ] = useState("");


  // =======================================================
  // BOUNDARY
  // =======================================================

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


  const [
    boundaryWidth,
    setBoundaryWidth,
  ] = useState("");


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
  // INITIAL LOAD
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
        ] =
          await Promise.all([
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
          "Map data loading failed:",
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
  // SELECT MAP POINT
  // =======================================================

  const selectMapPoint =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !validCoordinates(
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
          current =>
            current === ""
              ? point.latitude
              : current
        );


        setLongitude(
          current =>
            current === ""
              ? point.longitude
              : current
        );


        setError("");

        return true;

      },
      [t]
    );


  // =======================================================
  // MAP CENTER
  // =======================================================

  const setMapCenter =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !validCoordinates(
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
  // COORDINATES
  // =======================================================

  const setCoordinates =
    useCallback(
      (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !validCoordinates(
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


            if (
              next.length === 0
            ) {

              setLatitude("");
              setLongitude("");

            } else {

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

              }

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
  // CLEAR POINTS
  // =======================================================

  const clearPoints =
    useCallback(
      () => {

        setPoints([]);

        setLatitude("");
        setLongitude("");

        setArea(null);
        setPerimeter(null);

        setBoundaryWidth("");

        setError("");

      },
      []
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
          !validCoordinates(
            selectedLatitude,
            selectedLongitude
          )
        ) {

          setNearbyPlaces([]);

          return [];

        }


        try {

          setMapLoading(true);


          const places =
            await mapService.getNearbyPlaces(
              selectedLatitude,
              selectedLongitude,
              radius,
              language
            );


          const safePlaces =
            Array.isArray(places)
              ? places
              : [];


          setNearbyPlaces(
            safePlaces
          );


          return safePlaces;

        } catch (nearbyError) {

          console.warn(
            "Nearby map data failed:",
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
  // REVERSE GEOCODING
  // =======================================================

  const reverseGeocode =
    useCallback(
      async (
        selectedLatitude,
        selectedLongitude
      ) => {

        if (
          !validCoordinates(
            selectedLatitude,
            selectedLongitude
          )
        ) {

          return null;

        }


        try {

          setMapLoading(true);


          return await mapService.reverseGeocode(
            selectedLatitude,
            selectedLongitude,
            language
          );

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
  // APPLY GEOCODED LOCATION
  // =======================================================

  const applyGeocodedLocation =
    useCallback(
      result => {

        if (!result) {

          return false;

        }


        const normalized =
          normalizeAdministrativeLocation(
            result
          );


        setCountry(
          normalized.country
        );

        setGovernorate(
          normalized.governorate
        );

        setRegion(
          normalized.region
        );

        setDistrict(
          normalized.district
        );

        setCity(
          normalized.city
        );

        setTown(
          normalized.town
        );

        setVillage(
          normalized.village
        );

        setPlaceName(
          normalized.placeName
        );

        setLocationDescription(
          normalized.displayName
        );


        /*
        -----------------------------------------------------
        إذا أعاد الـ geocoder إحداثيات صحيحة، نستخدمها
        فقط لأنها إحداثيات فعلية.
        -----------------------------------------------------
        */

        if (
          validCoordinates(
            result.latitude,
            result.longitude
          )
        ) {

          setLatitude(
            Number(
              result.latitude
            )
          );

          setLongitude(
            Number(
              result.longitude
            )
          );

        }


        return true;

      },
      []
    );


  // =======================================================
  // MEASUREMENTS
  // =======================================================

  const setMeasurements =
    useCallback(
      ({
        area: calculatedArea = null,
        perimeter: calculatedPerimeter = null,
        boundaryWidth: calculatedBoundaryWidth = null,
      } = {}) => {

        setArea(
          calculatedArea
        );

        setPerimeter(
          calculatedPerimeter
        );


        if (
          calculatedBoundaryWidth !==
          null
        ) {

          setBoundaryWidth(
            calculatedBoundaryWidth
          );

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

        setLocationType("farm");

        setLocationMode("text");


        setCountry("");
        setGovernorate("");
        setRegion("");
        setDistrict("");
        setCity("");
        setTown("");
        setVillage("");
        setPlaceName("");
        setLocationDescription("");
        setNotes("");


        setNorth("");
        setSouth("");
        setEast("");
        setWest("");


        setNorthNeighbor("");
        setSouthNeighbor("");
        setEastNeighbor("");
        setWestNeighbor("");


        setLatitude("");
        setLongitude("");


        setPoints([]);


        setArea(null);
        setPerimeter(null);
        setBoundaryWidth("");


        setNearbyPlaces([]);

        setError("");

      },
      []
    );


  // =======================================================
  // BUILD LOCATION DATA
  // =======================================================

  const buildMapLocationData =
    useCallback(
      async (
        options = {}
      ) => {

        const selectedFarmId =
          firstValue(
            options.farmId,
            farmId
          );


        if (!selectedFarmId) {

          const message =
            t("farmRequired") ||
            "اختر المزرعة أولًا";

          setError(message);

          return null;

        }


        const mapPoints =
          normalizePoints(
            options.points !== undefined
              ? options.points
              : points
          );


        if (
          mapPoints.length < 3
        ) {

          const message =
            t("minimumThreePoints") ||
            "يجب تحديد ثلاث نقاط على الأقل";

          setError(message);

          return null;

        }


        const center =
          calculateBoundaryCenter(
            mapPoints
          );


        if (!center) {

          const message =
            t("coordinatesRequired") ||
            "تعذر حساب مركز الأرض";

          setError(message);

          return null;

        }


        setMapLoading(true);
        setError("");


        try {

          const calculatedArea =
            mapService.calculateArea(
              mapPoints
            );


          const calculatedPerimeter =
            mapService.calculatePerimeter(
              mapPoints
            );


          /*
          ---------------------------------------------------
          Reverse Geocoding للمركز الحقيقي فقط.

          ملاحظة:
          geocoding لا يحدد موقع الأرض.
          هو فقط يعطي وصفًا إداريًا للمركز.
          ---------------------------------------------------
          */

          const geocoded =
            await mapService.reverseGeocode(
              center.latitude,
              center.longitude,
              language
            );


          const administrative =
            normalizeAdministrativeLocation(
              geocoded
            );


          const selectedFarm =
            Array.isArray(farms)
              ? farms.find(
                  farm =>
                    String(
                      farm?.id
                    ) ===
                    String(
                      selectedFarmId
                    )
                )
              : null;


          const locationData = {

            farmId:
              String(
                selectedFarmId
              ),


            farmName:
              cleanString(
                firstValue(
                  options.farmName,
                  selectedFarm?.name
                )
              ),


            type:
              firstValue(
                options.type,
                "field"
              ),


            source:
              "map",


            /*
            -------------------------------------------------
            الموقع الحقيقي
            -------------------------------------------------
            */

            latitude:
              center.latitude,

            longitude:
              center.longitude,


            /*
            -------------------------------------------------
            الحدود الحقيقية
            -------------------------------------------------
            */

            points:
              mapPoints,

            boundary:
              mapPoints,


            /*
            -------------------------------------------------
            القياسات
            -------------------------------------------------
            */

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


            boundaryWidth:
              options.boundaryWidth !== undefined &&
              options.boundaryWidth !== null
                ? options.boundaryWidth
                : boundaryWidth,


            /*
            -------------------------------------------------
            الموقع الإداري — وصفي
            -------------------------------------------------
            */

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
              administrative.displayName,

            road:
              administrative.road,


            /*
            -------------------------------------------------
            الاتجاهات.

            تم إصلاح مشكلة ?? + || باستخدام firstValue().
            -------------------------------------------------
            */

            north:
              cleanString(
                firstValue(
                  options.north,
                  northNeighbor,
                  north
                )
              ),

            south:
              cleanString(
                firstValue(
                  options.south,
                  southNeighbor,
                  south
                )
              ),

            east:
              cleanString(
                firstValue(
                  options.east,
                  eastNeighbor,
                  east
                )
              ),

            west:
              cleanString(
                firstValue(
                  options.west,
                  westNeighbor,
                  west
                )
              ),


            northNeighbor:
              cleanString(
                firstValue(
                  options.northNeighbor,
                  northNeighbor,
                  north
                )
              ),

            southNeighbor:
              cleanString(
                firstValue(
                  options.southNeighbor,
                  southNeighbor,
                  south
                )
              ),

            eastNeighbor:
              cleanString(
                firstValue(
                  options.eastNeighbor,
                  eastNeighbor,
                  east
                )
              ),

            westNeighbor:
              cleanString(
                firstValue(
                  options.westNeighbor,
                  westNeighbor,
                  west
                )
              ),


            notes:
              cleanString(
                firstValue(
                  options.notes,
                  notes
                )
              ),


            status:
              firstValue(
                options.status,
                "active"
              ),


            createdAt:
              firstValue(
                options.createdAt,
                new Date().toISOString()
              ),

          };


          // =================================================
          // تحديث الحالة
          // =================================================

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


          setCountry(
            administrative.country
          );

          setGovernorate(
            administrative.governorate
          );

          setRegion(
            administrative.region
          );

          setDistrict(
            administrative.district
          );

          setCity(
            administrative.city
          );

          setTown(
            administrative.town
          );

          setVillage(
            administrative.village
          );

          setPlaceName(
            administrative.placeName
          );

          setLocationDescription(
            administrative.displayName
          );


          /*
          ---------------------------------------------------
          جسر Map → Crops.

          لا نرسل اسم القرية كمصدر للإحداثيات.

          Crops يحصل على:
          latitude
          longitude
          boundary
          points
          source
          farmId

          والمعلومات النصية تبقى وصفية.
          ---------------------------------------------------
          */

          cacheMapLocation(
            locationData
          );


          return locationData;

        } catch (buildError) {

          console.error(
            "Building map location failed:",
            buildError
          );


          const message =
            t("geocodingError") ||
            "تعذر تحديد الموقع الإداري للأرض";


          setError(message);

          return null;

        } finally {

          setMapLoading(false);

        }

      },
      [
        farmId,
        points,
        boundaryWidth,

        northNeighbor,
        southNeighbor,
        eastNeighbor,
        westNeighbor,

        north,
        south,
        east,
        west,

        notes,

        farms,
        language,
        t,
      ]
    );


  // =======================================================
  // FINALIZE LOCATION
  // =======================================================

  const finalizeMapLocation =
    useCallback(
      async (
        options = {}
      ) => {

        return buildMapLocationData(
          options
        );

      },
      [
        buildMapLocationData,
      ]
    );


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateLocation =
    useCallback(
      (locationData = null) => {

        setError("");


        if (locationData) {

          if (!locationData.farmId) {

            const message =
              t("farmRequired") ||
              "اختر المزرعة أولًا";

            setError(message);

            return {
              valid: false,
              message,
            };

          }


          const mode =
            locationData.source ||
            "text";


          // =================================================
          // MAP
          // =================================================

          if (
            mode === "map"
          ) {

            const mapPoints =
              Array.isArray(
                locationData.points
              )
                ? locationData.points
                : Array.isArray(
                    locationData.boundary
                  )
                    ? locationData.boundary
                    : [];


            const normalizedMapPoints =
              normalizePoints(
                mapPoints
              );


            if (
              normalizedMapPoints.length < 3
            ) {

              const message =
                t("minimumThreePoints") ||
                "يجب تحديد ثلاث نقاط على الأقل";

              setError(message);

              return {
                valid: false,
                message,
              };

            }


            const center =
              calculateBoundaryCenter(
                normalizedMapPoints
              );


            if (!center) {

              const message =
                t("coordinatesRequired") ||
                "إحداثيات مركز الأرض غير صحيحة";

              setError(message);

              return {
                valid: false,
                message,
              };

            }


            return {
              valid: true,
              message: "",
            };

          }


          // =================================================
          // TEXT MODE
          // =================================================

          const textValues = [

            locationData.country,
            locationData.governorate,
            locationData.region,
            locationData.district,
            locationData.city,
            locationData.town,
            locationData.village,
            locationData.placeName,
            locationData.locationDescription,
            locationData.notes,

            locationData.north,
            locationData.south,
            locationData.east,
            locationData.west,

            locationData.northNeighbor,
            locationData.southNeighbor,
            locationData.eastNeighbor,
            locationData.westNeighbor,

          ];


          const hasTextData =
            textValues.some(
              value =>
                cleanString(
                  value
                ).length > 0
            );


          if (!hasTextData) {

            const message =
              t("locationTextRequired") ||
              "أدخل معلومات الموقع";

            setError(message);

            return {
              valid: false,
              message,
            };

          }


          return {
            valid: true,
            message: "",
          };

        }


        // ===================================================
        // OLD DIRECT VALIDATION
        // ===================================================

        if (!farmId) {

          const message =
            t("farmRequired") ||
            "اختر المزرعة أولًا";

          setError(message);

          return {
            valid: false,
            message,
          };

        }


        if (
          locationMode === "map"
        ) {

          const normalizedPoints =
            normalizePoints(
              points
            );


          if (
            normalizedPoints.length < 3
          ) {

            const message =
              t("minimumThreePoints") ||
              "يجب تحديد ثلاث نقاط على الأقل";

            setError(message);

            return {
              valid: false,
              message,
            };

          }


          const center =
            calculateBoundaryCenter(
              normalizedPoints
            );


          if (!center) {

            const message =
              t("coordinatesRequired") ||
              "إحداثيات مركز الأرض غير صحيحة";

            setError(message);

            return {
              valid: false,
              message,
            };

          }


          return {
            valid: true,
            message: "",
          };

        }


        const hasTextData = [

          country,
          governorate,
          region,
          district,
          city,
          town,
          village,
          placeName,
          locationDescription,
          notes,

          north,
          south,
          east,
          west,

          northNeighbor,
          southNeighbor,
          eastNeighbor,
          westNeighbor,

        ].some(
          value =>
            cleanString(
              value
            ).length > 0
        );


        if (!hasTextData) {

          const message =
            t("locationTextRequired") ||
            "أدخل معلومات الموقع";

          setError(message);

          return {
            valid: false,
            message,
          };

        }


        return {
          valid: true,
          message: "",
        };

      },
      [
        farmId,
        locationMode,
        points,
        country,
        governorate,
        region,
        district,
        city,
        town,
        village,
        placeName,
        locationDescription,
        notes,
        north,
        south,
        east,
        west,
        northNeighbor,
        southNeighbor,
        eastNeighbor,
        westNeighbor,
        t,
      ]
    );


  // =======================================================
  // ADD LOCATION
  // =======================================================

  const addLocation =
    useCallback(
      async (
        locationData = null
      ) => {

        if (
          !locationData ||
          typeof locationData !== "object"
        ) {

          const message =
            t("locationTextRequired") ||
            "لم تصل بيانات الموقع للحفظ";

          setError(message);

          alert(message);

          return false;

        }


        const validation =
          validateLocation(
            locationData
          );


        if (
          !validation.valid
        ) {

          alert(
            validation.message
          );

          return false;

        }


        let dataToSave = {
          ...locationData,
        };


        /*
        -----------------------------------------------------
        إذا كان المصدر خريطة:

        نعيد حساب المركز من الحدود.

        هذا يمنع أي قيمة قديمة من استبدال الإحداثيات
        الحقيقية الناتجة عن الحدود.
        -----------------------------------------------------
        */

        if (
          (
            locationData.source ||
            "text"
          ) === "map"
        ) {

          const mapPoints =
            normalizePoints(
              locationData.points ||
              locationData.boundary
            );


          const center =
            calculateBoundaryCenter(
              mapPoints
            );


          if (!center) {

            const message =
              t("coordinatesRequired") ||
              "تعذر حساب مركز الأرض";

            setError(message);

            alert(message);

            return false;

          }


          const calculatedArea =
            mapService.calculateArea(
              mapPoints
            );


          const calculatedPerimeter =
            mapService.calculatePerimeter(
              mapPoints
            );


          dataToSave = {

            ...dataToSave,

            points:
              mapPoints,

            boundary:
              mapPoints,

            latitude:
              center.latitude,

            longitude:
              center.longitude,

            area:
              Number.isFinite(
                Number(
                  locationData.area
                )
              )
                ? Number(
                    locationData.area
                  )
                : calculatedArea,

            perimeter:
              Number.isFinite(
                Number(
                  locationData.perimeter
                )
              )
                ? Number(
                    locationData.perimeter
                  )
                : calculatedPerimeter,

            source:
              "map",

          };

        }


        // ===================================================
        // SAFE DATA
        // ===================================================

        const safeData = {

          ...dataToSave,


          farmId:
            cleanString(
              dataToSave.farmId
            ),


          farmName:
            cleanString(
              dataToSave.farmName
            ),


          type:
            firstValue(
              dataToSave.type,
              "field"
            ),


          source:
            firstValue(
              dataToSave.source,
              "text"
            ),


          country:
            cleanString(
              dataToSave.country
            ),


          governorate:
            cleanString(
              dataToSave.governorate
            ),


          region:
            cleanString(
              firstValue(
                dataToSave.region,
                dataToSave.province
              )
            ),


          district:
            cleanString(
              dataToSave.district
            ),


          city:
            cleanString(
              dataToSave.city
            ),


          town:
            cleanString(
              dataToSave.town
            ),


          village:
            cleanString(
              dataToSave.village
            ),


          placeName:
            cleanString(
              dataToSave.placeName
            ),


          locationDescription:
            cleanString(
              firstValue(
                dataToSave.locationDescription,
                dataToSave.description
              )
            ),


          notes:
            cleanString(
              dataToSave.notes
            ),


          north:
            cleanString(
              firstValue(
                dataToSave.north,
                dataToSave.northNeighbor
              )
            ),


          south:
            cleanString(
              firstValue(
                dataToSave.south,
                dataToSave.southNeighbor
              )
            ),


          east:
            cleanString(
              firstValue(
                dataToSave.east,
                dataToSave.eastNeighbor
              )
            ),


          west:
            cleanString(
              firstValue(
                dataToSave.west,
                dataToSave.westNeighbor
              )
            ),


          northNeighbor:
            cleanString(
              firstValue(
                dataToSave.northNeighbor,
                dataToSave.north
              )
            ),


          southNeighbor:
            cleanString(
              firstValue(
                dataToSave.southNeighbor,
                dataToSave.south
              )
            ),


          eastNeighbor:
            cleanString(
              firstValue(
                dataToSave.eastNeighbor,
                dataToSave.east
              )
            ),


          westNeighbor:
            cleanString(
              firstValue(
                dataToSave.westNeighbor,
                dataToSave.west
              )
            ),


          points:
            normalizePoints(
              dataToSave.points
            ),


          boundary:
            normalizePoints(
              dataToSave.boundary ||
              dataToSave.points
            ),


          /*
          ---------------------------------------------------
          الإحداثيات الحقيقية.

          لا يتم أخذها من country/city/village.
          ---------------------------------------------------
          */

          latitude:
            validCoordinates(
              dataToSave.latitude,
              dataToSave.longitude
            )
              ? Number(
                  dataToSave.latitude
                )
              : null,


          longitude:
            validCoordinates(
              dataToSave.latitude,
              dataToSave.longitude
            )
              ? Number(
                  dataToSave.longitude
                )
              : null,


          area:
            Number.isFinite(
              Number(
                dataToSave.area
              )
            )
              ? Number(
                  dataToSave.area
                )
              : null,


          perimeter:
            Number.isFinite(
              Number(
                dataToSave.perimeter
              )
            )
              ? Number(
                  dataToSave.perimeter
                )
              : null,


          boundaryWidth:
            dataToSave.boundaryWidth !==
              null &&
            dataToSave.boundaryWidth !==
              undefined
              ? dataToSave.boundaryWidth
              : "",


          status:
            firstValue(
              dataToSave.status,
              "active"
            ),

        };


        /*
        -----------------------------------------------------
        يجب أن يكون الموقع الحقيقي موجودًا عند حفظ
        موقع الخريطة.
        -----------------------------------------------------
        */

        if (
          safeData.source === "map" &&
          !validCoordinates(
            safeData.latitude,
            safeData.longitude
          )
        ) {

          const message =
            t("coordinatesRequired") ||
            "إحداثيات الموقع غير صحيحة";

          setError(message);

          alert(message);

          return false;

        }


        /*
        -----------------------------------------------------
        جسر الموقع إلى Crops.

        يتم وضع النسخة الآمنة قبل عملية الحفظ حتى تبقى
        Crops قادرة على استرجاع آخر موقع حقيقي.
        -----------------------------------------------------
        */

        cacheMapLocation(
          safeData
        );


        try {

          setLoading(true);
          setError("");


          console.log(
            "Map location save payload:",
            safeData
          );


          const saved =
            await mapService.createLocation(
              safeData
            );


          if (!saved) {

            throw new Error(
              "MAP_SAVE_FAILED"
            );

          }


          setLocations(
            current => [
              ...current,
              saved,
            ]
          );


          /*
          ---------------------------------------------------
          النسخة النهائية التي تستلمها Crops.

          عند المصدر map:
          الأولوية للإحداثيات التي حسبناها من الحدود.
          ---------------------------------------------------
          */

          const finalLocation = {

            ...safeData,
            ...saved,

            latitude:
              validCoordinates(
                safeData.latitude,
                safeData.longitude
              )
                ? safeData.latitude
                : (
                    validCoordinates(
                      saved?.latitude,
                      saved?.longitude
                    )
                      ? Number(
                          saved.latitude
                        )
                      : null
                  ),

            longitude:
              validCoordinates(
                safeData.latitude,
                safeData.longitude
              )
                ? safeData.longitude
                : (
                    validCoordinates(
                      saved?.latitude,
                      saved?.longitude
                    )
                      ? Number(
                          saved.longitude
                        )
                      : null
                  ),

          };


          /*
          ---------------------------------------------------
          حفظ النسخة النهائية مرة ثانية.

          هذا هو الجسر النهائي:
          Map → localStorage → Crops
          ---------------------------------------------------
          */

          cacheMapLocation(
            finalLocation
          );


          resetLocation();


          alert(
            t("saveSuccess") ||
            "تم حفظ الموقع بنجاح"
          );


          return saved;

        } catch (saveError) {

          console.error(
            "Map location save failed:",
            saveError
          );


          const message =
            saveError?.message &&
            saveError.message !==
              "MAP_SAVE_FAILED"
              ? saveError.message
              : (
                t("saveError") ||
                "تعذر حفظ الموقع"
              );


          setError(message);

          alert(message);

          return false;

        } finally {

          setLoading(false);

        }

      },
      [
        validateLocation,
        resetLocation,
        t,
      ]
    );


  // =======================================================
  // SAVE MAP LOCATION
  // =======================================================

  const saveMapLocation =
    useCallback(
      async (
        options = {}
      ) => {

        const locationData =
          await buildMapLocationData(
            options
          );


        if (!locationData) {

          return false;

        }


        return addLocation(
          locationData
        );

      },
      [
        buildMapLocationData,
        addLocation,
      ]
    );


  // =======================================================
  // DELETE LOCATION
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
                item =>
                  String(
                    item?.id
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


    // TYPE / MODE

    locationType,
    setLocationType,

    locationMode,
    setLocationMode,


    // ADMINISTRATIVE LOCATION

    country,
    setCountry,

    governorate,
    setGovernorate,

    region,
    setRegion,

    district,
    setDistrict,

    city,
    setCity,

    town,
    setTown,

    village,
    setVillage,

    placeName,
    setPlaceName,

    locationDescription,
    setLocationDescription,

    notes,
    setNotes,


    // DIRECTIONS

    north,
    setNorth,

    south,
    setSouth,

    east,
    setEast,

    west,
    setWest,

    northNeighbor,
    setNorthNeighbor,

    southNeighbor,
    setSouthNeighbor,

    eastNeighbor,
    setEastNeighbor,

    westNeighbor,
    setWestNeighbor,


    // COORDINATES

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    setCoordinates,


    // BOUNDARY

    points,
    setPoints,

    selectMapPoint,
    setMapCenter,
    removeLastPoint,
    clearPoints,


    // MEASUREMENTS

    area,
    setArea,

    perimeter,
    setPerimeter,

    boundaryWidth,
    setBoundaryWidth,

    setMeasurements,


    // MAP INFORMATION

    loadNearbyPlaces,
    reverseGeocode,
    applyGeocodedLocation,


    // LOCATION PIPELINE

    calculateBoundaryCenter,
    buildMapLocationData,
    finalizeMapLocation,
    saveMapLocation,


    // CRUD / VALIDATION

    validateLocation,
    addLocation,
    deleteLocation,
    resetLocation,


    // HELPERS

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
