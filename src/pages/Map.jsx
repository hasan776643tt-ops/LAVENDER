// src/pages/Map.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";

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
// DEFAULT MAP POSITION
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];

const DEFAULT_ZOOM = 14;

const EDITOR_ZOOM = 18;


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
        https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
      "

      maxZoom={19}

    />

  );

}


// =========================================================
// MAP RESIZE
// =========================================================

function MapResizeHandler() {

  const map = useMap();

  useEffect(() => {

    const timer =
      setTimeout(() => {

        map.invalidateSize();

      }, 300);

    return () => {

      clearTimeout(timer);

    };

  }, [map]);

  return null;

}


// =========================================================
// MAP CLICK SELECTOR
// =========================================================

function BoundaryPointSelector({
  enabled,
  onAddPoint,
}) {

  useMapEvents({

    click(event) {

      if (!enabled) {
        return;
      }

      onAddPoint([
        event.latlng.lat,
        event.latlng.lng,
      ]);

    },

  });

  return null;

}


// =========================================================
// MAP CENTER CONTROLLER
// =========================================================

function MapCenterController({
  center,
}) {

  const map = useMap();

  useEffect(() => {

    if (
      !center ||
      center.length !== 2
    ) {
      return;
    }

    const lat =
      Number(center[0]);

    const lng =
      Number(center[1]);

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
      map.getZoom(),
      {
        animate: true,
      }
    );

  }, [
    map,
    center,
  ]);

  return null;

}


// =========================================================
// GEO HELPERS
// =========================================================

function toRadians(value) {

  return (
    Number(value) *
    Math.PI /
    180
  );

}


// =========================================================
// DISTANCE BETWEEN TWO GPS POINTS
// =========================================================

function distanceMeters(
  pointA,
  pointB
) {

  const R =
    6371008.8;

  const lat1 =
    toRadians(pointA[0]);

  const lat2 =
    toRadians(pointB[0]);

  const deltaLat =
    toRadians(
      pointB[0] -
      pointA[0]
    );

  const deltaLng =
    toRadians(
      pointB[1] -
      pointA[1]
    );

  const a =
    Math.sin(
      deltaLat / 2
    ) ** 2 +

    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(
      deltaLng / 2
    ) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}


// =========================================================
// POLYGON PERIMETER
// =========================================================

function calculatePerimeter(
  points
) {

  if (
    !Array.isArray(points) ||
    points.length < 3
  ) {

    return 0;

  }

  let total = 0;

  for (
    let i = 0;
    i < points.length;
    i++
  ) {

    const current =
      points[i];

    const next =
      points[
        (i + 1) %
        points.length
      ];

    total +=
      distanceMeters(
        current,
        next
      );

  }

  return total;

}


// =========================================================
// POLYGON AREA
// =========================================================

function calculateArea(
  points
) {

  if (
    !Array.isArray(points) ||
    points.length < 3
  ) {

    return 0;

  }

  const earthRadius =
    6378137;

  const latReference =
    points.reduce(
      (
        total,
        point
      ) =>
        total +
        toRadians(point[0]),
      0
    ) /
    points.length;

  const cosLat =
    Math.cos(
      latReference
    );

  const projected =
    points.map(
      (point) => {

        const lat =
          toRadians(
            point[0]
          );

        const lng =
          toRadians(
            point[1]
          );

        return [

          earthRadius *
          lng *
          cosLat,

          earthRadius *
          lat,

        ];

      }
    );

  let area = 0;

  for (
    let i = 0;
    i < projected.length;
    i++
  ) {

    const current =
      projected[i];

    const next =
      projected[
        (i + 1) %
        projected.length
      ];

    area +=
      (
        current[0] *
        next[1]
      ) -
      (
        next[0] *
        current[1]
      );

  }

  return Math.abs(
    area / 2
  );

}


// =========================================================
// FORMAT AREA
// =========================================================

function formatArea(
  area
) {

  if (
    !Number.isFinite(area) ||
    area <= 0
  ) {

    return "0";

  }

  if (area >= 10000) {

    return (
      `${(area / 10000).toFixed(2)} هكتار`
    );

  }

  return (
    `${area.toFixed(1)} م²`
  );

}


// =========================================================
// FORMAT DISTANCE
// =========================================================

