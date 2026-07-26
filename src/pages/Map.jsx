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

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert("جهازك لا يدعم GPS");

      return;

    }

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

        const date =
          new Date().toLocaleString("ar");

        setLatitude(lat);

        setLongitude(lng);

        setAccuracy(acc);

        setLocationTime(date);

      },

      (error) => {

        console.error(error);

        alert(
          "يرجى السماح بالوصول إلى الموقع"
        );

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
      return;
    }

    const newLocation = {

      id: Date.now(),

      name: farmName,

      lat: latitude,

      lng: longitude,

      accuracy,

      createdAt: locationTime,

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
            setFarmName(
              e.target.value
            )
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
          onClick={
            getCurrentLocation
          }
        >
          📍 تحديد موقعي الحالي
        </Button>

        <br /><br />

        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          readOnly
        />

        <br /><br />

        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          readOnly
        />

        <br /><br />

        <input
          type="text"
          placeholder="دقة الموقع"
          value={
            accuracy
              ? `${accuracy} متر`
              : ""
          }
          readOnly
        />

        <br /><br />

        <input
          type="text"
          placeholder="وقت التسجيل"
          value={locationTime}
          readOnly
        />

        <br /><br />

        <Button
          onClick={addLocation}
        >
          حفظ الموقع
        </Button>

      </Card>

      <h2>
        🗺️ مواقع المزارع
      </h2>

      {locations.map((item) => (

        <Card
          key={item.id}
          title={item.name}
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

          <a
            href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            🗺️ فتح الموقع على الخريطة
          </a>

          <br /><br />

          <Button
            onClick={() =>
              deleteLocation(
                item.id
              )
            }
          >
            حذف الموقع
          </Button>

        </Card>

      ))}

    </div>

  );

}
