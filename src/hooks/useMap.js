import { useEffect, useState } from "react";
import mapService from "../services/mapService.js";

export default function useMap() {
  const [farms, setFarms] = useState([]);
  const [locations, setLocations] = useState([]);

  const [farmId, setFarmId] = useState("");
  const [locationType, setLocationType] = useState("مزرعة");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [accuracy, setAccuracy] = useState("");
  const [locationTime, setLocationTime] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLocations = async () => {
      try {
        const data = await mapService.getAllLocations();

        if (mounted) {
          setLocations(
            Array.isArray(data) ? data : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load map locations:",
          error
        );
      }
    };

    loadLocations();

    return () => {
      mounted = false;
    };
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS غير مدعوم في هذا الجهاز");
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
          Math.round(position.coords.accuracy)
        );

        setLocationTime(
          new Date().toLocaleString("ar-SY")
        );

        setLoading(false);
      },

      () => {
        alert("يرجى السماح باستخدام الموقع");
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
    if (!farmId || !latitude || !longitude) {
      alert("اختر المزرعة وحدد الموقع أولاً");
      return;
    }

    const farm = farms.find(
      (item) => String(item.id) === String(farmId)
    );

    const locationData = {
      farmId,
      farmName: farm?.name || "غير محدد",
      type: locationType,
      latitude,
      longitude,
      accuracy,
      notes,
      createdAt: locationTime,
      status: "نشط",
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
      setLocationType("مزرعة");
      setLatitude("");
      setLongitude("");
      setAccuracy("");
      setLocationTime("");
      setNotes("");

      alert("تم حفظ الموقع بنجاح");
    } catch (error) {
      console.error(
        "Failed to create location:",
        error
      );

      alert(
        error?.message ||
          "حدث خطأ أثناء حفظ الموقع"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    try {
      setLoading(true);

      const deleted =
        await mapService.deleteLocation(id);

      if (!deleted) {
        alert("الموقع غير موجود");
        return;
      }

      setLocations((current) =>
        current.filter(
          (item) =>
            String(item.id) !== String(id)
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete location:",
        error
      );

      alert(
        error?.message ||
          "حدث خطأ أثناء حذف الموقع"
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
