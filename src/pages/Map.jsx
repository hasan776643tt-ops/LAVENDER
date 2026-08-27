// src/pages/Map.jsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import useMapHook from "../hooks/useMap";

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
// GPS Zoom
//
// 18 = detailed streets / buildings / place labels
// =========================================================

const GPS_ZOOM = 18;


// =========================================================
// Marker
// =========================================================

const locationIcon =
  L.divIcon({

    className:
      "lavender-map-marker",

    html: `
      <div
        style="
          width: 26px;
          height: 26px;
          background: #d32f2f;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow:
            0 2px 10px rgba(0,0,0,0.45);
        "
      ></div>
    `,

    iconSize: [
      26,
      26,
    ],

    iconAnchor: [
      13,
      13,
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
// =========================================================

function MapViewController({
  latitude,
  longitude,
  fullscreen,
}) {

  const map =
    useMap();


  // ---------------------------------------------------------
  // Move to GPS position
  // ---------------------------------------------------------

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
      GPS_ZOOM,
      {
        animate: true,
      }
    );

  }, [
    map,
    latitude,
    longitude,
  ]);


  // ---------------------------------------------------------
  // Leaflet needs invalidateSize after fullscreen
  // ---------------------------------------------------------

  useEffect(() => {

    const timer =
      setTimeout(() => {

        map.invalidateSize({
          animate: true,
        });

      }, 250);


    return () =>
      clearTimeout(timer);

  }, [
    map,
    fullscreen,
  ]);


  return null;

}


// =========================================================
// Map Search / Status Overlay
// =========================================================

