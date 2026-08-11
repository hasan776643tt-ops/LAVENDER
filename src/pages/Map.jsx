// src/pages/Map.jsx

import { useSettings } from "../context/SettingsContext";
import { translate } from "../utils/translation";
import useMap from "../hooks/useMap";

import Card from "../components/Card";
import Button from "../components/Button";

export default function Map() {
  const { settings } = useSettings();
  const language = settings?.language || "ar";

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

  return (
    <div>
      <h1>
        📍 {translate("map.title", language)}
      </h1>

      <Card
        title={translate(
          "map.addLocation",
          language
        )}
      >
        <select
          value={farmId}
          onChange={(event) =>
            setFarmId(event.target.value)
          }
        >
          <option value="">
            {translate(
              "map.selectFarm",
              language
            )}
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
          onChange={(event) =>
            setLocationType(event.target.value)
          }
        >
          <option value="مزرعة">
            {translate(
              "map.farm",
              language
            )}
          </option>

          <option value="حقل">
            {translate(
              "map.field",
              language
            )}
          </option>

          <option value="مصدر مياه">
            {translate(
              "map.waterSource",
              language
            )}
          </option>
        </select>

        <br />
        <br />

        <Button
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading
            ? `⏳ ${translate(
                "map.locating",
                language
              )}`
            : `📡 ${translate(
                "map.getGPS",
                language
              )}`}
        </Button>

        <br />
        <br />

        <input
          value={latitude}
          readOnly
          placeholder={translate(
            "map.latitude",
            language
          )}
          aria-label={translate(
            "map.latitude",
            language
          )}
        />

        <br />
        <br />

        <input
          value={longitude}
          readOnly
          placeholder={translate(
            "map.longitude",
            language
          )}
          aria-label={translate(
            "map.longitude",
            language
          )}
        />

        <br />
        <br />

        <input
          value={
            accuracy
              ? `${accuracy} ${translate(
                  "map.meters",
                  language
                )}`
              : ""
          }
          readOnly
          placeholder={translate(
            "map.accuracy",
            language
          )}
          aria-label={translate(
            "map.accuracy",
            language
          )}
        />

        <br />
        <br />

        <input
          value={locationTime}
          readOnly
          placeholder={translate(
            "map.locationTime",
            language
          )}
          aria-label={translate(
            "map.locationTime",
            language
          )}
        />

        <br />
        <br />

        <textarea
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder={translate(
            "map.notesPlaceholder",
            language
          )}
          aria-label={translate(
            "map.notes",
            language
          )}
        />

        <br />
        <br />

        <Button
          onClick={addLocation}
          disabled={loading}
        >
          💾 {translate(
            "map.save",
            language
          )}
        </Button>
      </Card>

      <h2>
        🗺️ {translate(
          "map.savedLocations",
          language
        )}
      </h2>

      {locations.map((item) => (
        <Card
          key={item.id}
          title={item.farmName}
        >
          <p>
            📌{" "}
            {translate(
              "map.type",
              language
            )}
            : {translate(
              item.type === "مزرعة"
                ? "map.farm"
                : item.type === "حقل"
                ? "map.field"
                : "map.waterSource",
              language
            )}
          </p>

          <p>
            🌍{" "}
            {translate(
              "map.latitude",
              language
            )}
            : {item.latitude}
          </p>

          <p>
            🌍{" "}
            {translate(
              "map.longitude",
              language
            )}
            : {item.longitude}
          </p>

          <p>
            🎯{" "}
            {translate(
              "map.accuracy",
              language
            )}
            : {item.accuracy}{" "}
            {translate(
              "map.meters",
              language
            )}
          </p>

          <p>
            📝{" "}
            {translate(
              "map.notes",
              language
            )}
            : {item.notes}
          </p>

          <a
            href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗺️{" "}
            {translate(
              "map.openGoogleMaps",
              language
            )}
          </a>

          <br />
          <br />

          <Button
            onClick={() =>
              deleteLocation(item.id)
            }
            disabled={loading}
          >
            {translate(
              "map.delete",
              language
            )}
          </Button>
        </Card>
      ))}
    </div>
  );
}