function formatDistance(
  distance
) {

  if (
    !Number.isFinite(distance) ||
    distance <= 0
  ) {

    return "0 م";

  }

  if (distance >= 1000) {

    return (
      `${(distance / 1000).toFixed(2)} كم`
    );

  }

  return (
    `${distance.toFixed(1)} م`
  );

}


// =========================================================
// FIELD MEASUREMENTS
// =========================================================

function FieldMeasurements({
  points,
  t,
}) {

  const perimeter =
    useMemo(
      () =>
        calculatePerimeter(
          points
        ),
      [points]
    );

  const area =
    useMemo(
      () =>
        calculateArea(
          points
        ),
      [points]
    );

  const sides =
    useMemo(() => {

      if (
        !Array.isArray(points) ||
        points.length < 2
      ) {

        return [];

      }

      return points.map(
        (
          point,
          index
        ) => {

          const next =
            points[
              (index + 1) %
              points.length
            ];

          return distanceMeters(
            point,
            next
          );

        }
      );

    }, [points]);

  if (
    points.length < 2
  ) {

    return (

      <div
        style={{
          marginTop: "14px",
          padding: "18px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.96)",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.20)",
          direction: "rtl",
        }}
      >

        <strong
          style={{
            fontSize: "18px",
          }}
        >

          📐{" "}
          {t("drawFieldFirst")}

        </strong>

      </div>

    );

  }

  return (

    <div
      style={{
        marginTop: "14px",
        padding: "18px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.97)",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.20)",
        direction: "rtl",
      }}
    >

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "12px",
        }}
      >

        <div
          style={{
            padding: "14px",
            borderRadius: "14px",
            background: "#f2f7f3",
          }}
        >

          <div
            style={{
              fontSize: "14px",
              opacity: 0.75,
            }}
          >

            📐{" "}
            {t("fieldArea")}

          </div>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "19px",
            }}
          >

            {formatArea(area)}

          </strong>

        </div>


        <div
          style={{
            padding: "14px",
            borderRadius: "14px",
            background: "#f2f7f3",
          }}
        >

          <div
            style={{
              fontSize: "14px",
              opacity: 0.75,
            }}
          >

            📏{" "}
            {t("fieldPerimeter")}

          </div>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "19px",
            }}
          >

            {formatDistance(
              perimeter
            )}

          </strong>

        </div>

      </div>


      <div
        style={{
          marginTop: "14px",
          fontSize: "15px",
          fontWeight: "700",
        }}
      >

        📏{" "}
        {t("fieldBoundaries")}

      </div>


      <div
        style={{
          marginTop: "8px",
          display: "grid",
          gap: "7px",
        }}
      >

        {sides.map(
          (
            side,
            index
          ) => (

            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding:
                  "9px 11px",
                borderRadius:
                  "10px",
                background:
                  "#f7f7f7",
              }}
            >

              <span>

                {t("boundary")}{" "}
                {index + 1}

              </span>

              <strong>

                {formatDistance(
                  side
                )}

              </strong>

            </div>

          )
        )}

      </div>

    </div>

  );

}


// =========================================================
// LOCATION FORM
// =========================================================

function LocationTextForm({
  country,
  setCountry,
  province,
  setProvince,
  town,
  setTown,
  description,
  setDescription,
  t,
}) {

  const inputStyle = {

    width: "100%",

    minHeight: "58px",

    boxSizing:
      "border-box",

    padding:
      "14px 16px",

    border:
      "2px solid #d7ded9",

    borderRadius:
      "14px",

    fontSize:
      "18px",

    background:
      "#ffffff",

    outline:
      "none",

  };

  const textareaStyle = {

    ...inputStyle,

    minHeight:
      "130px",

    resize:
      "vertical",

    lineHeight:
      "1.8",

  };

  return (

    <div
      style={{
        display: "grid",
        gap: "14px",
        direction: "rtl",
      }}
    >

      <label>

        <strong>
          🌍{" "}
          {t("country")}
        </strong>

        <input
          type="text"
          value={country}
          onChange={(event) =>
            setCountry(
              event.target.value
            )
          }
          placeholder={
            t("countryPlaceholder")
          }
          style={{
            ...inputStyle,
            marginTop: "7px",
          }}
        />

      </label>


      <label>

        <strong>
          🏛️{" "}
          {t("province")}
        </strong>

        <input
          type="text"
          value={province}
          onChange={(event) =>
            setProvince(
              event.target.value
            )
          }
          placeholder={
            t("provincePlaceholder")
          }
          style={{
            ...inputStyle,
            marginTop: "7px",
          }}
        />

      </label>


      <label>

        <strong>
          🏘️{" "}
          {t("town")}
        </strong>

        <input
          type="text"
          value={town}
          onChange={(event) =>
            setTown(
              event.target.value
            )
          }
          placeholder={
            t("townPlaceholder")
          }
          style={{
            ...inputStyle,
            marginTop: "7px",
          }}
        />

      </label>


      <label>

        <strong>
          📍{" "}
          {t("fieldDescription")}
        </strong>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder={
            t(
              "fieldDescriptionPlaceholder"
            )
          }
          style={{
            ...textareaStyle,
            marginTop: "7px",
          }}
        />

      </label>

    </div>

  );

}


