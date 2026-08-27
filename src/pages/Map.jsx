// src/pages/Map.jsx

import {
  useEffect,
  useMemo,
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
// DEFAULT POSITION
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];


// =========================================================
// ZOOM LEVELS
// =========================================================

const GPS_ZOOM = 18;
const DEFAULT_ZOOM = 15;


// =========================================================
// LOCATION MARKER
// =========================================================

const locationIcon =
  L.divIcon({

    className:
      "lavender-map-marker",

    html: `
      <div
        style="
          width: 28px;
          height: 28px;
          background: #d32f2f;
          border: 4px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 12px rgba(0,0,0,0.50);
        "
      ></div>
    `,

    iconSize: [
      28,
      28,
    ],

    iconAnchor: [
      14,
      14,
    ],

  });


// =========================================================
// MANUAL LOCATION SELECTOR
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
// MAP CONTROLLER
// =========================================================

function MapController({
  latitude,
  longitude,
  fullscreen,
}) {

  const map =
    useMap();


  // =======================================================
  // MOVE TO SELECTED LOCATION
  // =======================================================

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


  // =======================================================
  // LEAFLET SIZE
  // =======================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        map.invalidateSize();

      }, 300);


    return () => {

      clearTimeout(timer);

    };

  }, [
    map,
    fullscreen,
  ]);


  return null;

}


// =========================================================
// RECENTER BUTTON
// =========================================================

function RecenterButton({
  latitude,
  longitude,
  t,
}) {

  const map =
    useMap();


  const recenter =
    () => {

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

    };


  if (
    latitude === "" ||
    longitude === ""
  ) {

    return null;

  }


  return (

    <button
      type="button"

      onClick={
        recenter
      }

      style={{
        position: "absolute",
        right: "12px",
        bottom: "72px",
        zIndex: 1000,

        width: "52px",
        height: "52px",

        border: "none",
        borderRadius: "50%",

        background:
          "rgba(255,255,255,0.96)",

        boxShadow:
          "0 3px 14px rgba(0,0,0,0.35)",

        fontSize: "24px",

        cursor: "pointer",
      }}

      aria-label={
        t("locationDetected")
      }

    >

      📍

    </button>

  );

}


// =========================================================
// MAP STATUS
// =========================================================

function MapStatus({
  loading,
  latitude,
  longitude,
  accuracy,
  village,
  region,
  placeName,
  locationMode,
  onClose,
  t,
}) {

  return (

    <>

      {/* ===================================================
          TOP INFORMATION PANEL
      =================================================== */}

      <div
        style={{
          position: "absolute",

          top: "12px",
          left: "12px",
          right: "12px",

          zIndex: 1000,

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          gap: "8px",

          pointerEvents:
            "none",
        }}
      >

        {/* =================================================
            LOCATION INFORMATION
        ================================================== */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.96)",

            backdropFilter:
              "blur(10px)",

            borderRadius:
              "16px",

            padding:
              "11px 14px",

            boxShadow:
              "0 3px 16px rgba(0,0,0,0.28)",

            maxWidth:
              "78%",

            direction:
              "rtl",

            pointerEvents:
              "auto",

            lineHeight:
              "1.7",
          }}
        >

          {loading ? (

            <div
              style={{
                fontWeight:
                  "700",
              }}
            >

              📡{" "}
              {t("locating")}

            </div>

          ) : (

            <>

              <div
                style={{
                  fontWeight:
                    "800",
                }}
              >

                📍{" "}
                {t(
                  "locationDetected"
                )}

              </div>


              {placeName && (

                <div>

                  📌{" "}
                  {placeName}

                </div>

              )}


              {village && (

                <div>

                  🏘️{" "}
                  {village}

                </div>

              )}


              {region && (

                <div>

                  📍{" "}
                  {region}

                </div>

              )}


              {accuracy !== "" &&
              accuracy !== null &&
              locationMode === "gps" && (

                <div
                  style={{
                    fontSize:
                      "12px",

                    opacity:
                      "0.75",
                  }}
                >

                  🎯{" "}
                  {Number(
                    accuracy
                  ).toFixed(1)}{" "}
                  {t("meters")}

                </div>

              )}

            </>

          )}

        </div>


        {/* =================================================
            CLOSE
        ================================================== */}

        <button
          type="button"

          onClick={
            onClose
          }

          style={{
            pointerEvents:
              "auto",

            border:
              "none",

            width:
              "46px",

            height:
              "46px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,0.96)",

            boxShadow:
              "0 3px 14px rgba(0,0,0,0.3)",

            fontSize:
              "22px",

            cursor:
              "pointer",
          }}
        >

          ✕

        </button>

      </div>


      {/* ===================================================
          COORDINATES
      =================================================== */}

      {latitude !== "" &&
      longitude !== "" && (

        <div
          style={{
            position:
              "absolute",

            bottom:
              "12px",

            left:
              "12px",

            right:
              "12px",

            zIndex:
              1000,

            background:
              "rgba(255,255,255,0.95)",

            backdropFilter:
              "blur(8px)",

            borderRadius:
              "13px",

            padding:
              "8px 12px",

            fontSize:
              "12px",

            direction:
              "ltr",

            textAlign:
              "center",

            boxShadow:
              "0 3px 12px rgba(0,0,0,0.25)",
          }}
        >

          📍{" "}

          {Number(
            latitude
          ).toFixed(6)}

          {" , "}

          {Number(
            longitude
          ).toFixed(6)}

        </div>

      )}

    </>

  );

}