function MapStatusOverlay({
  loading,
  locationMode,
  latitude,
  longitude,
  accuracy,
  village,
  region,
  placeName,
  onClose,
  t,
}) {

  return (

    <>

      {/* ===================================================
          Top Status
      ==================================================== */}

      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          right: "12px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "8px",
          pointerEvents: "none",
        }}
      >

        {/* -------------------------------------------------
            Location information
        -------------------------------------------------- */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.94)",
            backdropFilter:
              "blur(8px)",
            borderRadius: "14px",
            padding: "10px 12px",
            boxShadow:
              "0 3px 14px rgba(0,0,0,0.25)",
            maxWidth: "75%",
            direction: "rtl",
            pointerEvents: "auto",
          }}
        >

          {loading ? (

            <div
              style={{
                fontWeight: "700",
              }}
            >

              📡{" "}
              {t("locating")}

            </div>

          ) : latitude &&
            longitude ? (

            <>

              <div
                style={{
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >

                📍{" "}
                {t("locationDetected")}

              </div>


              {placeName && (

                <div>
                  📌 {placeName}
                </div>

              )}


              {village && (

                <div>
                  🏘️ {village}
                </div>

              )}


              {region && (

                <div>
                  📍 {region}
                </div>

              )}


              {accuracy !== "" &&
              accuracy !== null &&
              locationMode === "gps" && (

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.75,
                    marginTop: "3px",
                  }}
                >

                  🎯 {accuracy} {t("meters")}

                </div>

              )}

            </>

          ) : (

            <div>
              🗺️ {t("title")}
            </div>

          )}

        </div>


        {/* -------------------------------------------------
            Close fullscreen
        -------------------------------------------------- */}

        <button
          type="button"
          onClick={onClose}
          style={{
            pointerEvents: "auto",
            border: "none",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.95)",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.3)",
            fontSize: "22px",
            cursor: "pointer",
          }}
          aria-label="Close map"
        >

          ✕

        </button>

      </div>


      {/* ===================================================
          Coordinates bottom
      ==================================================== */}

      {latitude &&
      longitude && (

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            right: "12px",
            zIndex: 1000,
            background:
              "rgba(255,255,255,0.94)",
            backdropFilter:
              "blur(8px)",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "12px",
            direction: "ltr",
            textAlign: "center",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.25)",
          }}
        >

          📍 {Number(latitude).toFixed(6)}
          {" , "}
          {Number(longitude).toFixed(6)}

        </div>

      )}

    </>

  );

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

    notes,
    setNotes,

    loading,

    getCurrentLocation,
    selectManualLocation,

    addLocation,
    deleteLocation,

  } = useMapHook();


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
  // Fullscreen Map
  // =========================================================

  const [
    fullscreen,
    setFullscreen,
  ] = useState(false);


  // =========================================================
  // Map container reference
  // =========================================================

  const mapWrapperRef =
    useRef(null);


  // =========================================================
  // Current Position
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
  // Open fullscreen map
  // =========================================================

  const openFullscreenMap = () => {

    setFullscreen(true);

  };


  // =========================================================
  // Close fullscreen map
  // =========================================================

  const closeFullscreenMap = () => {

    setFullscreen(false);

  };


  // =========================================================
  // GPS
  //
  // IMPORTANT:
  //
  // First open the large map.
  // Then start GPS.
  // Browser/phone permission dialog can appear.
  // =========================================================

  const handleGPS =
    async () => {

      openFullscreenMap();


      setLocationMode(
        "gps"
      );


      await getCurrentLocation();

    };


  // =========================================================
  // Manual Location
  // =========================================================

  const handleManualLocation = (
    lat,
    lng
  ) => {

    selectManualLocation(
      lat,
      lng
    );

  };


  // =========================================================
  // Fullscreen style
  // =========================================================

  const mapWrapperStyle = fullscreen

    ? {

        position:
          "fixed",

        inset:
          "0",

        width:
          "100vw",

        height:
          "100vh",

        zIndex:
          9999,

        background:
          "#ffffff",

      }

    : {

        position:
          "relative",

        width:
          "100%",

        height:
          "480px",

        borderRadius:
          "14px",

        overflow:
          "hidden",

        marginTop:
          "10px",

      };


  // =========================================================
  // Render
  // =========================================================

  return (

    <div
      ref={mapWrapperRef}
      style={{
        minHeight:
          fullscreen
            ? "100vh"
            : undefined,
      }}
    >

      {/* =====================================================
          NORMAL PAGE
      ====================================================== */}

      {!fullscreen && (

        <>

          <h1>
            📍 {t("title")}
          </h1>


          <Card
            title={
              t("addLocation")
            }
          >

            {/* =================================================
                Farm
            ================================================== */}

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


            {/* =================================================
                Location Type
            ================================================== */}

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


            {/* =================================================
                GPS
            ================================================== */}

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


            {/* =================================================
                Manual
            ================================================== */}

            <Button
              onClick={() => {

                setLocationMode(
                  "manual"
                );

                openFullscreenMap();

              }}
            >

              🗺️ {t("manualLocation")}

            </Button>


            {/* =================================================
                Map
            ================================================== */}

            <div
              style={
                mapWrapperStyle
              }
            >

              <MapContainer

                center={
                  mapPosition
                }

                zoom={
                  latitude &&
                  longitude
                    ? GPS_ZOOM
                    : 15
                }

                scrollWheelZoom={
                  true
                }

                zoomControl={
                  true
                }

                style={{
                  width:
                    "100%",

                  height:
                    "100%",
                }}

              >

                {/* =================================================
                    OpenStreetMap
                    =
                    roads + villages + buildings + names
                ================================================== */}

                <TileLayer

                  attribution="
                    &copy; OpenStreetMap contributors
                  "

                  url="
                    https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                  "

                  maxZoom={
                    19
                  }

                />


                {/* =================================================
                    Manual selector
                ================================================== */}

                <ManualLocationSelector

                  enabled={
                    locationMode ===
                    "manual"
                  }

                  onSelect={
                    handleManualLocation
                  }

                />


                {/* =================================================
                    Map controller
                ================================================== */}

                <MapViewController

                  latitude={
                    latitude
                  }

                  longitude={
                    longitude
                  }

                  fullscreen={
                    fullscreen
                  }

                />


                {/* =================================================
                    GPS marker
                ================================================== */}

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


              {/* =================================================
                  Fullscreen overlay
              ================================================== */}

              {fullscreen && (

                <MapStatusOverlay

                  loading={
                    loading
                  }

                  locationMode={
                    locationMode
                  }

                  latitude={
                    latitude
                  }

                  longitude={
                    longitude
                  }

                  accuracy={
                    accuracy
                  }

                  village={
                    village
                  }

                  region={
                    region
                  }

                  placeName={
                    placeName
                  }

                  onClose={
                    closeFullscreenMap
                  }

                  t={
                    t
                  }

                />

              )}

            </div>


            {/* =================================================
                Manual instruction
            ================================================== */}

            {!fullscreen &&
            locationMode ===
              "manual" && (

              <p>

                👆{" "}
                {t(
                  "manualLocationInstruction"
                )}

              </p>

            )}


            {/* =================================================
                Location Information
            ================================================== */}

            {!fullscreen &&
            latitude &&
            longitude && (

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


                {village && (

                  <p>
                    🏘️{" "}
                    {t("village")}:
                    {" "}
                    {village}
                  </p>

                )}


                {region && (

                  <p>
                    📍{" "}
                    {t("region")}:
                    {" "}
                    {region}
                  </p>

                )}


                {placeName && (

                  <p>
                    📌{" "}
                    {t("placeName")}:
                    {" "}
                    {placeName}
                  </p>

                )}


                {locationMode ===
                  "gps" && (

                  <p>

                    🎯{" "}
                    {t("accuracy")}:
                    {" "}
                    {accuracy}
                    {" "}
                    {t("meters")}

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


            {/* =================================================
                Address fields
            ================================================== */}

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
                t(
                  "villagePlaceholder"
                )
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
                t(
                  "regionPlaceholder"
                )
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
                t(
                  "placeNamePlaceholder"
                )
              }
            />


            <br />
            <br />


            {/* =================================================
                Notes
            ================================================== */}

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
                t(
                  "notesPlaceholder"
                )
              }
            />


            <br />
            <br />


            {/* =================================================
                Save
            ================================================== */}

            <Button
              onClick={
                addLocation
              }
            >

              💾 {t("save")}

            </Button>

          </Card>


          {/* ===================================================
              Saved Locations
          ==================================================== */}

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

        </>

      )}


      {/* =====================================================
          FULLSCREEN MAP
      ====================================================== */}

      {fullscreen && (

        <div
          style={{
            position:
              "fixed",

            inset:
              "0",

            zIndex:
              9998,

            background:
              "#ffffff",
          }}
        >

          <div
            style={{
              width:
                "100%",

              height:
                "100%",

              position:
                "relative",
            }}
          >

            <MapContainer

              center={
                mapPosition
              }

              zoom={
                latitude &&
                longitude
                  ? GPS_ZOOM
                  : 15
              }

              scrollWheelZoom={
                true
              }

              zoomControl={
                true
              }

              style={{
                width:
                  "100%",

                height:
                  "100%",
              }}

            >

              {/* =================================================
                  OpenStreetMap
              ================================================== */}

              <TileLayer

                attribution="
                  &copy; OpenStreetMap contributors
                "

                url="
                  https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                "

                maxZoom={
                  19
                }

              />


              {/* =================================================
                  Manual selector
              ================================================== */}

              <ManualLocationSelector

                enabled={
                  locationMode ===
                  "manual"
                }

                onSelect={
                  handleManualLocation
                }

              />


              {/* =================================================
                  Map controller
              ================================================== */}

              <MapViewController

                latitude={
                  latitude
                }

                longitude={
                  longitude
                }

                fullscreen={
                  fullscreen
                }

              />


              {/* =================================================
                  Marker
              ================================================== */}

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


            {/* =================================================
                Information overlay
            ================================================== */}

            <MapStatusOverlay

              loading={
                loading
              }

              locationMode={
                locationMode
              }

              latitude={
                latitude
              }

              longitude={
                longitude
              }

              accuracy={
                accuracy
              }

              village={
                village
              }

              region={
                region
              }

              placeName={
                placeName
              }

              onClose={
                closeFullscreenMap
              }

              t={
                t
              }

            />


            {/* =================================================
                Manual instruction
            ================================================== */}

            {locationMode ===
              "manual" && (

              <div
                style={{
                  position:
                    "absolute",

                  bottom:
                    "58px",

                  left:
                    "50%",

                  transform:
                    "translateX(-50%)",

                  zIndex:
                    1001,

                  background:
                    "rgba(20,80,40,0.92)",

                  color:
                    "white",

                  padding:
                    "10px 16px",

                  borderRadius:
                    "20px",

                  fontSize:
                    "14px",

                  whiteSpace:
                    "nowrap",

                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.3)",

                  direction:
                    "rtl",
                }}
              >

                👆{" "}
                {t(
                  "manualLocationInstruction"
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );

}