// =========================================================
// MAP EDITOR
// =========================================================

function FieldMapEditor({
  points,
  setPoints,
  t,
}) {

  const [center, setCenter] =
    useState(
      DEFAULT_POSITION
    );


  const addPoint =
    (point) => {

      setPoints(
        (current) => [
          ...current,
          point,
        ]
      );

      setCenter(
        point
      );

    };


  const removeLastPoint =
    () => {

      setPoints(
        (current) =>
          current.slice(
            0,
            -1
          )
      );

    };


  const clearPoints =
    () => {

      setPoints([]);

    };


  return (

    <div
      style={{
        position: "fixed",
        inset: "0",
        zIndex: "9999",
        background: "#ffffff",
      }}
    >

      <MapContainer

        center={
          points.length > 0
            ? points[points.length - 1]
            : DEFAULT_POSITION
        }

        zoom={
          points.length > 0
            ? EDITOR_ZOOM
            : DEFAULT_ZOOM
        }

        scrollWheelZoom={true}

        zoomControl={true}

        style={{
          width: "100%",
          height: "100%",
        }}

      >

        <MapLayers />

        <MapResizeHandler />

        <MapCenterController
          center={center}
        />

        <BoundaryPointSelector
          enabled={true}
          onAddPoint={
            addPoint
          }
        />


        {/* ================================================
            FIELD POLYGON
        ================================================= */}

        {points.length >= 3 && (

          <Polygon

            positions={
              points
            }

            pathOptions={{
              color:
                "#d32f2f",

              weight:
                4,

              fillColor:
                "#ef5350",

              fillOpacity:
                0.25,

            }}

          />

        )}


        {/* ================================================
            OPEN POLYLINE
        ================================================= */}

        {points.length >= 2 && (
          points.length < 3
            ? (
              <Polyline
                positions={
                  points
                }
                pathOptions={{
                  color:
                    "#d32f2f",
                  weight:
                    4,
                }}
              />
            )
            : null
        )}


        {/* ================================================
            POINTS
        ================================================= */}

        {points.map(
          (
            point,
            index
          ) => (

            <CircleMarker

              key={
                `${point[0]}-${point[1]}-${index}`
              }

              center={
                point
              }

              radius={
                9
              }

              pathOptions={{
                color:
                  "#ffffff",

                weight:
                  3,

                fillColor:
                  "#d32f2f",

                fillOpacity:
                  1,

              }}

            />

          )
        )}

      </MapContainer>


      {/* ===================================================
          TOP BAR
      ================================================= */}

      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          right: "12px",
          zIndex: 1001,

          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: "10px",

          direction: "rtl",
        }}
      >

        <div
          style={{
            flex: 1,
            padding:
              "13px 16px",
            borderRadius:
              "16px",
            background:
              "rgba(255,255,255,0.96)",
            boxShadow:
              "0 3px 15px rgba(0,0,0,0.25)",
            fontSize:
              "17px",
            fontWeight:
              "800",
          }}
        >

          🗺️{" "}
          {t("drawField")}

        </div>


        <button
          type="button"
          onClick={
            () => {
              window.dispatchEvent(
                new CustomEvent(
                  "lavender-close-map-editor"
                )
              );
            }
          }
          style={{
            width: "50px",
            height: "50px",
            border: "none",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.96)",
            boxShadow:
              "0 3px 15px rgba(0,0,0,0.25)",
            fontSize:
              "24px",
          }}
        >

          ✕

        </button>

      </div>


      {/* ===================================================
          INSTRUCTION
      =================================================== */}

      <div
        style={{
          position:
            "absolute",

          top:
            "78px",

          left:
            "12px",

          right:
            "12px",

          zIndex:
            1000,

          padding:
            "12px 15px",

          borderRadius:
            "16px",

          background:
            "rgba(20,80,40,0.94)",

          color:
            "#ffffff",

          textAlign:
            "center",

          fontSize:
            "16px",

          fontWeight:
            "700",

          direction:
            "rtl",

          boxShadow:
            "0 3px 15px rgba(0,0,0,0.30)",
        }}
      >

        👆{" "}
        {t(
          "drawFieldInstruction"
        )}

      </div>


      {/* ===================================================
          POINT COUNT
      =================================================== */}

      <div
        style={{
          position:
            "absolute",

          bottom:
            "150px",

          left:
            "12px",

          zIndex:
            1000,

          padding:
            "10px 14px",

          borderRadius:
            "14px",

          background:
            "rgba(255,255,255,0.96)",

          boxShadow:
            "0 3px 14px rgba(0,0,0,0.25)",

          direction:
            "rtl",

          fontWeight:
            "800",

          fontSize:
            "15px",
        }}
      >

        📍{" "}
        {t("points")}:{" "}
        {points.length}

      </div>


      {/* ===================================================
          BOTTOM CONTROLS
      =================================================== */}

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
            1001,

          display:
            "grid",

          gridTemplateColumns:
            "1fr 1fr 1fr",

          gap:
            "8px",

          direction:
            "rtl",
        }}
      >

        <button
          type="button"
          onClick={
            removeLastPoint
          }
          disabled={
            points.length === 0
          }
          style={{
            minHeight:
              "54px",
            border:
              "none",
            borderRadius:
              "14px",
            fontSize:
              "16px",
            fontWeight:
              "800",
            background:
              "#ffffff",
          }}
        >

          ↩️{" "}
          {t("undo")}

        </button>


        <button
          type="button"
          onClick={
            clearPoints
          }
          disabled={
            points.length === 0
          }
          style={{
            minHeight:
              "54px",
            border:
              "none",
            borderRadius:
              "14px",
            fontSize:
              "16px",
            fontWeight:
              "800",
            background:
              "#ffffff",
          }}
        >

          🗑️{" "}
          {t("clearPoints")}

        </button>


        <button
          type="button"
          onClick={
            () => {

              window.dispatchEvent(
                new CustomEvent(
                  "lavender-save-map-editor"
                )
              );

            }
          }
          disabled={
            points.length < 3
          }
          style={{
            minHeight:
              "54px",
            border:
              "none",
            borderRadius:
              "14px",
            fontSize:
              "16px",
            fontWeight:
              "900",
            background:
              points.length >= 3
                ? "#1b7f3a"
                : "#bdbdbd",
            color:
              "#ffffff",
          }}
        >

          💾{" "}
          {t("saveField")}

        </button>

      </div>

    </div>

  );

}


