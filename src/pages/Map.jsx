import useMap from "../hooks/useMap";

import Card from "../components/Card";
import Button from "../components/Button";

import { translate } from "../utils/translation";
import { useSettings } from "../contexts/SettingsContext";

export default function Map() {
  const {
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
  } = useMap();

  const { language } = useSettings();

  const t = (key) => translate(`map.${key}`, language);

  return (
    <div>
      <h1>📍 {t("title")}</h1>

      <Card title={t("addLocation")}>
        <select
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
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

        <select
          value={locationType}
          onChange={(e) =>
            setLocationType(e.target.value)
          }
        >
          <option value="مزرعة">
            {t("farm")}
          </option>

          <option value="حقل">
            {t("field")}
          </option>

          <option value="مصدر مياه">
            {t("waterSource")}
          </option>
        </select>

        <br />
        <br />

        <Button onClick={getCurrentLocation}>
          {loading
            ? `⏳ ${t("locating")}`
            : `📡 ${t("getGPS")}`}
        </Button>

        <br />
        <br />

        <input
          value={latitude}
          readOnly
          placeholder={t("latitude")}
        />

        <br />
        <br />

        <input
          value={longitude}
          readOnly
          placeholder={t("longitude")}
        />

        <br />
        <br />

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

        <input
          value={locationTime}
          readOnly
          placeholder={t("locationTime")}
        />

        <br />
        <br />

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder={t("notesPlaceholder")}
        />

        <br />
        <br />

        <Button onClick={addLocation}>
          💾 {t("save")}
        </Button>
      </Card>

      <h2>
        🗺️ {t("savedLocations")}
      </h2>

      {locations.map((item) => (
        <Card
          key={item.id}
          title={item.farmName}
        >
          <p>
            📌 {t("type")}: {item.type}
          </p>

          <p>
            🌍 {t("latitude")}: {item.latitude}
          </p>

          <p>
            🌍 {t("longitude")}: {item.longitude}
          </p>

          <p>
            🎯 {t("accuracy")}: {item.accuracy}{" "}
            {t("meters")}
          </p>

          <p>
            📝 {t("notes")}: {item.notes}
          </p>

          <a
            href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            🗺️ {t("openGoogleMaps")}
          </a>

          <br />
          <br />

          <Button
            onClick={() =>
              deleteLocation(item.id)
            }
          >
            {t("delete")}
          </Button>
        </Card>
      ))}
    </div>
  );
}
