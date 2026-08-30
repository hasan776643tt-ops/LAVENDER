// src/hooks/useMap.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import mapService
  from "../services/mapService.js";

import farmService
  from "../services/farmService.js";

import {
  translate,
} from "../utils/translation";

import {
  useSettings,
} from "../context/SettingsContext";


/*
===========================================================
LAVENDER — useMap
===========================================================

المسؤوليات:

1. تحميل المزارع.
2. تحميل المواقع المحفوظة.
3. تحديد نقاط الأرض.
4. حساب مركز الأرض.
5. حساب المساحة والمحيط.
6. Reverse Geocoding لمركز الأرض.
7. استخراج:
   - country
   - governorate
   - region
   - district
   - city
   - town
   - village
8. بناء LocationData موحد.
9. حفظ LocationData من خلال mapService فقط.
10. إتاحة LocationData للمحاصيل.
11. دعم GPS والإحداثيات.
12. دعم الوضع النصي القديم.
13. دعم الأماكن القريبة.
14. تحديث وحذف المواقع.

الطبقات:

Map.jsx
   ↓
useMap.js
   ↓
mapService.js
   ↓
mapRepository.js
   ↓
storage / DataModel

مهم:

لا يوجد أي منطق خاص بالمحاصيل هنا.
useMap مسؤول عن الموقع فقط.
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
// HELPERS
// =========================================================

function cleanString(value) {

  return String(
    value ?? ""
  ).trim();

}


function finiteNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;

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
        validCoordinates(
          point.latitude,
          point.longitude
        )
    );

}


/*
===========================================================
حساب مركز المضلع

نستخدم متوسط الإحداثيات كطريقة مستقرة وبسيطة
لمركز الأرض بالنسبة لتحديدات المزارع المعتادة.

المهم:

المركز محسوب من نقاط الأرض نفسها.
لا يتم أخذه من اسم القرية أو المدينة.
===========================================================
*/

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
===========================================================
استخراج الحقول الإدارية من نتيجة Reverse Geocoding

mapService يعيد:
country / region / city / town / village

لكن بعض مزودي الخرائط يضعون المحافظة والمنطقة
في حقول مختلفة داخل address.

لذلك نحتفظ بكل الاحتمالات دون الاعتماد على اسم واحد فقط.
===========================================================
*/

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
      result.governorate ||
      result.state ||
      address.state ||
      address.province ||
      address.governorate ||
      ""
    );


  const region =
    cleanString(
      result.region ||
      address.region ||
      address.province ||
      address.state_district ||
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


  /*
  ---------------------------------------------------------
  الترتيب:

  القرية ← البلدة ← المدينة

  لكننا لا ننسخ البلدة إلى القرية إذا كانت القرية
  موجودة أصلًا.
  ---------------------------------------------------------
  */

  const resolvedVillage =
    village ||
    town ||
    city;


  const resolvedTown =
    town ||
    village ||
    city;


  const placeName =
    cleanString(
      result.placeName ||
      result.nearestPlace ||
      result.name ||
      address.road ||
      ""
    );


  return {

    country:
      cleanString(
        result.country ||
        address.country ||
        ""
      ),

    governorate,

    region,

    district,

    city,

    town:
      resolvedTown,

    village:
      resolvedVillage,

    placeName,

    displayName:
      cleanString(
        result.displayName ||
        ""
      ),

    road:
      cleanString(
        result.road ||
        address.road ||
        ""
      ),

  };

}


/*
===========================================================
قراءة آخر LocationData محفوظ

هذه ليست مصدرًا بديلًا للموقع.
هي فقط وسيلة تجعل Crops أو أي شاشة أخرى
تستطيع استلام آخر موقع محفوظ.

المصدر الحقيقي للموقع عند الخريطة:
latitude / longitude / boundary
===========================================================
*/

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

      // تجاهل السجل غير الصالح
      // وانتقل إلى المفتاح التالي.

    }

  }


  return null;

}


/*
===========================================================
حفظ LocationData للواجهات التي تحتاج استلام الموقع
===========================================================

هذا لا يستبدل mapRepository.

الحفظ الأساسي:

mapService → mapRepository

أما localStorage هنا فهو جسر اختيار الموقع بين Map وCrops
عندما تكون الواجهة تعمل بهذا النمط في المشروع الحالي.
===========================================================
*/

