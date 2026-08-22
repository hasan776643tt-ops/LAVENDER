// src/pages/Map.jsx

import useMap from "../hooks/useMap";

import Card from "../components/Card";
import Button from "../components/Button";

import { translate } from "../utils/translation";
import { useSettings } from "../context/SettingsContext";

export default function Map() {

  const {
    farms = [],
    locations = [],

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

  } = useMap();


  const { settings } = useSettings();


  // =========================================================
  // Language
  // =========================================================

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
  // Render
  // =========================================================

  return (

    <div>

      {/* =====================================================
          Page Title
      ====================================================== */}

      <h1>
        📍 {t("title")}
      </h1>


      {/* =====================================================
          Add Location
      ====================================================== */}

      <Card
        title={t("addLocation")}
      >

        {/* Farm */}

        <select
          value={farmId || ""}
          onChange={(e) =>
            setFarmId(e.target.value)
          }
        >

          <option value="">
            {t("selectFarm")}
          </option>


          {farms.map((farm) => (

            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name}
            </option>

          ))}

        </select>


        <br />
        <br />


        {/* =================================================
            Location Type
        ================================================== */}

        <select
          value={locationType || "farm"}
          onChange={(e) =>
            setLocationType(
              e.target.value
            )
          }
        >

          <option value="farm">
            {t("farm")}
          </option>

          <option value="field">
            {t("field")}
          </option>

          <option value="waterSource">
            {t("waterSource")}
          </option>

        </select>


        <br />
        <br />


        {/* =================================================
            GPS
        ================================================== */}

        <Button
          onClick={getCurrentLocation}
        >

          {loading
            ? `⏳ ${t("locating")}`
            : `📡 ${t("getGPS")}`}

        </Button>


        <br />
        <br />


        {/* =================================================
            Latitude
        ================================================== */}

        <input
          value={latitude || ""}
          readOnly
          placeholder={t("latitude")}
        />


        <br />
        <br />


        {/* =================================================
            Longitude
        ================================================== */}

        <input
          value={longitude || ""}
          readOnly
          placeholder={t("longitude")}
        />


        <br />
        <br />


        {/* =================================================
            Accuracy
        ================================================== */}

        <input
          value={
            accuracy
              ? `${accuracy} ${t("meters")}`
              : ""
          }
          readOnly
          placeholder={t("accuracy")}
        />


        <br />
        <br />


        {/* =================================================
            Location Time
        ================================================== */}

        <input
          value={locationTime || ""}
          readOnly
          placeholder={t("locationTime")}
        />


        <br />
        <br />


        {/* =================================================
            Notes
        ================================================== */}

        <textarea
          value={notes || ""}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder={
            t("notesPlaceholder")
          }
        />


        <br />
        <br />


        {/* =================================================
            Save
        ================================================== */}

        <Button
          onClick={addLocation}
        >
          💾 {t("save")}
        </Button>

      </Card>


      {/* =====================================================
          Saved Locations
      ====================================================== */}

      <h2>
        🗺️ {t("savedLocations")}
      </h2>


      {locations.length === 0 ? (

        <p>
          {t("noLocations")}
        </p>

      ) : (

        locations.map((item) => (

          <Card
            key={item.id}
            title={
              item.farmName ||
              t("farm")
            }
          >

            {/* Type */}

            <p>
              📌 {t("type")}:{" "}
              {item.type}
            </p>


            {/* Latitude */}

            <p>
              🌍 {t("latitude")}:{" "}
              {item.latitude}
            </p>


            {/* Longitude */}

            <p>
              🌍 {t("longitude")}:{" "}
              {item.longitude}
            </p>


            {/* Accuracy */}

            <p>
              🎯 {t("accuracy")}:{" "}
              {item.accuracy}{" "}
              {t("meters")}
            </p>


            {/* Notes */}

            <p>
              📝 {t("notes")}:{" "}
              {item.notes || "-"}
            </p>


            {/* Google Maps */}

            <a
              href={
                `https://maps.google.com/?q=` +
                `${item.latitude},${item.longitude}`
              }
              target="_blank"
              rel="noreferrer"
            >
              🗺️ {t("openGoogleMaps")}
            </a>


            <br />
            <br />


            {/* Delete */}

            <Button
              onClick={() =>
                deleteLocation(item.id)
              }
            >
              {t("delete")}
            </Button>

          </Card>

        ))

      )}

    </div>

  );
}