// =========================================================
// MAP LAYERS
// =========================================================

function MapLayers() {

  return (

    <TileLayer

      attribution="
        Sources: Esri, TomTom, Garmin, FAO, NOAA,
        USGS, © OpenStreetMap contributors,
        GIS User Community
      "

      url="
        https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}
      "

      maxZoom={
        19
      }

    />

  );

}


// =========================================================
// PAGE
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
  // LANGUAGE
  // =========================================================

  const language =
    settings?.language ||
    "ar";


  // =========================================================
  // TRANSLATION
  // =========================================================

  const t =
    (key) =>
      translate(
        `map.${key}`,
        language
      );


  // =========================================================
  // FULLSCREEN
  // =========================================================

  const [
    fullscreen,
    setFullscreen,
  ] = useState(false);


  // =========================================================
  // MAP POSITION
  // =========================================================

  const mapPosition =
    useMemo(() => {

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


      return DEFAULT_POSITION;

    }, [
      latitude,
      longitude,
    ]);


  // =========================================================
  // OPEN FULLSCREEN
  // =========================================================

  const openFullscreenMap =
    () => {

      setFullscreen(
        true
      );

    };


  // =========================================================
  // CLOSE FULLSCREEN
  // =========================================================

  const closeFullscreenMap =
    () => {

      setFullscreen(
        false
      );

    };


  // =========================================================
  // GPS
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
  // MANUAL LOCATION
  // =========================================================

  const handleManualLocation =
    (
      lat,
      lng
    ) => {

      selectManualLocation(
        lat,
        lng
      );

    };


  // =========================================================
  // NORMAL MAP STYLE
  // =========================================================

  const mapStyle =
    {

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
  // FULLSCREEN MAP STYLE
  // =========================================================

  const fullscreenStyle =
    {

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

    };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div>

      {/* =====================================================
          NORMAL PAGE
      ====================================================== */}

      {!fullscreen && (

        <>

          <h1>
            📍{" "}
            {t("title")}
          </h1>


          <Card
            title={
              t("addLocation")
            }
          >

            {/* =================================================
                FARM
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
                    key={
                      farm.id
                    }

                    value={
                      farm.id
                    }
                  >

                    {farm.name}

                  </option>

                )
              )}

            </select>


            <br />
            <br />


            {/* =================================================
                TYPE
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
                MANUAL
            ================================================== */}

            <Button
              onClick={() => {

                setLocationMode(
                  "manual"
                );

                openFullscreenMap();

              }}
            >

              🗺️{" "}
              {t(
                "manualLocation"
              )}

            </Button>


            <br />
            <br />


            {/* =================================================
                SMALL MAP
            ================================================== */}

            <div
              style={
                mapStyle
              }
            >

              <MapContainer

                center={
                  mapPosition
                }

                zoom={
                  Number.isFinite(
                    Number(latitude)
                  ) &&
                  Number.isFinite(
                    Number(longitude)
                  )
                    ? GPS_ZOOM
                    : DEFAULT_ZOOM
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

                <MapLayers />


                <ManualLocationSelector

                  enabled={
                    locationMode ===
                    "manual"
                  }

                  onSelect={
                    handleManualLocation
                  }

                />


                <MapController

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


                {latitude !== "" &&
                longitude !== "" && (

                  <Marker

                    position={[
                      Number(
                        latitude
                      ),

                      Number(
                        longitude
                      ),
                    ]}

                    icon={
                      locationIcon
                    }

                  />

                )}

              </MapContainer>

            </div>


            {/* =================================================
                LOCATION INFORMATION
            ================================================== */}

            {latitude !== "" &&
            longitude !== "" && (

              <div
                style={{
                  marginTop:
                    "12px",

                  padding:
                    "12px",

                  borderRadius:
                    "12px",

                  background:
                    "#f5f5f5",

                  direction:
                    "rtl",
                }}
              >

                <strong>
                  📍{" "}
                  {t(
                    "locationDetected"
                  )}
                </strong>


                {placeName && (

                  <p>
                    📌{" "}
                    {placeName}
                  </p>

                )}


                {village && (

                  <p>
                    🏘️{" "}
                    {village}
                  </p>

                )}


                {region && (

                  <p>
                    📍{" "}
                    {region}
                  </p>

                )}


                <p
                  style={{
                    direction:
                      "ltr",
                  }}
                >

                  {Number(
                    latitude
                  ).toFixed(6)}

                  {" , "}

                  {Number(
                    longitude
                  ).toFixed(6)}

                </p>


                {accuracy !== "" && (

                  <p>

                    🎯{" "}
                    {Number(
                      accuracy
                    ).toFixed(1)}{" "}
                    {t("meters")}

                  </p>

                )}


                {locationTime && (

                  <p>

                    🕒{" "}
                    {locationTime}

                  </p>

                )}

              </div>

            )}


            <br />


            {/* =================================================
                VILLAGE
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

              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "10px",
              }}

            />


            <br />
            <br />


            {/* =================================================
                REGION
            ================================================== */}

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

              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "10px",
              }}

            />


            <br />
            <br />


            {/* =================================================
                PLACE
            ================================================== */}

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

              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "10px",
              }}

            />


            <br />
            <br />


            {/* =================================================
                NOTES
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

              style={{
                width:
                  "100%",

                minHeight:
                  "90px",

                boxSizing:
                  "border-box",

                padding:
                  "10px",
              }}

            />


            <br />
            <br />


            {/* =================================================
                SAVE
            ================================================== */}

            <Button
              onClick={
                addLocation
              }
            >

              💾{" "}
              {t("save")}

            </Button>

          </Card>


          {/* ===================================================
              SAVED LOCATIONS
          ==================================================== */}

          <h2>
            🗺️{" "}
            {t(
              "savedLocations"
            )}
          </h2>


          {locations.length === 0 ? (

            <p>
              {t(
                "noLocations"
              )}
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
                      {Number(
                        item.accuracy
                      ).toFixed(1)}
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


                  {item.notes && (

                    <p>
                      📝{" "}
                      {t("notes")}:
                      {" "}
                      {item.notes}
                    </p>

                  )}


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
          style={
            fullscreenStyle
          }
        >

          <MapContainer

            center={
              mapPosition
            }

            zoom={
              Number.isFinite(
                Number(latitude)
              ) &&
              Number.isFinite(
                Number(longitude)
              )
                ? GPS_ZOOM
                : DEFAULT_ZOOM
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

            <MapLayers />


            {/* =================================================
                MANUAL LOCATION
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
                MAP CONTROLLER
            ================================================== */}

            <MapController

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
                MARKER
            ================================================== */}

            {latitude !== "" &&
            longitude !== "" && (

              <Marker

                position={[
                  Number(
                    latitude
                  ),

                  Number(
                    longitude
                  ),
                ]}

                icon={
                  locationIcon
                }

              />

            )}


            {/* =================================================
                RECENTER
            ================================================== */}

            <RecenterButton

              latitude={
                latitude
              }

              longitude={
                longitude
              }

              t={
                t
              }

            />

          </MapContainer>


          {/* =================================================
              STATUS
          ================================================== */}

          <MapStatus

            loading={
              loading
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

            locationMode={
              locationMode
            }

            onClose={
              closeFullscreenMap
            }

            t={
              t
            }

          />


          {/* =================================================
              MANUAL MODE
          ================================================== */}

          {locationMode ===
            "manual" && (

            <div
              style={{
                position:
                  "absolute",

                bottom:
                  "62px",

                left:
                  "50%",

                transform:
                  "translateX(-50%)",

                zIndex:
                  1001,

                background:
                  "rgba(20,80,40,0.94)",

                color:
                  "#ffffff",

                padding:
                  "10px 18px",

                borderRadius:
                  "22px",

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

      )}

    </div>

  );

}
