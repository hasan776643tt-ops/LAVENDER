// src/hooks/useMap.js

import {
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


// =========================================================
// DEFAULT MAP POSITION
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];


// =========================================================
// EMPTY FIELD
// =========================================================

const EMPTY_FIELD = Object.freeze({

  country: "",

  region: "",

  village: "",

  locationDescription: "",

  notes: "",

  points: [],

  latitude: "",

  longitude: "",

  area: null,

  perimeter: null,

  boundaryWidth: null,

});


// =========================================================
// HELPERS
// =========================================================

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


// =========================================================
// MAP HOOK
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


  // =======================================================
  // TRANSLATION
  // =======================================================

  const t =
    (key) =>
      translate(
        `map.${key}`,
        language
      );


  // =======================================================
  // FARMS
  // =======================================================

  const [
    farms,
    setFarms,
  ] = useState([]);


  // =======================================================
  // SAVED LOCATIONS
  // =======================================================

  const [
    locations,
    setLocations,
  ] = useState([]);


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const [
    farmId,
    setFarmId,
  ] = useState("");


  // =======================================================
  // LOCATION TYPE
  // =======================================================

  const [
    locationType,
    setLocationType,
  ] = useState("farm");


  // =======================================================
  // LOCATION METHOD
  //
  // text   = كتابة الموقع
  // map    = تحديد الأرض على الخريطة
  // =======================================================

  const [
    locationMode,
    setLocationMode,
  ] = useState("text");


  // =======================================================
  // COUNTRY
  // =======================================================

  const [
    country,
    setCountry,
  ] = useState("");


  // =======================================================
  // REGION / GOVERNORATE
  // =======================================================

  const [
    region,
    setRegion,
  ] = useState("");


  // =======================================================
  // VILLAGE / TOWN
  // =======================================================

  const [
    village,
    setVillage,
  ] = useState("");


  // =======================================================
  // LOCATION DESCRIPTION
  //
  // Example:
  // يمين الأرض طريق زراعي
  // يسار الأرض منزل فلان
  // الأرض في الحارة الغربية
  // =======================================================

  const [
    locationDescription,
    setLocationDescription,
  ] = useState("");


  // =======================================================
  // PLACE NAME
  //
  // Kept for compatibility with existing Map.jsx/service.
  // =======================================================

  const [
    placeName,
    setPlaceName,
  ] = useState("");


  // =======================================================
  // NOTES
  // =======================================================

  const [
    notes,
    setNotes,
  ] = useState("");


  // =======================================================
  // CENTER COORDINATES
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
  // FIELD BOUNDARY POINTS
  //
  // [
  //   {
  //     latitude: 36.123,
  //     longitude: 38.123
  //   }
  // ]
  // =======================================================

  const [
    points,
    setPoints,
  ] = useState([]);


  // =======================================================
  // AREA
  //
  // Square meters
  // =======================================================

  const [
    area,
    setArea,
  ] = useState(null);


  // =======================================================
  // PERIMETER
  //
  // Meters
  // =======================================================

  const [
    perimeter,
    setPerimeter,
  ] = useState(null);


  // =======================================================
  // BOUNDARY WIDTH
  //
  // Kept as a user-entered field.
  // =======================================================

  const [
    boundaryWidth,
    setBoundaryWidth,
  ] = useState("");


  // =======================================================
  // LOADING
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =======================================================
  // ERROR
  // =======================================================

  const [
    error,
    setError,
  ] = useState("");


  // =======================================================
  // LOAD FARMS + LOCATIONS
  // =======================================================

  useEffect(() => {

    let mounted = true;


    const loadData =
      async () => {

        try {

          const [
            farmsData,
            locationsData,
          ] = await Promise.all([

            farmService.getAllFarms(),

            mapService.getAllLocations(),

          ]);


          if (!mounted) {
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
            "Failed to load map data:",
            loadError
          );


          if (mounted) {

            setFarms([]);

            setLocations([]);

          }

        }

      };


    loadData();


    return () => {

      mounted = false;

    };

  }, []);


  // =========================================================
  // SELECT MAP POINT
  // =========================================================
  //
  // This is the ONLY way to select the field position.
  //
  // No GPS.
  // No automatic positioning.
  // No reverse geocoding.
  // =========================================================

  const selectMapPoint =
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
          t("coordinatesRequired")
        );

        return;

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


      // =====================================================
      // FIRST POINT = CENTER
      // =====================================================

      if (
        latitude === "" ||
        longitude === ""
      ) {

        setLatitude(
          point.latitude
        );

        setLongitude(
          point.longitude
        );

      }


      setError("");

    };


  // =========================================================
  // SET CENTER POINT
  // =========================================================

  const setMapCenter =
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

        return;

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

    };


  // =========================================================
  // REMOVE LAST POINT
  // =========================================================

  const removeLastPoint =
    () => {

      setPoints(
        current => {

          if (
            current.length === 0
          ) {

            return current;

          }


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

          }


          return next;

        }
      );

    };


  // =========================================================
  // CLEAR ALL POINTS
  // =========================================================

  const clearPoints =
    () => {

      setPoints([]);

      setLatitude("");

      setLongitude("");

      setArea(null);

      setPerimeter(null);

      setBoundaryWidth("");

      setError("");

    };


  // =========================================================
  // SET CALCULATED MEASUREMENTS
  // =========================================================

  const setMeasurements =
    ({
      area: calculatedArea = null,
      perimeter: calculatedPerimeter = null,
      boundaryWidth: calculatedBoundaryWidth = null,
    }) => {

      setArea(
        calculatedArea
      );


      setPerimeter(
        calculatedPerimeter
      );


      if (
        calculatedBoundaryWidth !==
        null &&
        calculatedBoundaryWidth !==
        undefined
      ) {

        setBoundaryWidth(
          calculatedBoundaryWidth
        );

      }

    };


  // =========================================================
  // SAVE LOCATION
  // =========================================================

  const addLocation =
    async ({
      polygon = null,
      calculatedArea = area,
      calculatedPerimeter = perimeter,
      calculatedBoundaryWidth = boundaryWidth,
    } = {}) => {

      setError("");


      // =====================================================
      // FARM REQUIRED
      // =====================================================

      if (!farmId) {

        const message =
          t("farmRequired");

        setError(
          message
        );

        alert(
          message
        );

        return false;

      }


      // =====================================================
      // TEXT LOCATION
      // =====================================================

      if (
        locationMode === "text" &&
        !country.trim() &&
        !region.trim() &&
        !village.trim()
      ) {

        const message =
          t(
            "locationTextRequired"
          ) ||
          t("coordinatesRequired");


        setError(
          message
        );

        alert(
          message
        );

        return false;

      }


      // =====================================================
      // MAP LOCATION
      // =====================================================

      if (
        locationMode === "map" &&
        points.length < 3
      ) {

        const message =
          t("minimumThreePoints") ||
          t("coordinatesRequired");


        setError(
          message
        );

        alert(
          message
        );

        return false;

      }


      // =====================================================
      // CENTER COORDINATES
      // =====================================================

      let finalLatitude =
        latitude;

      let finalLongitude =
        longitude;


      if (
        points.length > 0
      ) {

        const centerPoint =
          points[0];


        finalLatitude =
          centerPoint.latitude;


        finalLongitude =
          centerPoint.longitude;

      }


      // =====================================================
      // FARM
      // =====================================================

      const farm =
        farms.find(

          item =>
            String(item.id) ===
            String(farmId)

        );


      // =====================================================
      // LOCATION DATA
      // =====================================================

      const locationData = {

        farmId:
          String(
            farmId
          ),


        farmName:
          farm?.name ||
          t("farm"),


        type:
          locationType,


        // -----------------------------------------------
        // Written location
        // -----------------------------------------------

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


        // -----------------------------------------------
        // Center
        // -----------------------------------------------

        latitude:
          finalLatitude !== ""
            ? Number(finalLatitude)
            : null,


        longitude:
          finalLongitude !== ""
            ? Number(finalLongitude)
            : null,


        // -----------------------------------------------
        // Boundary
        // -----------------------------------------------

        points:
          points.map(
            point => ({

              latitude:
                Number(
                  point.latitude
                ),

              longitude:
                Number(
                  point.longitude
                ),

            })
          ),


        polygon:
          polygon || null,


        // -----------------------------------------------
        // Measurements
        // -----------------------------------------------

        area:
          calculatedArea !== null &&
          calculatedArea !== undefined &&
          calculatedArea !== ""
            ? Number(
                calculatedArea
              )
            : null,


        perimeter:
          calculatedPerimeter !== null &&
          calculatedPerimeter !== undefined &&
          calculatedPerimeter !== ""
            ? Number(
                calculatedPerimeter
              )
            : null,


        boundaryWidth:
          calculatedBoundaryWidth !== null &&
          calculatedBoundaryWidth !== undefined &&
          calculatedBoundaryWidth !== ""
            ? Number(
                calculatedBoundaryWidth
              )
            : null,


        // -----------------------------------------------
        // Source
        // -----------------------------------------------

        source:
          locationMode,


        // -----------------------------------------------
        // Status
        // -----------------------------------------------

        status:
          "active",


        createdAt:
          new Date().toISOString(),

      };


      // =====================================================
      // SAVE
      // =====================================================

      try {

        setLoading(true);


        const newLocation =
          await mapService.createLocation(
            locationData
          );


        if (newLocation) {

          setLocations(
            current => [

              ...current,

              newLocation,

            ]
          );

        }


        // ===================================================
        // RESET
        // ===================================================

        setFarmId("");

        setLocationType(
          "farm"
        );

        setLocationMode(
          "text"
        );


        setCountry("");

        setRegion("");

        setVillage("");

        setPlaceName("");

        setLocationDescription("");

        setNotes("");


        setLatitude("");

        setLongitude("");


        setPoints([]);

        setArea(null);

        setPerimeter(null);

        setBoundaryWidth("");


        setError("");


        alert(
          t("saveSuccess")
        );


        return true;

      } catch (saveError) {

        console.error(
          "Failed to create map location:",
          saveError
        );


        const message =
          t("saveError");


        setError(
          message
        );


        alert(
          message
        );


        return false;

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // DELETE LOCATION
  // =========================================================

  const deleteLocation =
    async (
      id
    ) => {

      if (!id) {

        const message =
          t("deleteError");

        alert(
          message
        );

        return false;

      }


      try {

        setLoading(true);


        const deleted =
          await mapService.deleteLocation(
            id
          );


        if (!deleted) {

          alert(
            t("deleteError")
          );

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


        alert(
          t("deleteSuccess")
        );


        return true;

      } catch (deleteError) {

        console.error(
          "Failed to delete location:",
          deleteError
        );


        alert(
          t("deleteError")
        );


        return false;

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetLocation =
    () => {

      setFarmId("");

      setLocationType(
        "farm"
      );

      setLocationMode(
        "text"
      );


      setCountry("");

      setRegion("");

      setVillage("");

      setPlaceName("");

      setLocationDescription("");

      setNotes("");


      setLatitude("");

      setLongitude("");


      setPoints([]);

      setArea(null);

      setPerimeter(null);

      setBoundaryWidth("");


      setError("");

    };


  // =========================================================
  // RETURN
  // =========================================================

  return {

    // -------------------------------------------------------
    // Farms
    // -------------------------------------------------------

    farms,

    locations,


    // -------------------------------------------------------
    // Farm
    // -------------------------------------------------------

    farmId,

    setFarmId,


    // -------------------------------------------------------
    // Type
    // -------------------------------------------------------

    locationType,

    setLocationType,


    // -------------------------------------------------------
    // Mode
    // -------------------------------------------------------

    locationMode,

    setLocationMode,


    // -------------------------------------------------------
    // Written location
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
    // Coordinates
    // -------------------------------------------------------

    latitude,

    setLatitude,


    longitude,

    setLongitude,


    // -------------------------------------------------------
    // Field boundary
    // -------------------------------------------------------

    points,

    setPoints,


    selectMapPoint,

    setMapCenter,


    removeLastPoint,

    clearPoints,


    // -------------------------------------------------------
    // Measurements
    // -------------------------------------------------------

    area,

    setArea,


    perimeter,

    setPerimeter,


    boundaryWidth,

    setBoundaryWidth,


    setMeasurements,


    // -------------------------------------------------------
    // State
    // -------------------------------------------------------

    loading,

    error,


    // -------------------------------------------------------
    // Actions
    // -------------------------------------------------------

    addLocation,

    deleteLocation,

    resetLocation,


    // -------------------------------------------------------
    // Kept intentionally:
    //
    // NO getCurrentLocation()
    //
    // GPS is no longer part of the automatic map workflow.
    // -------------------------------------------------------

    DEFAULT_POSITION,

    EMPTY_FIELD,

  };

}
