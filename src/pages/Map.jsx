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

import useMapHook from "../hooks/useMap.js";

import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

import {
  translate,
} from "../utils/translation";

import {
  useSettings,
} from "../context/SettingsContext";


// =========================================================
// DEFAULT MAP
// =========================================================

const DEFAULT_POSITION = [
  36.7,
  38.7,
];

const DEFAULT_ZOOM = 14;

const EDITOR_ZOOM = 18;


// =========================================================
// SAFE NUMBER
// =========================================================

function toNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;

}


// =========================================================
// GEO RADIANS
// =========================================================

function toRadians(value) {

  return (
    Number(value) *
    Math.PI /
    180
  );

}


// =========================================================
// DISTANCE METERS
// =========================================================

function distanceMeters(
  pointA,
  pointB
) {

  if (
    !Array.isArray(pointA) ||
    !Array.isArray(pointB) ||
    pointA.length < 2 ||
    pointB.length < 2
  ) {

    return 0;

  }

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

  const earthRadius =
    6371008.8;

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

  return earthRadius * c;

}


// =========================================================
// PERIMETER
// =========================================================

function calculatePerimeter(
  points
) {

  if (
    !Array.isArray(points) ||
    points.length < 2
  ) {

    return 0;

  }

  let total = 0;

  for (
    let index = 0;
    index < points.length;
    index++
  ) {

    const current =
      points[index];

    const next =
      points[
        (index + 1) %
        points.length
      ];

    // لا نغلق الشكل إلا عندما توجد 3 نقاط أو أكثر.
    if (
      points.length < 3 &&
      index === points.length - 1
    ) {

      break;

    }

    total +=
      distanceMeters(
        current,
        next
      );

  }

  return total;

}


// =========================================================
// AREA
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

  const validPoints =
    points.filter(
      (point) =>
        Array.isArray(point) &&
        point.length >= 2 &&
        Number.isFinite(
          Number(point[0])
        ) &&
        Number.isFinite(
          Number(point[1])
        )
    );

  if (
    validPoints.length < 3
  ) {

    return 0;

  }

  const referenceLatitude =
    validPoints.reduce(
      (
        total,
        point
      ) =>
        total +
        toRadians(point[0]),
      0
    ) /
    validPoints.length;

  const cosLatitude =
    Math.cos(
      referenceLatitude
    );

  const projected =
    validPoints.map(
      (point) => {

        const latitude =
          toRadians(
            point[0]
          );

        const longitude =
          toRadians(
            point[1]
          );

        return [

          earthRadius *
          longitude *
          cosLatitude,

          earthRadius *
          latitude,

        ];

      }
    );

  let area = 0;

  for (
    let index = 0;
    index < projected.length;
    index++
  ) {

    const current =
      projected[index];

    const next =
      projected[
        (index + 1) %
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

  const value =
    Number(area);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    return "0 م²";

  }

  if (
    value >= 10000
  ) {

    return (
      `${(
        value / 10000
      ).toFixed(2)} هكتار`
    );

  }

  return (
    `${value.toFixed(1)} م²`
  );

}


// =========================================================
// FORMAT DISTANCE
// =========================================================

function formatDistance(
  distance
) {

  const value =
    Number(distance);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    return "0 م";

  }

  if (
    value >= 1000
  ) {

    return (
      `${(
        value / 1000
      ).toFixed(2)} كم`
    );

  }

  return (
    `${value.toFixed(1)} م`
  );

}


// =========================================================
// MAP TILE LAYER
// =========================================================

function MapLayers() {

  return (

    <TileLayer

      attribution="
        © OpenStreetMap contributors
        © Esri
      "

      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

      maxZoom={19}

    />

  );

}


// =========================================================
// MAP RESIZE
// =========================================================

function MapResizeHandler() {

  const map =
    useMap();

  useEffect(() => {

    const timer =
      window.setTimeout(
        () => {

          map.invalidateSize();

        },
        300
      );

    return () => {

      window.clearTimeout(
        timer
      );

    };

  }, [map]);

  return null;

}


