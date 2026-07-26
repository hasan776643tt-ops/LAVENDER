import { useState, useContext } from "react";
import { FarmContext } from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Map() {
  const {
    farms,
    locations,
    setLocations,
  } = useContext(FarmContext);

  const [farmName, setFarmName] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [accuracy, setAccuracy] = useState("");

  const [locationTime, setLocationTime] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS غير مدعوم في هذا الجهاز");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude.toFixed(6);

        const lng =
          position.coords.longitude.toFixed(6);

        const acc =
          Math.round(
            position.coords.accuracy
          );

        const time =
          new Date().toLocaleString("ar");

        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setLocationTime(time);

        setLoading(false);
      },

      (error) => {
        console.error(error);

        alert(
          "يرجى السماح للتطبيق باستخدام الموقع"
        );

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
    if (
      !farmName ||
      !latitude ||
      !longitude
    ) {
      alert(
        "اختر المزرعة وحدد الموقع أولاً"
      );
      return;
    }

    const newLocation = {
      id: Date.now(),
      farm: farmName,
      lat: latitude,
      lng: longitude,
      accuracy,
      createdAt: locationTime,
      status: "نشط",
    };

    setLocations([
      ...locations,
      newLocation,
    ]);

    setFarmName("");
    setLatitude("");
    setLongitude("");
    setAccuracy("");
    setLocationTime("");

    alert("تم حفظ الموقع بنجاح");
  };

  const deleteLocation = (id) => {
    setLocations(
      locations.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div>
      <h1>
        📍 إدارة مواقع المزارع
      </h1>

      <Card title="تسجيل موقع مزرعة">

        <select
          value={farmName}
          onChange={(e) =>
            setFarmName(e.target.value)
          }
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map((farm) => (
            <option
              key={farm.id}
              value={farm.name}
            >
              {farm.name}
            </option>
          ))}
        </select>

        <br /><br />

        <Button
          onClick={getCurrentLocation}
        >
          {loading
            ? "⏳ جاري تحديد الموقع..."
            : "📡 تحديد الموقع تلقائياً"}
        </Button>

        <br /><br />

        <input
          type="text"
          value={latitude}
          placeholder="Latitude"
          readOnly
        />

        <br /><br />

        <input
          type="text"
          value={longitude}
          placeholder="Longitude"
          readOnly
        />

        <br /><br />

        <input
          type="text"
          value={
            accuracy
              ? `${accuracy} متر`
              : ""
          }
          placeholder="دقة الموقع"
          readOnly
        />

        <br /><br />

        <input
          type="text"
          value={locationTime}
          placeholder="وقت التسجيل"
          readOnly
        />

        <br /><br />

        <Button
          onClick={addLocation}
        >
          💾 حفظ الموقع
        </Button>

      </Card>

      <h2>
        🗺️ مواقع المزارع المسجلة
      </h2>

      {locations.map((item) => (
        <Card
          key={item.id}
          title={item.farm}
        >
          <p>
            🌍 Latitude:
            {" "}
            {item.lat}
          </p>

          <p>
            🌍 Longitude:
            {" "}
            {item.lng}
          </p>

          <p>
            🎯 الدقة:
            {" "}
            {item.accuracy}
            {" "}
            متر
          </p>

          <p>
            🕒 وقت التسجيل:
            {" "}
            {item.createdAt}
          </p>

          <p>
            ✅ الحالة:
            {" "}
            {item.status}
          </p>

          <a
            href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            🗺️ فتح الموقع على Google Maps
          </a>

          <br /><br />

          <Button
            onClick={() =>
              deleteLocation(item.id)
            }
          >
            حذف الموقع
          </Button>
        </Card>
      ))}
    </div>
  );
}