// =========================================================
// MAIN PAGE
// =========================================================

export default function Map() {

  const {
    farms = [],
    locations = [],

    farmId,
    setFarmId,

    locationType,
    setLocationType,

    notes,
    setNotes,

    loading,

    addLocation,
    deleteLocation,

  } = useMapHook();


  const {
    settings,
  } = useSettings();


  const language =
    settings?.language ||
    "ar";


  const t =
    (key) =>
      translate(
        `map.${key}`,
        language
      );


  // =========================================================
  // LOCATION METHOD
  // =========================================================

  const [
    locationMethod,
    setLocationMethod,
  ] = useState(
    "text"
  );


  // =========================================================
  // WRITTEN LOCATION
  // =========================================================

  const [
    country,
    setCountry,
  ] = useState("");

  const [
    province,
    setProvince,
  ] = useState("");

  const [
    town,
    setTown,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");


  // =========================================================
  // FIELD POINTS
  // =========================================================

  const [
    fieldPoints,
    setFieldPoints,
  ] = useState([]);


  // =========================================================
  // MAP EDITOR
  // =========================================================

  const [
    mapEditor,
    setMapEditor,
  ] = useState(false);


  // =========================================================
  // OPEN MAP EDITOR
  // =========================================================

  const openMapEditor =
    () => {

      setLocationMethod(
        "map"
      );

      setMapEditor(
        true
      );

    };


  // =========================================================
  // CLOSE MAP EDITOR
  // =========================================================

  const closeMapEditor =
    () => {

      setMapEditor(
        false
      );

    };


  // =========================================================
  // SAVE MAP EDITOR
  // =========================================================

  useEffect(() => {

    const handleSave =
      () => {

        if (
          fieldPoints.length < 3
        ) {

          alert(
            t(
              "atLeastThreePoints"
            )
          );

          return;

        }

        setMapEditor(
          false
        );

      };


    const handleClose =
      () => {

        setMapEditor(
          false
        );

      };


    window.addEventListener(
      "lavender-save-map-editor",
      handleSave
    );

    window.addEventListener(
      "lavender-close-map-editor",
      handleClose
    );

    return () => {

      window.removeEventListener(
        "lavender-save-map-editor",
        handleSave
      );

      window.removeEventListener(
        "lavender-close-map-editor",
        handleClose
      );

    };

  }, [
    fieldPoints,
    language,
  ]);


  // =========================================================
  // SAVE LOCATION
  // =========================================================

  const handleSave =
    async () => {

      if (!farmId) {

        alert(
          t(
            "farmRequired"
          )
        );

        return;

      }


      if (
        locationMethod === "text" &&
        !country.trim() &&
        !province.trim() &&
        !town.trim()
      ) {

        alert(
          t(
            "locationTextRequired"
          )
        );

        return;

      }


      if (
        locationMethod === "map" &&
        fieldPoints.length < 3
      ) {

        alert(
          t(
            "atLeastThreePoints"
          )
        );

        return;

      }


      const area =
        calculateArea(
          fieldPoints
        );

      const perimeter =
        calculatePerimeter(
          fieldPoints
        );


      const firstPoint =
        fieldPoints.length > 0
          ? fieldPoints[0]
          : null;


      const locationData = {

        farmId:
          String(farmId),

        farmName:
          farms.find(
            (farm) =>
              String(farm.id) ===
              String(farmId)
          )?.name ||
          t("farm"),

        type:
          locationType ||
          "farm",

        method:
          locationMethod,

        country:
          country.trim(),

        province:
          province.trim(),

        town:
          town.trim(),

        description:
          description.trim(),

        fieldPoints:
          fieldPoints.map(
            (point) => ({
              latitude:
                Number(point[0]),

              longitude:
                Number(point[1]),
            })
          ),

        area:
          area,

        perimeter:
          perimeter,

        latitude:
          firstPoint
            ? Number(
                firstPoint[0]
              )
            : null,

        longitude:
          firstPoint
            ? Number(
                firstPoint[1]
              )
            : null,

        notes:
          notes.trim(),

        createdAt:
          new Date().toISOString(),

        status:
          "active",

      };


      try {

        await addLocation(
          locationData
        );


        setCountry("");
        setProvince("");
        setTown("");
        setDescription("");
        setFieldPoints([]);
        setNotes("");
        setLocationMethod(
          "text"
        );


        alert(
          t("saveSuccess")
        );


      } catch (error) {

        console.error(
          "Failed to save field location:",
          error
        );

        alert(
          error?.message ||
          t("saveError")
        );

      }

    };


  // =========================================================
  // DEFAULT MAP CENTER
  // =========================================================

  const savedCenter =
    useMemo(() => {

      const firstLocation =
        locations?.find(
          (item) =>
            Number.isFinite(
              Number(
                item.latitude
              )
            ) &&
            Number.isFinite(
              Number(
                item.longitude
              )
            )
        );


      if (!firstLocation) {

        return DEFAULT_POSITION;

      }


      return [

        Number(
          firstLocation.latitude
        ),

        Number(
          firstLocation.longitude
        ),

      ];

    }, [
      locations,
    ]);


  // =========================================================
  // FULLSCREEN MAP EDITOR
  // =========================================================

  if (mapEditor) {

    return (

      <FieldMapEditor

        points={
          fieldPoints
        }

        setPoints={
          setFieldPoints
        }

        t={
          t
        }

      />

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div
      style={{
        padding:
          "12px",
        direction:
          "rtl",
      }}
    >

      <h1
        style={{
          fontSize:
            "28px",
          marginBottom:
            "18px",
        }}
      >

        🗺️{" "}
        {t("title")}

      </h1>


      {/* =====================================================
          FARM
      ====================================================== */}

      <Card
        title={
          t("selectFarm")
        }
      >

        <select
          value={
            farmId || ""
          }

          onChange={
            (event) =>
              setFarmId(
                event.target.value
              )
          }

          style={{
            width:
              "100%",

            minHeight:
              "58px",

            padding:
              "12px",

            borderRadius:
              "14px",

            border:
              "2px solid #d7ded9",

            fontSize:
              "18px",

            background:
              "#ffffff",
          }}
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


        <div
          style={{
            height:
              "16px",
          }}
        />


        <select
          value={
            locationType ||
            "farm"
          }

          onChange={
            (event) =>
              setLocationType(
                event.target.value
              )
          }

          style={{
            width:
              "100%",

            minHeight:
              "58px",

            padding:
              "12px",

            borderRadius:
              "14px",

            border:
              "2px solid #d7ded9",

            fontSize:
              "18px",

            background:
              "#ffffff",
          }}
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

      </Card>


      <div
        style={{
          height:
            "14px",
        }}
      />


      {/* =====================================================
          METHOD
      ====================================================== */}

      <Card
        title={
          t("chooseLocationMethod")
        }
      >

        <div
          style={{
            display:
              "grid",
            gap:
              "12px",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setLocationMethod(
                "text"
              )
            }
            style={{
              minHeight:
                "72px",

              border:
                locationMethod ===
                "text"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              borderRadius:
                "16px",

              background:
                locationMethod ===
                "text"
                  ? "#edf8f0"
                  : "#ffffff",

              fontSize:
                "19px",

              fontWeight:
                "800",

              textAlign:
                "right",

              padding:
                "12px 16px",
            }}
          >

            ✍️{" "}
            {t("writeLocation")}

            <div
              style={{
                fontSize:
                  "14px",
                fontWeight:
                  "400",
                marginTop:
                  "5px",
              }}
            >

              {t(
                "writeLocationDescription"
              )}

            </div>

          </button>


          <button
            type="button"
            onClick={
              openMapEditor
            }
            style={{
              minHeight:
                "72px",

              border:
                locationMethod ===
                "map"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              borderRadius:
                "16px",

              background:
                locationMethod ===
                "map"
                  ? "#edf8f0"
                  : "#ffffff",

              fontSize:
                "19px",

              fontWeight:
                "800",

              textAlign:
                "right",

              padding:
                "12px 16px",
            }}
          >

            🗺️{" "}
            {t("drawLocation")}

            <div
              style={{
                fontSize:
                  "14px",
                fontWeight:
                  "400",
                marginTop:
                  "5px",
              }}
            >

              {t(
                "drawLocationDescription"
              )}

            </div>

          </button>

        </div>

      </Card>


      <div
        style={{
          height:
            "14px",
        }}
      />


      {/* =====================================================
          WRITTEN LOCATION
      ====================================================== */}

      {locationMethod ===
        "text" && (

        <Card
          title={
            `✍️ ${t("writeLocation")}`
          }
        >

          <LocationTextForm

            country={
              country
            }

            setCountry={
              setCountry
            }

            province={
              province
            }

            setProvince={
              setProvince
            }

            town={
              town
            }

            setTown={
              setTown
            }

            description={
              description
            }

            setDescription={
              setDescription
            }

            t={
              t
            }

          />

        </Card>

      )}


      {/* =====================================================
          MAP METHOD
      ====================================================== */}

      {locationMethod ===
        "map" && (

        <Card
          title={
            `🗺️ ${t("drawLocation")}`
          }
        >

          <div
            style={{
              padding:
                "18px",
              borderRadius:
                "16px",
              background:
                "#f2f7f3",
              direction:
                "rtl",
              fontSize:
                "17px",
              lineHeight:
                "1.8",
            }}
          >

            <strong>
              {t(
                "drawLocationDescription"
              )}
            </strong>

            <p
              style={{
                marginBottom:
                  "8px",
              }}
            >

              {t(
                "drawLocationSteps"
              )}

            </p>

            <Button
              onClick={
                openMapEditor
              }
            >

              🗺️{" "}
              {t("openFullMap")}

            </Button>

          </div>


          <FieldMeasurements

            points={
              fieldPoints
            }

            t={
              t
            }

          />

        </Card>

      )}


      <div
        style={{
          height:
            "14px",
        }}
      />


      {/* =====================================================
          FIELD DESCRIPTION
      ====================================================== */}

      <Card
        title={
          `📍 ${t("fieldDescription")}`
        }
      >

        <textarea

          value={
            notes || ""
          }

          onChange={
            (event) =>
              setNotes(
                event.target.value
              )
          }

          placeholder={
            t(
              "fieldDescriptionPlaceholder"
            )
          }

          style={{
            width:
              "100%",

            minHeight:
              "140px",

            boxSizing:
              "border-box",

            padding:
              "16px",

            border:
              "2px solid #d7ded9",

            borderRadius:
              "14px",

            fontSize:
              "18px",

            lineHeight:
              "1.8",

            resize:
              "vertical",

          }}

        />

      </Card>


      <div
        style={{
          height:
            "18px",
        }}
      />


      {/* =====================================================
          MEASUREMENTS
      ====================================================== */}

      {locationMethod ===
        "map" && (

        <FieldMeasurements

          points={
            fieldPoints
          }

          t={
            t
          }

        />

      )}


      <div
        style={{
          height:
              "18px",
        }}
      />


      {/* =====================================================
          SAVE
      ====================================================== */}

      <Button
        onClick={
          handleSave
        }
      >

        {loading
          ? `⏳ ${t("saving")}`
          : `💾 ${t("saveField")}`}

      </Button>


      {/* =====================================================
          SAVED LOCATIONS
      ====================================================== */}

      <h2
        style={{
          marginTop:
            "28px",
          fontSize:
            "23px",
        }}
      >

        🗺️{" "}
        {t(
          "savedLocations"
        )}

      </h2>


      {locations.length ===
      0 ? (

        <p
          style={{
            fontSize:
              "17px",
          }}
        >

          {t(
            "noLocations"
          )}

        </p>

      ) : (

        <div
          style={{
            display:
              "grid",
            gap:
              "14px",
          }}
        >

          {locations.map(
            (item) => (

              <Card

                key={
                  item.id
                }

                title={
                  item.town ||
                  item.placeName ||
                  item.farmName ||
                  t("field")
                }

              >

                {item.farmName && (

                  <p>
                    🚜{" "}
                    {item.farmName}
                  </p>

                )}


                {item.country && (

                  <p>
                    🌍{" "}
                    {item.country}
                  </p>

                )}


                {item.province && (

                  <p>
                    🏛️{" "}
                    {item.province}
                  </p>

                )}


                {item.town && (

                  <p>
                    🏘️{" "}
                    {item.town}
                  </p>

                )}


                {item.description && (

                  <p>
                    📍{" "}
                    {item.description}
                  </p>

                )}


                {item.area > 0 && (

                  <p>
                    📐{" "}
                    {t("fieldArea")}:
                    {" "}
                    {formatArea(
                      Number(
                        item.area
                      )
                    )}
                  </p>

                )}


                {item.perimeter > 0 && (

                  <p>
                    📏{" "}
                    {t("fieldPerimeter")}:
                    {" "}
                    {formatDistance(
                      Number(
                        item.perimeter
                      )
                    )}
                  </p>

                )}


                {Array.isArray(
                  item.fieldPoints
                ) &&
                item.fieldPoints.length >= 3 && (

                  <p>

                    📍{" "}
                    {t("points")}:{" "}
                    {
                      item.fieldPoints.length
                    }

                  </p>

                )}


                {item.notes && (

                  <p>
                    📝{" "}
                    {item.notes}
                  </p>

                )}


                {item.latitude !==
                  undefined &&
                item.longitude !==
                  undefined &&
                item.latitude !==
                  null &&
                item.longitude !==
                  null && (

                  <a
                    href={
                      `https://maps.google.com/?q=` +
                      `${item.latitude},${item.longitude}`
                    }

                    target="_blank"

                    rel="noreferrer"

                    style={{
                      fontSize:
                        "17px",
                    }}
                  >

                    🗺️{" "}
                    {t(
                      "openGoogleMaps"
                    )}

                  </a>

                )}


                <div
                  style={{
                    height:
                      "12px",
                  }}
                />


                <Button
                  onClick={() =>
                    deleteLocation(
                      item.id
                    )
                  }
                >

                  🗑️{" "}
                  {t("delete")}

                </Button>

              </Card>

            )
          )}

        </div>

      )}

    </div>

  );

}
