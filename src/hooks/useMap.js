import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

export default function useMap() {
  const {
    farms,
    locations,
    setLocations,
  } = useContext(FarmContext);

  const [farmId, setFarmId] = useState("");
  const [locationType, setLocationType] = useState("مزرعة");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [accuracy, setAccuracy] = useState("");
  const [locationTime, setLocationTime] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

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

  const addLocation = () => {
    if (!farmId || !latitude || !longitude) {
      alert("اختر المزرعة وحدد الموقع أولاً");
      return;
    }

    const farm = farms.find(
      (item) => item.id === farmId
    );

    const newLocation = {
      id: Date.now(),
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

    setLocations([
      ...locations,
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
  };

  const deleteLocation = (id) => {
    setLocations(
      locations.filter(
        (item) => item.id !== id
      )
    );
  };

  return {
    farms,
    locations,

    farmId,
    setFarmId,

    locationType,
    setLocationType,

    latitude,
    longitude,

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
