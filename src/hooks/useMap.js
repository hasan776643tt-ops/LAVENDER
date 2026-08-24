// src/hooks/useMap.js

import {
  useEffect,
  useState
} from "react";

import mapService
  from "../services/mapService.js";

import farmService
  from "../services/farmService.js";

import {
  translate
} from "../utils/translation";

import {
  useSettings
} from "../context/SettingsContext";


export default function useMap() {

  // =========================================================
  // Settings / Language
  // =========================================================

  const {
    settings
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
  // State
  // =========================================================

  const [farms, setFarms] =
    useState([]);

  const [locations, setLocations] =
    useState([]);

  const [farmId, setFarmId] =
    useState("");

  const [locationType, setLocationType] =
    useState("farm");


  // =========================================================
  // Human-readable location data
  // =========================================================

  const [village, setVillage] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [placeName, setPlaceName] =
    useState("");


  // =========================================================
  // GPS data
  // الإحداثيات تبقى داخل النظام
  // ولا نطلب من الفلاح إدخالها يدويًا
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
  // Notes / Loading
  // =========================================================

  const [notes, setNotes] =
    useState("");

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
          locationsData
        ] = await Promise.all([

          farmService.getAllFarms(),

          mapService.getAllLocations()

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
  // Get Current GPS Location
  // =========================================================

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        t("locationError")
      );

      return;

    }


    setLoading(true);


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude: currentLatitude,
          longitude: currentLongitude,
          accuracy: currentAccuracy
        } = position.coords;


        setLatitude(
          currentLatitude.toFixed(6)
        );


        setLongitude(
          currentLongitude.toFixed(6)
        );


        setAccuracy(
          Math.round(currentAccuracy)
        );


        setLocationTime(

          new Date().toLocaleString(

            language === "tr"
              ? "tr-TR"
              : language === "en"
              ? "en-US"
              : "ar-SY"

          )

        );


        setLoading(false);


        alert(
          t("locationSuccess")
        );

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

      },


      {

        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0

      }

    );

  };


  // =========================================================
  // Add Location
  // =========================================================

  const addLocation = async () => {

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
    // GPS
    // -------------------------------------------------------

    if (
      !latitude ||
      !longitude
    ) {

      alert(
        t("coordinatesRequired")
      );

      return;

    }


    // -------------------------------------------------------
    // Place information
    // -------------------------------------------------------

    if (!village.trim()) {

      alert(
        t("villageRequired")
      );

      return;

    }


    if (!region.trim()) {

      alert(
        t("regionRequired")
      );

      return;

    }


    if (!placeName.trim()) {

      alert(
        t("placeNameRequired")
      );

      return;

    }


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

      farmId,

      farmName:
        farm?.name ||
        t("farm"),


      // -----------------------------------------------
      // Human readable location
      // -----------------------------------------------

      village:
        village.trim(),

      region:
        region.trim(),

      placeName:
        placeName.trim(),


      // -----------------------------------------------
      // Location type
      // -----------------------------------------------

      type:
        locationType,


      // -----------------------------------------------
      // GPS
      // -----------------------------------------------

      latitude,

      longitude,

      accuracy,


      // -----------------------------------------------
      // Additional data
      // -----------------------------------------------

      notes,

      createdAt:
        locationTime,

      status:
        "active"

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

            newLocation

          ]
        );

      }


      // ===================================================
      // Reset Form
      // ===================================================

      setFarmId("");

      setLocationType("farm");


      setVillage("");

      setRegion("");

      setPlaceName("");


      setLatitude("");

      setLongitude("");

      setAccuracy("");

      setLocationTime("");

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


    // -----------------------------------------------
    // Human readable location
    // -----------------------------------------------

    village,
    setVillage,

    region,
    setRegion,

    placeName,
    setPlaceName,


    // -----------------------------------------------
    // GPS
    // -----------------------------------------------

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    accuracy,

    locationTime,


    // -----------------------------------------------
    // Notes
    // -----------------------------------------------

    notes,
    setNotes,


    loading,


    getCurrentLocation,

    addLocation,

    deleteLocation

  };

}