// =========================================================
// MAP CENTER
// =========================================================

function MapCenterController({
  center,
}) {

  const map =
    useMap();

  useEffect(() => {

    if (
      !Array.isArray(center) ||
      center.length !== 2
    ) {

      return;

    }

    const latitude =
      toNumber(
        center[0]
      );

    const longitude =
      toNumber(
        center[1]
      );

    if (
      latitude === null ||
      longitude === null
    ) {

      return;

    }

    map.setView(
      [
        latitude,
        longitude,
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
// MAP CLICK SELECTOR
// =========================================================

function BoundaryPointSelector({
  onAddPoint,
}) {

  useMapEvents({

    click(event) {

      const latitude =
        Number(
          event.latlng.lat
        );

      const longitude =
        Number(
          event.latlng.lng
        );

      if (
        !Number.isFinite(
          latitude
        ) ||
        !Number.isFinite(
          longitude
        )
      ) {

        return;

      }

      onAddPoint([
        latitude,
        longitude,
      ]);

    },

  });

  return null;

}


// =========================================================
// FIELD MEASUREMENTS
// =========================================================

function FieldMeasurements({
  points,
  t,
}) {

  const safePoints =
    Array.isArray(points)
      ? points
      : [];

  const area =
    useMemo(
      () =>
        calculateArea(
          safePoints
        ),
      [safePoints]
    );

  const perimeter =
    useMemo(
      () =>
        calculatePerimeter(
          safePoints
        ),
      [safePoints]
    );

  const sides =
    useMemo(() => {

      if (
        safePoints.length < 2
      ) {

        return [];

      }

      if (
        safePoints.length === 2
      ) {

        return [
          distanceMeters(
            safePoints[0],
            safePoints[1]
          ),
        ];

      }

      return safePoints.map(
        (
          point,
          index
        ) => {

          const next =
            safePoints[
              (index + 1) %
              safePoints.length
            ];

          return distanceMeters(
            point,
            next
          );

        }
      );

    }, [safePoints]);

  if (
    safePoints.length < 2
  ) {

    return (

      <div
        style={{
          marginTop: "14px",
          padding: "18px",
          borderRadius: "18px",
          background:
            "rgba(255,255,255,0.97)",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.18)",
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
        background:
          "rgba(255,255,255,0.97)",
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.18)",
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


      {safePoints.length >= 3 && (

        <>

          <div
            style={{
              marginTop: "16px",
              fontSize: "15px",
              fontWeight: "800",
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

        </>

      )}

    </div>

  );

}


// =========================================================
// LOCATION TEXT FORM
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
          onChange={
            (event) =>
              setCountry(
                event.target.value
              )
          }
          placeholder={
            t(
              "countryPlaceholder"
            )
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
          onChange={
            (event) =>
              setProvince(
                event.target.value
              )
          }
          placeholder={
            t(
              "provincePlaceholder"
            )
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
          onChange={
            (event) =>
              setTown(
                event.target.value
              )
          }
          placeholder={
            t(
              "townPlaceholder"
            )
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
          onChange={
            (event) =>
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
            ...inputStyle,
            minHeight: "130px",
            resize: "vertical",
            lineHeight: "1.8",
            marginTop: "7px",
          }}
        />

      </label>

    </div>

  );

}


// =========================================================
// FULL SCREEN FIELD MAP EDITOR
// =========================================================

function FieldMapEditor({
  points,
  setPoints,
  t,
  onClose,
  onSave,
}) {

  const safePoints =
    Array.isArray(points)
      ? points
      : [];

  const [center, setCenter] =
    useState(
      safePoints.length > 0
        ? safePoints[
            safePoints.length - 1
          ]
        : DEFAULT_POSITION
    );


  // ---------------------------------------------------------
  // ADD POINT
  // ---------------------------------------------------------

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


  // ---------------------------------------------------------
  // UNDO
  // ---------------------------------------------------------

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


  // ---------------------------------------------------------
  // CLEAR
  // ---------------------------------------------------------

  const clearPoints =
    () => {

      setPoints([]);

      setCenter(
        DEFAULT_POSITION
      );

    };


  // ---------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------

  const save =
    () => {

      if (
        safePoints.length < 3
      ) {

        alert(
          t(
            "atLeastThreePoints"
          )
        );

        return;

      }

      onSave();

    };


  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
      }}
    >

      <MapContainer

        center={
          safePoints.length > 0
            ? safePoints[
                safePoints.length - 1
              ]
            : DEFAULT_POSITION
        }

        zoom={
          safePoints.length > 0
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
          onAddPoint={
            addPoint
          }
        />


        {/* ===============================================
            POLYGON
        ================================================ */}

        {safePoints.length >= 3 && (

          <Polygon

            positions={
              safePoints
            }

            pathOptions={{
              color: "#d32f2f",
              weight: 4,
              fillColor: "#ef5350",
              fillOpacity: 0.25,
            }}

          />

        )}


        {/* ===============================================
            OPEN LINE
        ================================================ */}

        {safePoints.length === 2 && (

          <Polyline

            positions={
              safePoints
            }

            pathOptions={{
              color: "#d32f2f",
              weight: 4,
            }}

          />

        )}


        {/* ===============================================
            POINTS
        ================================================ */}

        {safePoints.map(
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

              radius={9}

              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#d32f2f",
                fillOpacity: 1,
              }}

            />

          )
        )}

      </MapContainer>


      {/* =================================================
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
          alignItems: "center",
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
            onClose
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
            cursor:
              "pointer",
          }}
        >

          ✕

        </button>

      </div>


      {/* =================================================
          INSTRUCTION
      ================================================= */}

      <div
        style={{
          position: "absolute",
          top: "78px",
          left: "12px",
          right: "12px",
          zIndex: 1000,

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


      {/* =================================================
          POINT COUNT
      ================================================= */}

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
        {safePoints.length}

      </div>


      {/* =================================================
          BOTTOM BUTTONS
      ================================================= */}

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
            safePoints.length === 0
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
            cursor:
              "pointer",
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
            safePoints.length === 0
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
            cursor:
              "pointer",
          }}
        >

          🗑️{" "}
          {t("clearPoints")}

        </button>


        <button
          type="button"
          onClick={
            save
          }
          disabled={
            safePoints.length < 3
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
              safePoints.length >= 3
                ? "#1b7f3a"
                : "#bdbdbd",

            color:
              "#ffffff",

            cursor:
              safePoints.length >= 3
                ? "pointer"
                : "not-allowed",
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
// MAIN MAP PAGE
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


  // =======================================================
  // LOCATION METHOD
  // =======================================================

  const [
    locationMethod,
    setLocationMethod,
  ] = useState("text");


  // =======================================================
  // TEXT LOCATION
  // =======================================================

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


  // =======================================================
  // FIELD POINTS
  // =======================================================

  const [
    fieldPoints,
    setFieldPoints,
  ] = useState([]);


  // =======================================================
  // MAP EDITOR
  // =======================================================

  const [
    mapEditor,
    setMapEditor,
  ] = useState(false);


  // =======================================================
  // OPEN EDITOR
  // =======================================================

  const openMapEditor =
    () => {

      setLocationMethod(
        "map"
      );

      setMapEditor(
        true
      );

    };


  // =======================================================
  // CLOSE EDITOR
  // =======================================================

  const closeMapEditor =
    () => {

      setMapEditor(
        false
      );

    };


  // =======================================================
  // SAVE FROM EDITOR
  // =======================================================

  const saveMapEditor =
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


  // =======================================================
  // VALIDATE FARM
  // =======================================================

  const selectedFarm =
    useMemo(() => {

      return farms.find(
        (farm) =>
          String(farm.id) ===
          String(farmId)
      );

    }, [
      farms,
      farmId,
    ]);


  // =======================================================
  // SAVE LOCATION
  // =======================================================

  const handleSave =
    async () => {

      // ---------------------------------------------------
      // FARM
      // ---------------------------------------------------

      if (!farmId) {

        alert(
          t(
            "farmRequired"
          )
        );

        return;

      }


      // ---------------------------------------------------
      // TEXT VALIDATION
      // ---------------------------------------------------

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


      // ---------------------------------------------------
      // MAP VALIDATION
      // ---------------------------------------------------

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


      // ---------------------------------------------------
      // MEASUREMENTS
      // ---------------------------------------------------

      const area =
        locationMethod === "map"
          ? calculateArea(
              fieldPoints
            )
          : 0;

      const perimeter =
        locationMethod === "map"
          ? calculatePerimeter(
              fieldPoints
            )
          : 0;


      // ---------------------------------------------------
      // FIRST POINT
      // ---------------------------------------------------

      const firstPoint =
        fieldPoints.length > 0
          ? fieldPoints[0]
          : null;


      // ---------------------------------------------------
      // LOCATION DATA
      // ---------------------------------------------------

      const locationData = {

        farmId:
          String(farmId),

        farmName:
          selectedFarm?.name ||
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
                Number(
                  point[0]
                ),

              longitude:
                Number(
                  point[1]
                ),

            })
          ),

        area,

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
          notes?.trim() ||
          "",

        createdAt:
          new Date().toISOString(),

        status:
          "active",

      };


      // ---------------------------------------------------
      // SAVE
      // ---------------------------------------------------

      try {

        await addLocation(
          locationData
        );


        // -----------------------------------------------
        // RESET FORM
        // -----------------------------------------------

        setCountry("");

        setProvince("");

        setTown("");

        setDescription("");

        setFieldPoints([]);

        setNotes("");

        setLocationMethod(
          "text"
        );


      } catch (error) {

        console.error(
          "Map save error:",
          error
        );

        alert(
          error?.message ||
          t("saveError")
        );

      }

    };


  // =======================================================
  // SAVED MAP CENTER
  // =======================================================

  const savedCenter =
    useMemo(() => {

      const location =
        locations.find(
          (item) => {

            const latitude =
              toNumber(
                item?.latitude
              );

            const longitude =
              toNumber(
                item?.longitude
              );

            return (
              latitude !== null &&
              longitude !== null
            );

          }
        );


      if (!location) {

        return DEFAULT_POSITION;

      }


      return [

        Number(
          location.latitude
        ),

        Number(
          location.longitude
        ),

      ];

    }, [
      locations,
    ]);


  // =======================================================
  // FULLSCREEN EDITOR
  // =======================================================

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

        onClose={
          closeMapEditor
        }

        onSave={
          saveMapEditor
        }

      />

    );

  }


  // =======================================================
  // MAIN UI
  // =======================================================

  return (

    <div
      style={{
        padding: "12px",
        direction: "rtl",
      }}
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <h1
        style={{
          fontSize: "28px",
          marginBottom: "18px",
        }}
      >

        🗺️{" "}
        {t("title")}

      </h1>


      {/* =================================================
          FARM
      ================================================= */}

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
            width: "100%",
            minHeight: "58px",
            padding: "12px",
            borderRadius: "14px",
            border:
              "2px solid #d7ded9",
            fontSize: "18px",
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
            height: "16px",
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
            width: "100%",
            minHeight: "58px",
            padding: "12px",
            borderRadius: "14px",
            border:
              "2px solid #d7ded9",
            fontSize: "18px",
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
          height: "14px",
        }}
      />


      {/* =================================================
          METHOD
      ================================================= */}

      <Card
        title={
          t("chooseLocationMethod")
        }
      >

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >

          <button
            type="button"
            onClick={
              () =>
                setLocationMethod(
                  "text"
                )
            }
            style={{
              minHeight: "72px",

              border:
                locationMethod === "text"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              borderRadius: "16px",

              background:
                locationMethod === "text"
                  ? "#edf8f0"
                  : "#ffffff",

              fontSize: "19px",
              fontWeight: "800",
              textAlign: "right",
              padding: "12px 16px",
            }}
          >

            ✍️{" "}
            {t("writeLocation")}

            <div
              style={{
                fontSize: "14px",
                fontWeight: "400",
                marginTop: "5px",
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
              minHeight: "72px",

              border:
                locationMethod === "map"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              borderRadius: "16px",

              background:
                locationMethod === "map"
                  ? "#edf8f0"
                  : "#ffffff",

              fontSize: "19px",
              fontWeight: "800",
              textAlign: "right",
              padding: "12px 16px",
            }}
          >

            🗺️{" "}
            {t("drawLocation")}

            <div
              style={{
                fontSize: "14px",
                fontWeight: "400",
                marginTop: "5px",
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
          height: "14px",
        }}
      />


      {/* =================================================
          TEXT LOCATION
      ================================================= */}

      {locationMethod === "text" && (

        <Card
          title={
            `✍️ ${t(
              "writeLocation"
            )}`
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


      {/* =================================================
          MAP LOCATION
      ================================================= */}

      {locationMethod === "map" && (

        <Card
          title={
            `🗺️ ${t(
              "drawLocation"
            )}`
          }
        >

          <div
            style={{
              padding: "18px",
              borderRadius: "16px",
              background: "#f2f7f3",
              direction: "rtl",
              fontSize: "17px",
              lineHeight: "1.8",
            }}
          >

            <strong>
              {t(
                "drawLocationDescription"
              )}
            </strong>

            <p
              style={{
                marginBottom: "10px",
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
              {t(
                "openFullMap"
              )}

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
          height: "14px",
        }}
      />


      {/* =================================================
          NOTES
      ================================================= */}

      <Card
        title={
          `📍 ${t(
            "fieldDescription"
          )}`
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
            width: "100%",
            minHeight: "140px",
            boxSizing: "border-box",
            padding: "16px",
            border:
              "2px solid #d7ded9",
            borderRadius: "14px",
            fontSize: "18px",
            lineHeight: "1.8",
            resize: "vertical",
          }}
        />

      </Card>


      {/* =================================================
          MEASUREMENTS
      ================================================= */}

      {locationMethod === "map" && (

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
          height: "18px",
        }}
      />


      {/* =================================================
          SAVE
      ================================================= */}

      <Button
        onClick={
          handleSave
        }
      >

        {loading
          ? `⏳ ${t("saving")}`
          : `💾 ${t("saveField")}`}

      </Button>


      {/* =================================================
          SAVED LOCATIONS
      ================================================= */}

      <h2
        style={{
          marginTop: "28px",
          fontSize: "23px",
        }}
      >

        🗺️{" "}
        {t(
          "savedLocations"
        )}

      </h2>


      {locations.length === 0 ? (

        <p
          style={{
            fontSize: "17px",
          }}
        >

          {t(
            "noLocations"
          )}

        </p>

      ) : (

        <div
          style={{
            display: "grid",
            gap: "14px",
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


                {Number(item.area) > 0 && (

                  <p>
                    📐{" "}
                    {t(
                      "fieldArea"
                    )}
                    :{" "}
                    {formatArea(
                      Number(
                        item.area
                      )
                    )}
                  </p>

                )}


                {Number(item.perimeter) > 0 && (

                  <p>
                    📏{" "}
                    {t(
                      "fieldPerimeter"
                    )}
                    :{" "}
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
                    {t(
                      "points"
                    )}
                    :{" "}
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


                {item.latitude !== null &&
                item.latitude !== undefined &&
                item.longitude !== null &&
                item.longitude !== undefined && (

                  <a
                    href={
                      `https://maps.google.com/?q=` +
                      `${item.latitude},${item.longitude}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "17px",
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
                    height: "12px",
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
                  {t(
                    "delete"
                  )}

                </Button>

              </Card>

            )
          )}

        </div>

      )}

    </div>

  );

}
