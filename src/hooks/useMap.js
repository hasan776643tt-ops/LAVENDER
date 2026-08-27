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

وظيفة هذا Hook:

1. تحميل المزارع والمواقع المحفوظة.
2. دعم تحديد موقع الأرض يدويًا على الخريطة.
3. دعم إدخال الموقع كتابيًا.
4. دعم رسم حدود الأرض بالنقاط.
5. دعم حساب المساحة والمحيط.
6. تحميل القرى والبلدات والطرق والمعالم القريبة.
7. دعم الملاحظات:
   - شمال
   - جنوب
   - شرق
   - غرب
8. حفظ بيانات الموقع.

مبدأ مهم:

GPS / الخريطة لا تستبدل وصف المستخدم للموقع.

الإحداثيات الحقيقية تبقى إحداثيات الموقع المحدد.

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
  // FORM
  // =========================================================

  const [
    farmId,
    setFarmId,
  ] = useState("");


  const [
    locationType,
    setLocationType,
  ] = useState("farm");


  /*
  text
  map
  */

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


        /*
        أول نقطة تصبح مركز الموقع.

        لكننا لا نحذف بقية النقاط؛
        لأنها تمثل حدود الأرض.
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


            /*
            إذا لم يبق أي نقطة،
            نمسح المركز أيضًا.
            */

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
  // APPLY REVERSE GEOCODING TO FORM
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

  const validateLocation =
    useCallback(
      () => {

        setError("");


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


        // ---------------------------------------------------
        // MAP MODE
        // ---------------------------------------------------

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


        // ---------------------------------------------------
        // TEXT MODE
        // ---------------------------------------------------

        const hasTextData =

          country.trim() ||

          region.trim() ||

          village.trim() ||

          placeName.trim() ||

          locationDescription.trim() ||

          notes.trim() ||

          north.trim() ||

          south.trim() ||

          east.trim() ||

          west.trim();


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
  // ADD LOCATION
  // =========================================================

  const addLocation =
    useCallback(
      async () => {

        const validation =
          validateLocation();


        if (!validation.valid) {

          alert(
            validation.message
          );

          return false;

        }


        const farm =
          farms.find(
            item =>
              String(item.id) ===
              String(farmId)
          );


        /*
        إذا كانت الخريطة مستخدمة:
        أول نقطة هي مركز الأرض.

        أما الوضع النصي:
        لا نفرض إحداثيات غير موجودة.
        */

        const center =
          points.length > 0
            ? points[0]
            : null;


        const data = {

          farmId:
            String(
              farmId
            ),


          farmName:
            farm?.name ||
            "",


          type:
            locationType,


          source:
            locationMode,


          country:
            country.trim(),


          region:
            region.trim(),


          village:
            village.trim(),


          placeName:
            placeName.trim(),


          locationDescription:
            locationDescription.trim(),


          notes:
            notes.trim(),


          north:
            north.trim(),


          south:
            south.trim(),


          east:
            east.trim(),


          west:
            west.trim(),


          /*
          الإحداثيات اختيارية في الوضع النصي.
          */

          latitude:
            center
              ? center.latitude
              : validCoordinates(
                  latitude,
                  longitude
                )
                ? Number(latitude)
                : null,


          longitude:
            center
              ? center.longitude
              : validCoordinates(
                  latitude,
                  longitude
                )
                ? Number(longitude)
                : null,


          points: [
            ...points,
          ],


          area,

          perimeter,

          boundaryWidth,


          status:
            "active",

        };


        try {

          setLoading(true);


          const saved =
            await mapService.createLocation(
              data
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
            t("saveError") ||
            "تعذر حفظ الموقع";

          setError(message);

          alert(message);

          return false;

        } finally {

          setLoading(false);

        }

      },
      [
        validateLocation,
        farms,
        farmId,
        locationType,
        locationMode,
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
        latitude,
        longitude,
        points,
        area,
        perimeter,
        boundaryWidth,
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
  // RETURN
  // =========================================================

  return {

    // -------------------------------------------------------
    // DATA
    // -------------------------------------------------------

    farms,

    locations,

    nearbyPlaces,


    // -------------------------------------------------------
    // FARM
    // -------------------------------------------------------

    farmId,

    setFarmId,


    // -------------------------------------------------------
    // TYPE / MODE
    // -------------------------------------------------------

    locationType,

    setLocationType,


    locationMode,

    setLocationMode,


    // -------------------------------------------------------
    // TEXT LOCATION
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // DIRECTIONS
    // -------------------------------------------------------

    north,

    setNorth,


    south,

    setSouth,


    east,

    setEast,


    west,

    setWest,


    // -------------------------------------------------------
    // COORDINATES
    // -------------------------------------------------------

    latitude,

    setLatitude,


    longitude,

    setLongitude,


    setCoordinates,


    // -------------------------------------------------------
    // FIELD BOUNDARY
    // -------------------------------------------------------

    points,

    setPoints,


    selectMapPoint,

    setMapCenter,

    removeLastPoint,

    clearPoints,


    // -------------------------------------------------------
    // MEASUREMENTS
    // -------------------------------------------------------

    area,

    setArea,


    perimeter,

    setPerimeter,


    boundaryWidth,

    setBoundaryWidth,


    setMeasurements,


    // -------------------------------------------------------
    // MAP INFORMATION
    // -------------------------------------------------------

    loadNearbyPlaces,

    reverseGeocode,

    applyGeocodedLocation,


    // -------------------------------------------------------
    // VALIDATION / CRUD
    // -------------------------------------------------------

    validateLocation,

    addLocation,

    deleteLocation,

    resetLocation,


    // -------------------------------------------------------
    // STATE
    // -------------------------------------------------------

    loading,

    mapLoading,

    error,


    // -------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------

    DEFAULT_POSITION,

    EMPTY_FIELD,

  };

}
