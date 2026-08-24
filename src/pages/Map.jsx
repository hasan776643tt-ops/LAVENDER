// src/pages/Map.jsx

import {
  useEffect,
  useMemo,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import useMap from "../hooks/useMap";

import Card from "../components/Card";
import Button from "../components/Button";

import {
  translate,
} from "../utils/translation";

import {
  useSettings,
} from "../context/SettingsContext";


// =========================================================
// Default Map Position
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];


// =========================================================
// Marker Icon
// =========================================================

const locationIcon =
  L.divIcon({

    className:
      "lavender-map-marker",

    html: `
      <div
        style="
          width: 24px;
          height: 24px;
          background: #d32f2f;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "
      ></div>
    `,

    iconSize: [
      24,
      24,
    ],

    iconAnchor: [
      12,
      12,
    ],

  });


// =========================================================
// Manual Map Selector
// =========================================================

function ManualLocationSelector({
  enabled,
  onSelect,
}) {

  useMapEvents({

    click(event) {

      if (!enabled) {

        return;

      }


      const {
        lat,
        lng,
      } = event.latlng;


      onSelect(
        lat,
        lng
      );

    },

  });


  return null;

}


// =========================================================
// Map View Controller
//
// IMPORTANT:
// map.setView() must NOT run during render.
// It runs inside useEffect.
// =========================================================

function MapViewController({
  latitude,
  longitude,
}) {

  const map =
    useMapEvents({});


  useEffect(() => {

    if (
      latitude === "" ||
      latitude === null ||
      latitude === undefined ||
      longitude === "" ||
      longitude === null ||
      longitude === undefined
    ) {

      return;

    }


    const lat =
      Number(latitude);

    const lng =
      Number(longitude);


    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {

      return;

    }


    map.setView(
      [
        lat,
        lng,
      ],
      Math.max(
        map.getZoom(),
        16
      ),
      {
        animate: true,
      }
    );

  }, [
    map,
    latitude,
    longitude,
  ]);


  return null;

}


// =========================================================
// Page
// =========================================================

