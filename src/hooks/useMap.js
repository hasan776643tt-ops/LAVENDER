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

مسؤول عن:

1. تحميل المزارع.
2. تحميل المواقع المحفوظة.
3. حفظ موقع الأرض.
4. حذف موقع الأرض.
5. دعم بيانات الموقع النصية.
6. دعم إحداثيات GPS.
7. دعم نقاط حدود الأرض.
8. دعم حساب المساحة والمحيط.
9. دعم معلومات الخريطة.

مهم:

Map.jsx هو المسؤول عن واجهة النموذج والخريطة.

useMap.js هو طبقة البيانات والحفظ.

لذلك:

Map.jsx
   ↓
addLocation(locationData)
   ↓
useMap.js
   ↓
mapService
   ↓
mapRepository
   ↓
الحفظ
===========================================================
*/


const DEFAULT_POSITION = [
  36.7,
  38.7,
];


const EMPTY_FIELD = Object.freeze({

  country: "",

  region: "",

  village: "",

  placeName: "",

  locationDescription: "",

  notes: "",

  north: "",

  south: "",

  east: "",

  west: "",

  points: [],

  latitude: "",

  longitude: "",

  area: null,

  perimeter: null,

  boundaryWidth: "",

});


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


export default function useMap() {


  // =========================================================
  // SETTINGS
  // =========================================================

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


  // =========================================================
  // DATA
  // =========================================================

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


  // =========================================================
  // FORM STATE
  // =========================================================

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


  // =========================================================
  // TEXT LOCATION
  // =========================================================

  const [
    country,
    setCountry,
  ] = useState("");


  const [
    region,
    setRegion,
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


  // =========================================================
  // DIRECTIONS
  // =========================================================

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


  // =========================================================
  // COORDINATES
  // =========================================================

  const [
    latitude,
    setLatitude,
  ] = useState("");


  const [
    longitude,
    setLongitude,
  ] = useState("");


  // =========================================================
  // FIELD BOUNDARY
  // =========================================================

  const [
    points,
    setPoints,
  ] = useState([]);


  // =========================================================
  // MEASUREMENTS
  // =========================================================

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


  // =========================================================
  // STATE
  // =========================================================

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


  // =========================================================
  // LOAD INITIAL DATA
  // =========================================================

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


  // =========================================================
  // SELECT MAP POINT
  // =========================================================

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


  // =========================================================
  // SET MAP CENTER
  // =========================================================

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


  // =========================================================
  // SET COORDINATES DIRECTLY
  // =========================================================

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


  // =========================================================
  // REMOVE LAST POINT
  // =========================================================

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

              const first =
                next[0];


              setLatitude(
                first.latitude
              );


              setLongitude(
                first.longitude
              );

            }


            return next;

          }
        );

      },
      []
    );


  // =========================================================
  // CLEAR MAP POINTS
  // =========================================================

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


  // =========================================================
  // LOAD NEARBY PLACES
  // =========================================================

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


  // =========================================================
  // REVERSE GEOCODING
  // =========================================================

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


  // =========================================================
  // APPLY REVERSE GEOCODING
  // =========================================================

  const applyGeocodedLocation =
    useCallback(
      result => {

        if (!result) {
          return false;
        }


        setCountry(
          result.country ||
          ""
        );


        setRegion(
          result.region ||
          ""
        );


        setVillage(
          result.village ||
          result.town ||
          result.city ||
          ""
        );


        setPlaceName(
          result.placeName ||
          result.nearestPlace ||
          ""
        );


        setLocationDescription(
          result.displayName ||
          ""
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


  // =========================================================
  // MEASUREMENTS
  // =========================================================

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


  // =========================================================
  // VALIDATE FORM
  // =========================================================
  //
  // مهم:
  //
  // Map.jsx يبني locationData بنفسه.
  //
  // لذلك عند الحفظ سنقوم بالتحقق من locationData
  // المرسل فعليًا بدل الاعتماد على حالات Hook
  // التي لا يتم تعبئتها من Map.jsx.
  //
  // =========================================================

  const validateLocation =
    useCallback(
      (locationData = null) => {

        setError("");


        /*
        -------------------------------------------------------
        إذا وصلت بيانات من Map.jsx
        نتحقق من البيانات المرسلة مباشرة.
        -------------------------------------------------------
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
          -----------------------------------------------------
          MAP MODE
          -----------------------------------------------------
          */

          if (
            mode === "map"
          ) {

            const mapPoints =
              Array.isArray(
                locationData.points
              )
                ? locationData.points
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


            return {
              valid: true,
              message: "",
            };

          }


          /*
          -----------------------------------------------------
          TEXT MODE
          -----------------------------------------------------
          */

          const textValues = [

            locationData.country,

            locationData.region,

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
                String(
                  value ?? ""
                ).trim().length > 0
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
        -------------------------------------------------------
        التحقق القديم عند استخدام Hook مباشرة
        -------------------------------------------------------
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

          region,

          village,

          placeName,

          locationDescription,

          notes,

          north,

          south,

          east,

          west,

        ].some(
          value =>
            String(
              value ?? ""
            ).trim().length > 0
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
        region,
        village,
        placeName,
        locationDescription,
        notes,
        north,
        south,
        east,
        west,
        t,
      ]
    );


  // =========================================================
  // RESET
  // =========================================================

  const resetLocation =
    useCallback(
      () => {

        setFarmId("");

        setLocationType("farm");

        setLocationMode("text");


        setCountry("");

        setRegion("");

        setVillage("");

        setPlaceName("");

        setLocationDescription("");

        setNotes("");


        setNorth("");

        setSouth("");

        setEast("");

        setWest("");


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


  // =========================================================
  // ADD LOCATION
  // =========================================================
  //
  // التعديل الأساسي:
  //
  // addLocation(locationData)
  //
  // أصبح يستقبل البيانات التي يرسلها Map.jsx.
  //
  // =========================================================

  const addLocation =
    useCallback(
      async (
        locationData = null
      ) => {

        /*
        -------------------------------------------------------
        يجب أن تصل البيانات من Map.jsx.
        -------------------------------------------------------
        */

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
        -------------------------------------------------------
        التحقق من البيانات نفسها.
        -------------------------------------------------------
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
        -------------------------------------------------------
        تجهيز نسخة آمنة من البيانات.
        -------------------------------------------------------
        */

        const data = {

          ...locationData,


          farmId:
            String(
              locationData.farmId
            ),


          farmName:
            String(
              locationData.farmName ||
              ""
            ).trim(),


          type:
            locationData.type ||
            "field",


          source:
            locationData.source ||
            "text",


          country:
            String(
              locationData.country ||
              ""
            ).trim(),


          region:
            String(
              locationData.region ||
              locationData.province ||
              ""
            ).trim(),


          city:
            String(
              locationData.city ||
              ""
            ).trim(),


          town:
            String(
              locationData.town ||
              locationData.village ||
              ""
            ).trim(),


          village:
            String(
              locationData.village ||
              locationData.town ||
              ""
            ).trim(),


          placeName:
            String(
              locationData.placeName ||
              ""
            ).trim(),


          locationDescription:
            String(
              locationData.locationDescription ||
              locationData.description ||
              ""
            ).trim(),


          notes:
            String(
              locationData.notes ||
              ""
            ).trim(),


          north:
            String(
              locationData.north ||
              locationData.northNeighbor ||
              ""
            ).trim(),


          south:
            String(
              locationData.south ||
              locationData.southNeighbor ||
              ""
            ).trim(),


          east:
            String(
              locationData.east ||
              locationData.eastNeighbor ||
              ""
            ).trim(),


          west:
            String(
              locationData.west ||
              locationData.westNeighbor ||
              ""
            ).trim(),


          northNeighbor:
            String(
              locationData.northNeighbor ||
              locationData.north ||
              ""
            ).trim(),


          southNeighbor:
            String(
              locationData.southNeighbor ||
              locationData.south ||
              ""
            ).trim(),


          eastNeighbor:
            String(
              locationData.eastNeighbor ||
              locationData.east ||
              ""
            ).trim(),


          westNeighbor:
            String(
              locationData.westNeighbor ||
              locationData.west ||
              ""
            ).trim(),


          points:
            Array.isArray(
              locationData.points
            )
              ? locationData.points.map(
                  point => {

                    if (
                      Array.isArray(
                        point
                      )
                    ) {

                      return {

                        latitude:
                          Number(
                            point[0]
                          ),

                        longitude:
                          Number(
                            point[1]
                          ),

                      };

                    }


                    return {

                      latitude:
                        Number(
                          point?.latitude
                        ),

                      longitude:
                        Number(
                          point?.longitude
                        ),

                    };

                  }
                )
              : [],


          latitude:
            validCoordinates(
              locationData.latitude,
              locationData.longitude
            )
              ? Number(
                  locationData.latitude
                )
              : null,


          longitude:
            validCoordinates(
              locationData.latitude,
              locationData.longitude
            )
              ? Number(
                  locationData.longitude
                )
              : null,


          area:
            Number.isFinite(
              Number(
                locationData.area
              )
            )
              ? Number(
                  locationData.area
                )
              : null,


          perimeter:
            Number.isFinite(
              Number(
                locationData.perimeter
              )
            )
              ? Number(
                  locationData.perimeter
                )
              : null,


          boundaryWidth:
            locationData.boundaryWidth ??
            "",


          status:
            locationData.status ||
            "active",

        };


        /*
        -------------------------------------------------------
        الحفظ الفعلي.
        -------------------------------------------------------
        */

        try {

          setLoading(true);

          setError("");


          console.log(
            "Map location save payload:",
            data
          );


          const saved =
            await mapService.createLocation(
              data
            );


          if (!saved) {

            throw new Error(
              "MAP_SAVE_FAILED"
            );

          }


          /*
          -----------------------------------------------------
          تحديث القائمة مباشرة بعد نجاح الحفظ.
          -----------------------------------------------------
          */

          setLocations(
            current => [
              ...current,
              saved,
            ]
          );


          /*
          -----------------------------------------------------
          إعادة النموذج إلى الحالة الفارغة.
          -----------------------------------------------------
          */

          resetLocation();


          alert(
            t("saveSuccess") ||
            "تم حفظ الموقع بنجاح"
          );


          return true;

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


  // =========================================================
  // DELETE LOCATION
  // =========================================================

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
                  String(item.id) !==
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


  // =========================================================
  // RETURN
  // =========================================================

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


    // TEXT LOCATION

    country,

    setCountry,

    region,

    setRegion,

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


    // COORDINATES

    latitude,

    setLatitude,

    longitude,

    setLongitude,

    setCoordinates,


    // FIELD BOUNDARY

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


    // VALIDATION / CRUD

    validateLocation,

    addLocation,

    deleteLocation,

    resetLocation,


    // STATE

    loading,

    mapLoading,

    error,


    // CONSTANTS

    DEFAULT_POSITION,

    EMPTY_FIELD,

  };

}
