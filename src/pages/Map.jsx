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

    village,
    setVillage,

    region,
    setRegion,

    placeName,
    setPlaceName,

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

        {/* =================================================
            Farm
        ================================================== */}

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
            Village
        ================================================== */}

        <input
          type="text"
          value={village || ""}
          onChange={(e) =>
            setVillage(e.target.value)
          }
          placeholder={t("village")}
        />


        <br />
        <br />


        {/* =================================================
            Region
        ================================================== */}

        <input
          type="text"
          value={region || ""}
          onChange={(e) =>
            setRegion(e.target.value)
          }
          placeholder={t("region")}
        />


        <br />
        <br />


        {/* =================================================
            Place Name
        ================================================== */}

        <input
          type="text"
          value={placeName || ""}
          onChange={(e) =>
            setPlaceName(e.target.value)
          }
          placeholder={t("placeName")}
        />


        <br />
        <br />


        {/* =================================================
            Location Type
        ================================================== */}

        <select
          value={locationType || "farm"}
          onChange={(e) =>
            setLocationType(e.target.value)
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
            الإحداثيات تبقى داخل النظام ولا نعرضها للفلاح
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
            GPS Status
        ================================================== */}

        {latitude && longitude && (

          <p>
            📍 {t("locationDetected")}
          </p>

        )}


        {/* =================================================
            Notes
        ================================================== */}

        <textarea
          value={notes || ""}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder={t("notesPlaceholder")}
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
              item.placeName ||
              item.farmName ||
              t("farm")
            }
          >

            {/* Farm */}

            {item.farmName && (

              <p>
                🚜 {t("farm")}:{" "}
                {item.farmName}
              </p>

            )}


            {/* Village */}

            {item.village && (

              <p>
                🏘️ {t("village")}:{" "}
                {item.village}
              </p>

            )}


            {/* Region */}

            {item.region && (

              <p>
                📍 {t("region")}:{" "}
                {item.region}
              </p>

            )}


            {/* Place */}

            {item.placeName && (

              <p>
                📌 {t("placeName")}:{" "}
                {item.placeName}
              </p>

            )}


            {/* Type */}

            <p>
              🌱 {t("type")}:{" "}
              {item.type}
            </p>


            {/* Notes */}

            <p>
              📝 {t("notes")}:{" "}
              {item.notes || "-"}
            </p>


            {/* Google Maps */}

            {item.latitude &&
              item.longitude && (

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

            )}


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
