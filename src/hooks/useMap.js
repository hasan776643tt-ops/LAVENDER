import { useEffect, useState } from "react";

import mapService from "../services/mapService.js";
import farmService from "../services/farmService.js";

import { translate } from "../utils/translation";
import { useSettings } from "../contexts/SettingsContext";

export default function useMap() {
  const { language } = useSettings();

  const t = (key) =>
    translate(`map.${key}`, language);

  const getMapErrorMessage = (error) => {
    switch (error?.message) {
      case "MAP_DATA_REQUIRED":
        return t("saveError");

      case "MAP_FARM_REQUIRED":
        return t("selectFarmAndLocation");

      case "MAP_COORDINATES_REQUIRED":
        return t("selectFarmAndLocation");

      case "MAP_ID_REQUIRED":
        return t("locationNotFound");

      default:
        return t("saveError");
    }
  };

  const [farms, setFarms] = useState([]);
  const [locations, setLocations] = useState([]);

  const [farmId, setFarmId] = useState("");

  const [locationType, setLocationType] =
    useState("farm");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [accuracy, setAccuracy] =
    useState("");

  const [locationTime, setLocationTime] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [farmsData, locationsData] =
          await Promise.all([
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
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t("gpsNotSupported"));
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude.toFixed(6)
        );

        setLongitude(
          position.coords.longitude.toFixed(6)
        );

        setAccuracy(
          Math.round(
            position.coords.accuracy
          )
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
      },

      () => {
        alert(t("allowLocation"));
        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const addLocation = async () => {
    if (
      !farmId ||
      !latitude ||
      !longitude
    ) {
      alert(
        t("selectFarmAndLocation")
      );

      return;
    }

    const farm = farms.find(
      (item) =>
        String(item.id) ===
        String(farmId)
    );

    const locationData = {
      farmId,

      farmName:
        farm?.name ||
        t("unknownFarm"),

      type: locationType,

      latitude,

      longitude,

      accuracy,

      notes,

      createdAt: locationTime,

      status: "active",
    };

    try {
      setLoading(true);

      const newLocation =
        await mapService.createLocation(
          locationData
        );

      setLocations((current) => [
        ...current,
        newLocation,
      ]);

      setFarmId("");

      setLocationType("farm");

      setLatitude("");

      setLongitude("");

      setAccuracy("");

      setLocationTime("");

      setNotes("");

      alert(t("saveSuccess"));
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

  const deleteLocation = async (id) => {
    try {
      setLoading(true);

      const deleted =
        await mapService.deleteLocation(
          id
        );

      if (!deleted) {
        alert(t("locationNotFound"));
        return;
      }

      setLocations((current) =>
        current.filter(
          (item) =>
            String(item.id) !==
            String(id)
        )
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

  return {
    farms,
    locations,

    farmId,
    setFarmId,

    locationType,
    setLocationType,

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    accuracy,
    locationTime,

    notes,
    setNotes,

    loading,

    getCurrentLocation,
    addLocation,
    deleteLocation,
  };
}