export default function Map() {

  const {

    farms = [],
    locations = [],

    farmId,
    setFarmId,

    locationType,
    setLocationType,

    locationMode,
    setLocationMode,

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

    locationSource,

    notes,
    setNotes,

    loading,

    getCurrentLocation,
    selectManualLocation,

    addLocation,
    deleteLocation,

  } = useMap();


  const {
    settings,
  } = useSettings();


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
  // Current Map Position
  // =========================================================

  const mapPosition =
    useMemo(() => {

      if (
        latitude !== "" &&
        latitude !== null &&
        longitude !== "" &&
        longitude !== null
      ) {

        const lat =
          Number(latitude);

        const lng =
          Number(longitude);


        if (
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        ) {

          return [
            lat,
            lng,
          ];

        }

      }


      return DEFAULT_POSITION;

    }, [
      latitude,
      longitude,
    ]);


  // =========================================================
  // Manual Location
  //
  // IMPORTANT:
  // Do not round coordinates.
  // useMap.applyLocation() keeps full precision.
  // =========================================================

  const handleManualLocation = async (
    lat,
    lng
  ) => {

    await selectManualLocation(
      lat,
      lng
    );

  };


  // =========================================================
  // GPS
  // =========================================================

  const handleGPS =
    async () => {

      setLocationMode(
        "gps"
      );


      await getCurrentLocation();

    };


  // =========================================================
  // Render
  // =========================================================

  return (

    <div>

      {/* =====================================================
          Title
      ====================================================== */}

      <h1>
        📍 {t("title")}
      </h1>


      {/* =====================================================
          Add Location
      ====================================================== */}

      <Card
        title={
          t("addLocation")
        }
      >

        {/* ===================================================
            Farm
        ==================================================== */}

        <select

          value={
            farmId || ""
          }

          onChange={(event) =>
            setFarmId(
              event.target.value
            )
          }

        >

          <option value="">
            {t("selectFarm")}
          </option>


          {farms.map(
            (farm) => (

              <option
                key={farm.id}
                value={farm.id}
              >

                {farm.name}

              </option>

            )
          )}

        </select>


        <br />
        <br />


        {/* ===================================================
            Location Type
        ==================================================== */}

        <select

          value={
            locationType ||
            "farm"
          }

          onChange={(event) =>
            setLocationType(
              event.target.value
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


        {/* ===================================================
            Location Method
        ==================================================== */}

        <h3>
          📍 {t("locationMethod")}
        </h3>


        <Button
          onClick={
            handleGPS
          }
        >

          {loading &&
          locationMode === "gps"

            ? `⏳ ${t("locating")}`

            : `📡 ${t("getGPS")}`}

        </Button>


        <br />
        <br />


        <Button
          onClick={() => {

            setLocationMode(
              "manual"
            );

          }}
        >

          🗺️ {t("manualLocation")}

        </Button>


        <br />
        <br />


        {/* ===================================================
            Interactive Map
        ==================================================== */}

        <div
          style={{
            width: "100%",
            height: "420px",
            borderRadius: "12px",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >

          <MapContainer

            center={
              mapPosition
            }

            zoom={15}

            scrollWheelZoom={true}

            style={{
              width: "100%",
              height: "100%",
            }}

          >

            <TileLayer

              attribution="
                &copy; OpenStreetMap contributors
              "

              url="
                https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              "

            />


            <ManualLocationSelector

              enabled={
                locationMode ===
                "manual"
              }

              onSelect={
                handleManualLocation
              }

            />


            <MapViewController

              latitude={
                latitude
              }

              longitude={
                longitude
              }

            />


            {latitude !== "" &&
            longitude !== "" && (

              <Marker

                position={[
                  Number(latitude),
                  Number(longitude),
                ]}

                icon={
                  locationIcon
                }

              />

            )}

          </MapContainer>

        </div>


        {/* ===================================================
            Manual Instruction
        ==================================================== */}

        {locationMode ===
          "manual" && (

          <p>

            👆{" "}
            {t(
              "manualLocationInstruction"
            )}

          </p>

        )}


        {/* ===================================================
            Location Status
        ==================================================== */}

        {latitude !== "" &&
        longitude !== "" && (

          <div>

            <p>
              📍{" "}
              {t(
                "locationDetected"
              )}
            </p>


            <p>
              {t("latitude")}:
              {" "}
              {latitude}
            </p>


            <p>
              {t("longitude")}:
              {" "}
              {longitude}
            </p>


            {locationMode ===
              "gps" &&
            accuracy !== "" && (

              <p>
                🎯{" "}
                {t("accuracy")}:
                {" "}
                {accuracy}
                {" "}
                {t("meters")}
              </p>

            )}


            {locationMode ===
              "manual" && (

              <p>
                🖐️{" "}
                {t(
                  "manualLocationSelected"
                )}
              </p>

            )}


            {locationSource && (

              <p>
                📡{" "}
                {locationSource}
              </p>

            )}


            {locationTime && (

              <p>
                🕒{" "}
                {t("locationTime")}:
                {" "}
                {locationTime}
              </p>

            )}

          </div>

        )}


        <br />


        {/* ===================================================
            Address Information
        ==================================================== */}

        <input

          type="text"

          value={
            village || ""
          }

          onChange={(event) =>
            setVillage(
              event.target.value
            )
          }

          placeholder={
            t("villagePlaceholder")
          }

        />


        <br />
        <br />


        <input

          type="text"

          value={
            region || ""
          }

          onChange={(event) =>
            setRegion(
              event.target.value
            )
          }

          placeholder={
            t("regionPlaceholder")
          }

        />


        <br />
        <br />


        <input

          type="text"

          value={
            placeName || ""
          }

          onChange={(event) =>
            setPlaceName(
              event.target.value
            )
          }

          placeholder={
            t("placeNamePlaceholder")
          }

        />


        <br />
        <br />


        {/* ===================================================
            Notes
        ==================================================== */}

        <textarea

          value={
            notes || ""
          }

          onChange={(event) =>
            setNotes(
              event.target.value
            )
          }

          placeholder={
            t("notesPlaceholder")
          }

        />


        <br />
        <br />


        {/* ===================================================
            Save
        ==================================================== */}

        <Button
          onClick={
            addLocation
          }

        >

          💾 {t("save")}

        </Button>

      </Card>


      {/* =====================================================
          Saved Locations
      ====================================================== */}

      <h2>
        🗺️{" "}
        {t("savedLocations")}
      </h2>


      {locations.length === 0 ? (

        <p>
          {t("noLocations")}
        </p>

      ) : (

        locations.map(
          (item) => (

            <Card

              key={
                item.id
              }

              title={
                item.placeName ||
                item.farmName ||
                t("farm")
              }

            >

              {item.farmName && (

                <p>
                  🚜{" "}
                  {t("farm")}:
                  {" "}
                  {item.farmName}
                </p>

              )}


              {item.village && (

                <p>
                  🏘️{" "}
                  {t("village")}:
                  {" "}
                  {item.village}
                </p>

              )}


              {item.region && (

                <p>
                  📍{" "}
                  {t("region")}:
                  {" "}
                  {item.region}
                </p>

              )}


              {item.placeName && (

                <p>
                  📌{" "}
                  {t("placeName")}:
                  {" "}
                  {item.placeName}
                </p>

              )}


              <p>
                🌱{" "}
                {t("type")}:
                {" "}
                {item.type}
              </p>


              {item.accuracy !==
                undefined &&
              item.accuracy !==
                null && (

                <p>
                  🎯{" "}
                  {t("accuracy")}:
                  {" "}
                  {item.accuracy}
                  {" "}
                  {t("meters")}
                </p>

              )}


              <p>
                {t("latitude")}:
                {" "}
                {item.latitude}
              </p>


              <p>
                {t("longitude")}:
                {" "}
                {item.longitude}
              </p>


              <p>
                📝{" "}
                {t("notes")}:
                {" "}
                {item.notes || "-"}
              </p>


              {item.latitude !==
                undefined &&
              item.longitude !==
                undefined && (

                <a

                  href={
                    `https://maps.google.com/?q=` +
                    `${item.latitude},${item.longitude}`
                  }

                  target="_blank"

                  rel="noreferrer"

                >

                  🗺️{" "}
                  {t(
                    "openGoogleMaps"
                  )}

                </a>

              )}


              <br />
              <br />


              <Button
                onClick={() =>
                  deleteLocation(
                    item.id
                  )
                }
              >

                {t("delete")}

              </Button>

            </Card>

          )
        )

      )}

    </div>

  );

}
