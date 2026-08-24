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


export default function useMap() {

  // =========================================================
  // Settings / Language
  // =========================================================

  const {
    settings,
  } = useSettings();

  const language =
    settings?.language || "ar";


  // =========================================================
  // Translation
  // =========================================================

  const t = (key) =>
    translate(
      `map.${key}`,
      language
    );


  // =========================================================
  // Farms / Locations
  // =========================================================

  const [farms, setFarms] =
    useState([]);

  const [locations, setLocations] =
    useState([]);


  // =========================================================
  // Farm / Location Type
  // =========================================================

  const [farmId, setFarmId] =
    useState("");

  const [locationType, setLocationType] =
    useState("farm");


  // =========================================================
  // Location Mode
  //
  // gps    = phone GPS
  // manual = user clicks map
  // =========================================================

  const [locationMode, setLocationMode] =
    useState("gps");


  // =========================================================
  // Human-readable address
  //
  // Descriptive only.
  // NOT the real geographic position.
  // =========================================================

  const [village, setVillage] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [placeName, setPlaceName] =
    useState("");


  // =========================================================
  // REAL coordinates
  //
  // These are authoritative.
  // =========================================================

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [accuracy, setAccuracy] =
    useState("");

  const [locationTime, setLocationTime] =
    useState("");


  // =========================================================
  // Location source
  // =========================================================

  const [locationSource, setLocationSource] =
    useState("gps");


  // =========================================================
  // Notes
  // =========================================================

  const [notes, setNotes] =
    useState("");


  // =========================================================
  // Loading
  // =========================================================

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // Error Translation
  // =========================================================

  const getMapErrorMessage =
    (error) => {

      switch (error?.message) {

        case "MAP_DATA_REQUIRED":
          return t("saveError");

        case "MAP_FARM_REQUIRED":
          return t("farmRequired");

        case "MAP_COORDINATES_REQUIRED":
          return t("coordinatesRequired");

        case "MAP_ID_REQUIRED":
          return t("deleteError");

        case "MAP_GEOCODING_FAILED":
          return t("addressError");

        default:
          return t("saveError");

      }

    };


  // =========================================================
  // Load Farms + Saved Locations
  // =========================================================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

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
          Array.isArray(farmsData)
            ? farmsData
            : []
        );


        setLocations(
          Array.isArray(locationsData)
            ? locationsData
            : []
        );


      } catch (error) {

        console.error(
          "Failed to load map data:",
          error
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
  // Apply REAL coordinates
  //
  // Used by GPS and manual map selection.
  // =========================================================

  const applyLocation =
    async ({
      latitude: selectedLatitude,
      longitude: selectedLongitude,
      accuracy: selectedAccuracy = null,
      source = "gps",
    }) => {

      const lat =
        Number(selectedLatitude);

      const lon =
        Number(selectedLongitude);


      // -------------------------------------------------------
      // Validate
      // -------------------------------------------------------

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      // -------------------------------------------------------
      // IMPORTANT
      //
      // Do NOT use toFixed().
      // Preserve the coordinates received from GPS / map.
      // -------------------------------------------------------

      setLatitude(lat);

      setLongitude(lon);


      // -------------------------------------------------------
      // Accuracy
      // -------------------------------------------------------

      if (
        selectedAccuracy !== null &&
        selectedAccuracy !== undefined &&
        Number.isFinite(
          Number(selectedAccuracy)
        )
      ) {

        setAccuracy(
          Number(selectedAccuracy)
        );

      } else {

        setAccuracy("");

      }


      // -------------------------------------------------------
      // Source
      // -------------------------------------------------------

      setLocationSource(
        source
      );


      // -------------------------------------------------------
      // Mode
      // -------------------------------------------------------

      setLocationMode(
        source === "manual"
          ? "manual"
          : "gps"
      );


      // -------------------------------------------------------
      // Time
      // -------------------------------------------------------

      const now =
        new Date();


      setLocationTime(
        now.toLocaleString(
          language === "tr"
            ? "tr-TR"
            : language === "en"
            ? "en-US"
            : "ar-SY"
        )
      );


      // =====================================================
      // Reverse Geocoding
      //
      // Only describes the location.
      // Never changes lat/lon.
      // =====================================================

      try {

        const address =
          await mapService.reverseGeocode(
            lat,
            lon,
            language
          );


        setVillage(
          address?.village ||
          address?.town ||
          address?.municipality ||
          address?.city ||
          ""
        );


        setRegion(
          address?.region ||
          address?.district ||
          ""
        );


        setPlaceName(
          address?.placeName ||
          address?.displayName ||
          ""
        );


      } catch (error) {

        console.warn(
          "Reverse geocoding failed:",
          error
        );


        // GPS remains valid.
        setVillage("");

        setRegion("");

        setPlaceName("");

      }

    };


  // =========================================================
  // Get Current GPS Location
  // =========================================================

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        t("locationError")
      );

      return Promise.resolve();

    }


    setLocationMode("gps");

    setLoading(true);


    return new Promise((resolve) => {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          try {

            const {
              latitude:
                currentLatitude,

              longitude:
                currentLongitude,

              accuracy:
                currentAccuracy,

            } = position.coords;


            await applyLocation({

              latitude:
                currentLatitude,

              longitude:
                currentLongitude,

              accuracy:
                currentAccuracy,

              source:
                "gps",

            });


            alert(
              t("locationSuccess")
            );


          } catch (error) {

            console.error(
              "GPS processing error:",
              error
            );


            alert(
              getMapErrorMessage(error)
            );

          } finally {

            setLoading(false);

            resolve();

          }

        },


        (error) => {

          console.error(
            "GPS error:",
            error
          );


          let message =
            t("locationError");


          switch (error?.code) {

            case 1:

              message =
                t("permissionDenied");

              break;


            case 2:

              message =
                t("positionUnavailable");

              break;


            case 3:

              message =
                t("locationTimeout");

              break;


            default:

              message =
                t("locationError");

          }


          alert(message);


          setLoading(false);

          resolve();

        },


        {
          enableHighAccuracy:
            true,

          timeout:
            30000,

          maximumAge:
            0,
        }

      );

    });

  };


  // =========================================================
  // Select Location Manually
  //
  // Called when user clicks Leaflet map.
  // =========================================================

  const selectManualLocation =
    async (
      selectedLatitude,
      selectedLongitude
    ) => {

      try {

        setLoading(true);

        setLocationMode("manual");


        await applyLocation({

          latitude:
            selectedLatitude,

          longitude:
            selectedLongitude,

          accuracy:
            null,

          source:
            "manual",

        });


      } catch (error) {

        console.error(
          "Manual location error:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );


      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Add Location
  // =========================================================

  const addLocation =
    async () => {

      // -------------------------------------------------------
      // Farm
      // -------------------------------------------------------

      if (!farmId) {

        alert(
          t("farmRequired")
        );

        return;

      }


      // -------------------------------------------------------
      // REAL coordinates
      // -------------------------------------------------------

      if (
        latitude === "" ||
        longitude === "" ||
        latitude === null ||
        longitude === null
      ) {

        alert(
          t("coordinatesRequired")
        );

        return;

      }


      const numericLatitude =
        Number(latitude);

      const numericLongitude =
        Number(longitude);


      if (
        !Number.isFinite(
          numericLatitude
        ) ||
        !Number.isFinite(
          numericLongitude
        )
      ) {

        alert(
          t("coordinatesRequired")
        );

        return;

      }


      // -------------------------------------------------------
      // Farm
      // -------------------------------------------------------

      const farm =
        farms.find(
          (item) =>
            String(item.id) ===
            String(farmId)
        );


      // =======================================================
      // Location Data
      // =======================================================

      const locationData = {

        farmId:
          String(farmId),


        farmName:
          farm?.name ||
          t("farm"),


        village:
          village.trim(),


        region:
          region.trim(),


        placeName:
          placeName.trim(),


        type:
          locationType,


        // REAL coordinates
        latitude:
          numericLatitude,

        longitude:
          numericLongitude,


        accuracy:
          accuracy !== "" &&
          accuracy !== null &&
          accuracy !== undefined
            ? Number(accuracy)
            : null,


        source:
          locationSource,


        notes:
          notes.trim(),


        createdAt:
          new Date().toISOString(),


        status:
          "active",

      };


      // =====================================================
      // Save
      // =====================================================

      try {

        setLoading(true);


        const newLocation =
          await mapService.createLocation(
            locationData
          );


        if (newLocation) {

          setLocations(
            (current) => [
              ...current,
              newLocation,
            ]
          );

        }


        // ---------------------------------------------------
        // Reset
        // ---------------------------------------------------

        setFarmId("");

        setLocationMode("gps");

        setLocationType("farm");

        setVillage("");

        setRegion("");

        setPlaceName("");

        setLatitude("");

        setLongitude("");

        setAccuracy("");

        setLocationTime("");

        setLocationSource("gps");

        setNotes("");


        alert(
          t("saveSuccess")
        );


      } catch (error) {

        console.error(
          "Failed to create location:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );


      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Delete Location
  // =========================================================

  const deleteLocation =
    async (id) => {

      if (!id) {

        alert(
          t("deleteError")
        );

        return;

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

          return;

        }


        setLocations(
          (current) =>
            current.filter(
              (item) =>
                String(item.id) !==
                String(id)
            )
        );


        alert(
          t("deleteSuccess")
        );


      } catch (error) {

        console.error(
          "Failed to delete location:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );


      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Return
  // =========================================================

  return {

    farms,

    locations,


    farmId,
    setFarmId,


    locationType,
    setLocationType,


    locationMode,
    setLocationMode,


    village,
    setVillage,


    region,
    setRegion,


    placeName,
    setPlaceName,


    latitude,
    setLatitude,


    longitude,
    setLongitude,


    accuracy,

    locationTime,


    locationSource,


    notes,
    setNotes,


    loading,


    getCurrentLocation,

    selectManualLocation,

    addLocation,

    deleteLocation,

  };

}