function cacheMapLocation(
  location
) {

  if (
    typeof window === "undefined" ||
    !location ||
    typeof location !== "object"
  ) {

    return;

  }


  try {

    const serialized =
      JSON.stringify(
        location
      );


    window.localStorage.setItem(
      "mapLocation",
      serialized
    );


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
  // FORM STATE
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
  // FIELD BOUNDARY
  // =======================================================

  const [
    points,
    setPoints,
  ] = useState([]);


  // =======================================================
  // MEASUREMENTS
  // =======================================================

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
  // LOAD INITIAL DATA
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
          Array.isArray(
            farmsData
          )
            ? farmsData
            : []
        );


        setLocations(
          Array.isArray(
            locationsData
          )
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

          const message =
            t("coordinatesRequired") ||
            "إحداثيات الموقع غير صحيحة";

          setError(message);

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


        /*
        -----------------------------------------------------
        لا نعتبر النقطة الأولى مركز الأرض النهائي.
        هي فقط مركز أولي للواجهة.
        المركز النهائي يحسب عند إنهاء الحدود.
        -----------------------------------------------------
        */

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
  // SET MAP CENTER
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
  // SET COORDINATES
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
  // CLEAR MAP POINTS
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
  // LOAD NEARBY PLACES
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
            Array.isArray(
              places
            )
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


          const result =
            await mapService.reverseGeocode(
              selectedLatitude,
              selectedLongitude,
              language
            );


          return result;

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
        area:
          calculatedArea = null,

        perimeter:
          calculatedPerimeter = null,

        boundaryWidth:
          calculatedBoundaryWidth = null,

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
  // BUILD MAP LOCATION DATA
  // =======================================================
  //
  // هذه هي الدالة الجديدة الأساسية.
  //
  // لا تحفظ.
  //
  // فقط تبني LocationData موحدًا من:
  //
  // boundary
  // center
  // geocoding
  // farm
  //
  // ثم يمكن تمرير الناتج إلى addLocation().
  //
  // =======================================================

  const buildMapLocationData =
    useCallback(
      async (
        options = {}
      ) => {

        const selectedFarmId =
          options.farmId ||
          farmId;


        if (!selectedFarmId) {

          const message =
            t("farmRequired") ||
            "اختر المزرعة أولًا";

          setError(message);

          return null;

        }


        const mapPoints =
          normalizePoints(
            options.points ??
            points
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


        /*
        -----------------------------------------------------
        1. حساب مركز الأرض الحقيقي.
        -----------------------------------------------------
        */

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

          /*
          ---------------------------------------------------
          2. حساب المساحة والمحيط من الحدود نفسها.
          ---------------------------------------------------
          */

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
          3. Reverse Geocoding لمركز الأرض.

          مهم جدًا:

          نرسل مركز الأرض،
          وليس اسم القرية،
          وليس أول نقطة،
          وليس موقعًا نصيًا.
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


          /*
          ---------------------------------------------------
          4. اسم المزرعة إن توفر.
          ---------------------------------------------------
          */

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


          /*
          ---------------------------------------------------
          5. LocationData واحد.
          ---------------------------------------------------
          */

          const locationData = {

            farmId:
              String(
                selectedFarmId
              ),


            farmName:
              cleanString(
                options.farmName ||
                selectedFarm?.name ||
                ""
              ),


            type:
              options.type ||
              "field",


            source:
              "map",


            /*
            المركز الحقيقي للأرض
            */

            latitude:
              center.latitude,

            longitude:
              center.longitude,


            /*
            حدود الأرض
            */

            points:
              mapPoints,


            boundary:
              mapPoints,


            /*
            القياسات
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
              options.boundaryWidth ??
              boundaryWidth ??
              "",


            /*
            -----------------------------------------------
            الموقع الإداري
            -----------------------------------------------
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
            -----------------------------------------------
            الاتجاهات
            -----------------------------------------------
            */

            north:
              cleanString(
                options.north ??
                northNeighbor ||
                north
              ),


            south:
              cleanString(
                options.south ??
                southNeighbor ||
                south
              ),


            east:
              cleanString(
                options.east ??
                eastNeighbor ||
                east
              ),


            west:
              cleanString(
                options.west ??
                westNeighbor ||
                west
              ),


            northNeighbor:
              cleanString(
                options.northNeighbor ??
                northNeighbor ||
                north
              ),


            southNeighbor:
              cleanString(
                options.southNeighbor ??
                southNeighbor ||
                south
              ),


            eastNeighbor:
              cleanString(
                options.eastNeighbor ??
                eastNeighbor ||
                east
              ),


            westNeighbor:
              cleanString(
                options.westNeighbor ??
                westNeighbor ||
                west
              ),


            notes:
              cleanString(
                options.notes ??
                notes
              ),


            status:
              options.status ||
              "active",


            createdAt:
              options.createdAt ||
              new Date().toISOString(),

          };


          /*
          ---------------------------------------------------
          6. تحديث حالة Hook.
          ---------------------------------------------------
          */

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
          7. تخزين نسخة موحدة حتى تستلمها Crops.
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
  // FINALIZE MAP LOCATION
  // =======================================================
  //
  // دالة مريحة لـ Map.jsx:
  //
  // تحديد الحدود
  // ↓
  // حساب المركز
  // ↓
  // Reverse Geocoding
  // ↓
  // بناء LocationData
  //
  // ولا تحفظ في قاعدة البيانات.
  //
  // الحفظ يبقى مسؤولية addLocation().
  //
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
  // VALIDATE FORM
  // =======================================================

  const validateLocation =
    useCallback(
      (locationData = null) => {

        setError("");


        /*
        -----------------------------------------------------
        إذا وصلت LocationData من Map.jsx
        -----------------------------------------------------
        */

        if (locationData) {

          if (
            !locationData.farmId
          ) {

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


          /*
          ---------------------------------------------------
          MAP MODE
          ---------------------------------------------------
          */

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


            if (
              mapPoints.length < 3
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


            if (
              !validCoordinates(
                locationData.latitude,
                locationData.longitude
              )
            ) {

              const center =
                calculateBoundaryCenter(
                  mapPoints
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

            }


            return {

              valid: true,

              message: "",

            };

          }


          /*
          ---------------------------------------------------
          TEXT MODE — محفوظ للتوافق مع النظام القديم.
          ---------------------------------------------------
          */

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


        /*
        -----------------------------------------------------
        التحقق القديم عند استدعاء Hook مباشرة.
        -----------------------------------------------------
        */

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

          if (
            points.length < 3
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
        points.length,
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
  //
  // الحفظ الفعلي:
  //
  // useMap
  // ↓
  // mapService
  // ↓
  // mapRepository
  //
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


        /*
        -----------------------------------------------------
        التحقق من البيانات.
        -----------------------------------------------------
        */

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


        /*
        -----------------------------------------------------
        إذا كان المصدر خريطة:
        نتأكد أن المركز موجود.
        -----------------------------------------------------
        */

        let dataToSave = {

          ...locationData,

        };


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
                : mapService.calculateArea(
                    mapPoints
                  ),

            perimeter:
              Number.isFinite(
                Number(
                  locationData.perimeter
                )
              )
                ? Number(
                    locationData.perimeter
                  )
                : mapService.calculatePerimeter(
                    mapPoints
                  ),

            source:
              "map",

          };

        }


        /*
        -----------------------------------------------------
        تجهيز نسخة آمنة.
        -----------------------------------------------------
        */

        const safeData = {

          ...dataToSave,


          farmId:
            String(
              dataToSave.farmId
            ),


          farmName:
            cleanString(
              dataToSave.farmName
            ),


          type:
            dataToSave.type ||
            "field",


          source:
            dataToSave.source ||
            "text",


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
              dataToSave.region ||
              dataToSave.province
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
              dataToSave.locationDescription ||
              dataToSave.description
            ),


          notes:
            cleanString(
              dataToSave.notes
            ),


          north:
            cleanString(
              dataToSave.north ||
              dataToSave.northNeighbor
            ),


          south:
            cleanString(
              dataToSave.south ||
              dataToSave.southNeighbor
            ),


          east:
            cleanString(
              dataToSave.east ||
              dataToSave.eastNeighbor
            ),


          west:
            cleanString(
              dataToSave.west ||
              dataToSave.westNeighbor
            ),


          northNeighbor:
            cleanString(
              dataToSave.northNeighbor ||
              dataToSave.north
            ),


          southNeighbor:
            cleanString(
              dataToSave.southNeighbor ||
              dataToSave.south
            ),


          eastNeighbor:
            cleanString(
              dataToSave.eastNeighbor ||
              dataToSave.east
            ),


          westNeighbor:
            cleanString(
              dataToSave.westNeighbor ||
              dataToSave.west
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
            dataToSave.boundaryWidth ??
            "",


          status:
            dataToSave.status ||
            "active",

        };


        /*
        -----------------------------------------------------
        حفظ نسخة الاختيار التي ستستلمها Crops.
        -----------------------------------------------------
        */

        cacheMapLocation(
          safeData
        );


        /*
        -----------------------------------------------------
        الحفظ الأساسي.
        -----------------------------------------------------
        */

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


          /*
          ---------------------------------------------------
          تحديث القائمة.
          ---------------------------------------------------
          */

          setLocations(
            current => [

              ...current,

              saved,

            ]
          );


          /*
          ---------------------------------------------------
          حفظ النسخة النهائية التي يمكن لـ Crops قراءتها.
          ---------------------------------------------------
          */

          cacheMapLocation(
            {
              ...safeData,

              ...saved,

              /*
              لا نسمح للسجل المحفوظ أن يبدل
              مركز الأرض الصحيح إذا لم يكن موجودًا.
              */

              latitude:
                validCoordinates(
                  safeData.latitude,
                  safeData.longitude
                )
                  ? safeData.latitude
                  : saved?.latitude ??
                    null,

              longitude:
                validCoordinates(
                  safeData.latitude,
                  safeData.longitude
                )
                  ? safeData.longitude
                  : saved?.longitude ??
                    null,

            }
          );


          /*
          ---------------------------------------------------
          إعادة الحالة القديمة.
          ---------------------------------------------------
          */

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
  // SAVE MAP LOCATION DIRECTLY
  // =======================================================
  //
  // اختصار اختياري:
  //
  // finalizeMapLocation
  // ↓
  // addLocation
  //
  // يفيد Map.jsx إذا أردنا تنفيذ العملية كاملة بضغطة واحدة.
  //
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
                    item.id
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
  // RETURN
  // =======================================================

  return {

    // =====================================================
    // DATA
    // =====================================================

    farms,

    locations,

    nearbyPlaces,


    // =====================================================
    // FARM
    // =====================================================

    farmId,

    setFarmId,


    // =====================================================
    // TYPE / MODE
    // =====================================================

    locationType,

    setLocationType,

    locationMode,

    setLocationMode,


    // =====================================================
    // ADMINISTRATIVE LOCATION
    // =====================================================

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


    // =====================================================
    // DIRECTIONS
    // =====================================================

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


    // =====================================================
    // COORDINATES
    // =====================================================

    latitude,

    setLatitude,

    longitude,

    setLongitude,

    setCoordinates,


    // =====================================================
    // FIELD BOUNDARY
    // =====================================================

    points,

    setPoints,

    selectMapPoint,

    setMapCenter,

    removeLastPoint,

    clearPoints,


    // =====================================================
    // MEASUREMENTS
    // =====================================================

    area,

    setArea,

    perimeter,

    setPerimeter,

    boundaryWidth,

    setBoundaryWidth,

    setMeasurements,


    // =====================================================
    // MAP INFORMATION
    // =====================================================

    loadNearbyPlaces,

    reverseGeocode,

    applyGeocodedLocation,


    // =====================================================
    // LOCATION PIPELINE
    // =====================================================

    calculateBoundaryCenter,

    buildMapLocationData,

    finalizeMapLocation,

    saveMapLocation,


    // =====================================================
    // CRUD / VALIDATION
    // =====================================================

    validateLocation,

    addLocation,

    deleteLocation,

    resetLocation,


    // =====================================================
    // HELPERS
    // =====================================================

    readSavedMapLocation,


    // =====================================================
    // STATE
    // =====================================================

    loading,

    mapLoading,

    error,


    // =====================================================
    // CONSTANTS
    // =====================================================

    DEFAULT_POSITION,

    EMPTY_FIELD,

  };

}
