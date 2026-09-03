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
  Polygon,
  Polyline,
  CircleMarker,
  Circle,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import useMapHook from "../hooks/useMap.js";

import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

import {
  calculateArea,
  calculatePerimeter,
  formatArea,
  formatDistance,
} from "../utils/geoUtils.js";

// ============================================================
// LAVENDER — MAP / GPS AREA
// ============================================================

const DEFAULT_POSITION = [36.7, 38.7];

const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

const GPS_GOOD_ACCURACY = 50;
const GPS_ACCEPTABLE_ACCURACY = 100;

const GPS_MIN_DISTANCE = 3;
const GPS_MAX_DISTANCE = 35;

const GPS_TIMEOUT = 15000;

// ============================================================
// HELPERS
// ============================================================

const clean = value =>
  String(value ?? "").trim();

const getFarmId = farm =>
  clean(
    farm?.id ??
      farm?._id ??
      farm?.farmId
  );

const getFarmName = farm =>
  clean(
    farm?.name ??
      farm?.farmName ??
      farm?.title
  );

const isPoint = point =>
  Array.isArray(point) &&
  point.length >= 2 &&
  Number.isFinite(Number(point[0])) &&
  Number.isFinite(Number(point[1]));

const normalizePoint = point =>
  isPoint(point)
    ? [
        Number(point[0]),
        Number(point[1]),
      ]
    : null;

const normalizePoints = points => {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(point => {
      if (
        point &&
        typeof point === "object" &&
        !Array.isArray(point)
      ) {
        return normalizePoint([
          point.latitude,
          point.longitude,
        ]);
      }

      return normalizePoint(point);
    })
    .filter(Boolean);
};

// ============================================================
// DISTANCE BETWEEN GPS POINTS
// ============================================================

function distanceBetweenPoints(a, b) {
  if (!isPoint(a) || !isPoint(b)) {
    return Infinity;
  }

  const R = 6371000;

  const lat1 =
    (Number(a[0]) * Math.PI) / 180;

  const lat2 =
    (Number(b[0]) * Math.PI) / 180;

  const dLat =
    ((Number(b[0]) - Number(a[0])) *
      Math.PI) /
    180;

  const dLng =
    ((Number(b[1]) - Number(a[1])) *
      Math.PI) /
    180;

  const sinLat =
    Math.sin(dLat / 2);

  const sinLng =
    Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(lat1) *
      Math.cos(lat2) *
      sinLng *
      sinLng;

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(h),
      Math.sqrt(1 - h)
    )
  );
}

// ============================================================
// CENTER
// ============================================================

function calculateCenter(points) {
  const safe =
    normalizePoints(points);

  if (!safe.length) {
    return null;
  }

  const latitude =
    safe.reduce(
      (sum, point) =>
        sum + point[0],
      0
    ) / safe.length;

  const longitude =
    safe.reduce(
      (sum, point) =>
        sum + point[1],
      0
    ) / safe.length;

  return [
    latitude,
    longitude,
  ];
}

// ============================================================
// GPS AREA VERTEX
// ============================================================

const vertexIcon =
  new L.DivIcon({
    className:
      "lavender-map-vertex",

    html: `
      <div
        style="
          width:20px;
          height:20px;
          border-radius:50%;
          background:#0b6e32;
          border:3px solid #ffffff;
          box-sizing:border-box;
          box-shadow:0 2px 8px rgba(0,0,0,0.45);
        "
      ></div>
    `,

    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// ============================================================
// MAP LAYERS
// ============================================================

function MapLayers() {
  return (
    <>
      <TileLayer
        attribution="© Esri © Maxar © Earthstar Geographics"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      <TileLayer
        attribution="© Esri © OpenStreetMap contributors"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        opacity={0.9}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      <TileLayer
        attribution="© Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      <TileLayer
        attribution="© OpenStreetMap contributors © CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
        maxNativeZoom={19}
        opacity={0.95}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />
    </>
  );
}

// ============================================================
// MAP RESIZE
// ============================================================

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        try {
          map.invalidateSize(false);
        } catch (error) {
          console.warn(
            "Map resize failed:",
            error
          );
        }
      }, 300);

    return () =>
      window.clearTimeout(timer);
  }, [map]);

  return null;
}

// ============================================================
// MANUAL MAP CLICK
// ============================================================

function BoundaryPointSelector({
  onAddPoint,
  disabled,
}) {
  useMapEvents({
    click(event) {
      if (disabled) {
        return;
      }

      if (!event?.latlng) {
        return;
      }

      const point =
        normalizePoint([
          event.latlng.lat,
          event.latlng.lng,
        ]);

      if (point) {
        onAddPoint(point);
      }
    },
  });

  return null;
}

// ============================================================
// GPS AREA CONTROLLER
// ============================================================

function GPSAreaController({
  tracking,
  onPosition,
  onStatus,
  onTrackingError,
}) {
  const map = useMap();

  const watchIdRef =
    useRef(null);

  const firstFixRef =
    useRef(true);

  const lastAddedPointRef =
    useRef(null);

  useEffect(() => {
    if (!tracking) {
      return undefined;
    }

    if (
      typeof navigator ===
        "undefined" ||
      !navigator.geolocation
    ) {
      onStatus?.({
        type: "error",
        message:
          "📍 جهازك لا يدعم GPS.",
      });

      onTrackingError?.();

      return undefined;
    }

    if (
      typeof window !==
        "undefined" &&
      window.isSecureContext === false
    ) {
      onStatus?.({
        type: "error",
        message:
          "⚠️ قياس GPS يحتاج HTTPS آمن.",
      });

      onTrackingError?.();

      return undefined;
    }

    firstFixRef.current = true;
    lastAddedPointRef.current = null;

    onStatus?.({
      type: "loading",
      message:
        "📡 جارٍ انتظار إشارة GPS...",
    });

    const handleSuccess =
      position => {
        const latitude =
          Number(
            position?.coords?.latitude
          );

        const longitude =
          Number(
            position?.coords?.longitude
          );

        const accuracy =
          Number(
            position?.coords?.accuracy
          );

        if (
          !Number.isFinite(
            latitude
          ) ||
          !Number.isFinite(
            longitude
          ) ||
          !Number.isFinite(
            accuracy
          )
        ) {
          return;
        }

        const point = [
          latitude,
          longitude,
        ];

        onPosition?.({
          point,
          accuracy,
        });

        if (
          accuracy >
          GPS_ACCEPTABLE_ACCURACY
        ) {
          onStatus?.({
            type: "warning",
            message:
              `⚠️ إشارة GPS ضعيفة — الدقة ±${Math.round(
                accuracy
              )}م. انتظر قليلًا.`,
          });

          return;
        }

        if (
          firstFixRef.current
        ) {
          firstFixRef.current =
            false;

          lastAddedPointRef.current =
            point;

          onPosition?.({
            point,
            accuracy,
            addPoint: true,
          });

          try {
            map.setView(
              point,
              Math.max(
                map.getZoom(),
                GPS_ZOOM
              ),
              {
                animate: false,
              }
            );
          } catch (error) {
            console.warn(
              "GPS setView failed:",
              error
            );
          }

          onStatus?.({
            type:
              accuracy <=
              GPS_GOOD_ACCURACY
                ? "success"
                : "warning",

            message:
              `🚶 بدأ قياس GPS — الدقة ±${Math.round(
                accuracy
              )}م. امشِ حول حدود الأرض.`,
          });

          return;
        }

        const lastPoint =
          lastAddedPointRef.current;

        const distance =
          distanceBetweenPoints(
            lastPoint,
            point
          );

        if (
          distance <
          GPS_MIN_DISTANCE
        ) {
          onStatus?.({
            type:
              "loading",
            message:
              `📡 GPS يعمل — الدقة ±${Math.round(
                accuracy
              )}م`,
          });

          return;
        }

        if (
          distance >
          GPS_MAX_DISTANCE
        ) {
          onStatus?.({
            type:
              "warning",
            message:
              "⚠️ تغير GPS بشكل كبير، تم تجاهل النقطة غير الموثوقة.",
          });

          return;
        }

        lastAddedPointRef.current =
          point;

        onPosition?.({
          point,
          accuracy,
          addPoint: true,
        });

        onStatus?.({
          type:
            accuracy <=
            GPS_GOOD_ACCURACY
              ? "success"
              : "loading",

          message:
            `🚶 جارٍ تسجيل حدود الأرض — الدقة ±${Math.round(
              accuracy
            )}م`,
        });
      };

    const handleError =
      error => {
        console.error(
          "GPS watch error:",
          error
        );

        if (
          error?.code === 1
        ) {
          onStatus?.({
            type: "error",
            message:
              "⚠️ لم يتم السماح باستخدام الموقع. فعّل إذن الموقع للمتصفح.",
          });

          onTrackingError?.();
          return;
        }

        if (
          error?.code === 2
        ) {
          onStatus?.({
            type: "warning",
            message:
              "📡 تعذر تحديد GPS حاليًا. تحرك إلى مكان مفتوح وانتظر الإشارة.",
          });

          return;
        }

        if (
          error?.code === 3
        ) {
          onStatus?.({
            type: "warning",
            message:
              "⏳ GPS تأخر في الاستجابة، وما زال يحاول تحديد الموقع...",
          });

          return;
        }

        onStatus?.({
          type: "error",
          message:
            "⚠️ حدث خطأ أثناء قياس GPS.",
        });
      };

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: GPS_TIMEOUT,
        }
      );

    return () => {
      if (
        watchIdRef.current !==
        null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current =
          null;
      }
    };
  }, [
    tracking,
    map,
    onPosition,
    onStatus,
    onTrackingError,
  ]);

  return null;
}

// ============================================================
// GPS VISUAL
// ============================================================

function GPSLocationVisual({
  gpsPosition,
  gpsAccuracy,
}) {
  if (
    !Array.isArray(
      gpsPosition
    )
  ) {
    return null;
  }

  const accuracy =
    Number(gpsAccuracy);

  return (
    <>
      {Number.isFinite(
        accuracy
      ) &&
        accuracy > 0 && (
          <Circle
            center={gpsPosition}
            radius={accuracy}
            interactive={false}
            pathOptions={{
              color: "#1976d2",
              weight: 2,
              fillColor: "#2196f3",
              fillOpacity: 0.08,
            }}
          />
        )}

      <CircleMarker
        center={gpsPosition}
        radius={9}
        interactive={false}
        pathOptions={{
          color: "#ffffff",
          weight: 4,
          fillColor: "#1976d2",
          fillOpacity: 1,
        }}
      />
    </>
  );
}

// ============================================================
// FIELD
// ============================================================

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  minHeight = "70px",
}) {
  return (
    <label
      style={{
        display: "block",
        direction: "rtl",
      }}
    >
      <strong
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "17px",
        }}
      >
        {label}
      </strong>

      {textarea ? (
        <textarea
          value={value}
          onChange={e =>
            onChange(
              e.target.value
            )
          }
          placeholder={
            placeholder
          }
          style={{
            width: "100%",
            boxSizing:
              "border-box",
            minHeight,
            padding: "14px",
            border:
              "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            lineHeight: "1.8",
            background:
              "#ffffff",
            outline: "none",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e =>
            onChange(
              e.target.value
            )
          }
          placeholder={
            placeholder
          }
          style={{
            width: "100%",
            boxSizing:
              "border-box",
            minHeight: "64px",
            padding: "14px",
            border:
              "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            lineHeight: "1.8",
            background:
              "#ffffff",
            outline: "none",
          }}
        />
      )}
    </label>
  );
}

// ============================================================
// TEXT LOCATION FORM
// ============================================================

function TextLocationForm({
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  town,
  setTown,
  description,
  setDescription,
  northNeighbor,
  setNorthNeighbor,
  southNeighbor,
  setSouthNeighbor,
  eastNeighbor,
  setEastNeighbor,
  westNeighbor,
  setWestNeighbor,
  notes,
  setNotes,
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "18px",
        direction: "rtl",
      }}
    >
      <Field
        label="🌍 البلد"
        value={country}
        onChange={setCountry}
        placeholder="مثال: سوريا"
      />

      <Field
        label="🏛️ المحافظة / المنطقة"
        value={province}
        onChange={setProvince}
        placeholder="مثال: الرقة"
      />

      <Field
        label="🏙️ المدينة"
        value={city}
        onChange={setCity}
        placeholder="اسم المدينة"
      />

      <Field
        label="🏘️ البلدة / القرية"
        value={town}
        onChange={setTown}
        placeholder="مثال: الأبيض"
      />

      <Field
        textarea
        minHeight="140px"
        label="📍 وصف موقع الأرض"
        value={description}
        onChange={setDescription}
        placeholder="اكتب وصفًا واضحًا لمكان الأرض"
      />

      <div
        style={{
          padding: "18px",
          borderRadius: "18px",
          background: "#f2f7f3",
          display: "grid",
          gap: "14px",
        }}
      >
        <strong
          style={{
            fontSize: "19px",
          }}
        >
          🧭 الجهات المحيطة بالأرض
        </strong>

        <Field
          label="⬆️ جار الشمال"
          value={
            northNeighbor
          }
          onChange={
            setNorthNeighbor
          }
          placeholder="من يجاور الأرض من الشمال؟"
        />

        <Field
          label="⬇️ جار الجنوب"
          value={
            southNeighbor
          }
          onChange={
            setSouthNeighbor
          }
          placeholder="من يجاور الأرض من الجنوب؟"
        />

        <Field
          label="➡️ جار الشرق"
          value={
            eastNeighbor
          }
          onChange={
            setEastNeighbor
          }
          placeholder="من يجاور الأرض من الشرق؟"
        />

        <Field
          label="⬅️ جار الغرب"
          value={
            westNeighbor
          }
          onChange={
            setWestNeighbor
          }
          placeholder="من يجاور الأرض من الغرب؟"
        />
      </div>

      <Field
        textarea
        minHeight="140px"
        label="📝 ملاحظات"
        value={notes}
        onChange={setNotes}
        placeholder="أي معلومات إضافية"
      />
    </div>
  );
}

// ============================================================
// GPS BUTTON
// ============================================================

function GPSButton({
  tracking,
  onStart,
  onStop,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={
        tracking
          ? onStop
          : onStart
      }
      disabled={disabled}
      style={{
        width: "100%",
        minHeight: "64px",
        border: "none",
        borderRadius: "17px",
        background: tracking
          ? "#b71c1c"
          : "#1976d2",
        color: "#ffffff",
        fontSize: "18px",
        fontWeight: "900",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.28)",
        direction: "rtl",
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled
          ? 0.6
          : 1,
      }}
    >
      {tracking
        ? "⏹️ إيقاف قياس GPS"
        : "🚶 بدء قياس الأرض بالمشي GPS"}
    </button>
  );
}

// ============================================================
// MAP EDITOR
// ============================================================

function FieldMapEditor({
  points,
  setPoints,
  onClose,
  onSave,
}) {
  const safePoints =
    normalizePoints(points);

  const [
    tracking,
    setTracking,
  ] = useState(false);

  const [
    gpsPosition,
    setGpsPosition,
  ] = useState(null);

  const [
    gpsAccuracy,
    setGpsAccuracy,
  ] = useState(null);

  const [
    gpsStatus,
    setGpsStatus,
  ] = useState({
    type: "idle",
    message: "",
  });

  const [
    manualMode,
    setManualMode,
  ] = useState(false);

  // ==========================================================
  // GPS POSITION
  // ==========================================================

  const handleGPSPosition =
    data => {
      if (
        !data ||
        !Array.isArray(
          data.point
        )
      ) {
        return;
      }

      setGpsPosition(
        data.point
      );

      setGpsAccuracy(
        Number(
          data.accuracy
        )
      );

      if (
        data.addPoint
      ) {
        setPoints(current => {
          const next =
            normalizePoints(
              current
            );

          const last =
            next[next.length - 1];

          if (
            last &&
            distanceBetweenPoints(
              last,
              data.point
            ) <
              GPS_MIN_DISTANCE
          ) {
            return next;
          }

          return [
            ...next,
            data.point,
          ];
        });
      }
    };

  // ==========================================================
  // START GPS
  // ==========================================================

  const startTracking =
    () => {
      if (tracking) {
        return;
      }

      setManualMode(false);

      setTracking(true);

      setGpsStatus({
        type: "loading",
        message:
          "📡 جارٍ تشغيل قياس GPS...",
      });
    };

  // ==========================================================
  // STOP GPS
  // ==========================================================

  const stopTracking =
    () => {
      setTracking(false);

      setGpsStatus({
        type: "success",
        message:
          "⏹️ تم إيقاف قياس GPS. راجع الحدود ثم اعتمدها.",
      });
    };

  // ==========================================================
  // MANUAL MODE
  // ==========================================================

  const enableManual =
    () => {
      if (tracking) {
        stopTracking();
      }

      setManualMode(true);

      setGpsStatus({
        type: "idle",
        message:
          "👆 وضع التحديد اليدوي: اضغط على زوايا الأرض.",
      });
    };

  // ==========================================================
  // ADD MANUAL POINT
  // ==========================================================

  const addManualPoint =
    point => {
      const normalized =
        normalizePoint(point);

      if (!normalized) {
        return;
      }

      setPoints(
        current => [
          ...normalizePoints(
            current
          ),
          normalized,
        ]
      );
    };

  // ==========================================================
  // UNDO
  // ==========================================================

  const undo =
    () => {
      setPoints(
        current =>
          normalizePoints(
            current
          ).slice(0, -1)
      );
    };

  // ==========================================================
  // CLEAR
  // ==========================================================

  const clear =
    () => {
      setPoints([]);

      setGpsStatus({
        type: "idle",
        message:
          tracking
            ? "📡 القياس مستمر — سيتم تسجيل نقطة GPS جديدة."
            : "",
      });
    };

  // ==========================================================
  // MOVE POINT
  // ==========================================================

  const movePoint =
    (
      index,
      position
    ) => {
      if (
        !position ||
        !Number.isFinite(
          Number(position.lat)
        ) ||
        !Number.isFinite(
          Number(position.lng)
        )
      ) {
        return;
      }

      setPoints(
        current =>
          normalizePoints(
            current
          ).map(
            (
              item,
              itemIndex
            ) =>
              itemIndex ===
              index
                ? [
                    Number(
                      position.lat
                    ),
                    Number(
                      position.lng
                    ),
                  ]
                : item
          )
      );
    };

  // ==========================================================
  // SAVE
  // ==========================================================

  const save =
    () => {
      if (tracking) {
        stopTracking();
      }

      if (
        safePoints.length < 3
      ) {
        alert(
          "يجب تسجيل 3 نقاط على الأقل لحفظ حدود الأرض."
        );

        return;
      }

      onSave();
    };

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      setTracking(false);
    };
  }, []);

  // ==========================================================
  // CENTER
  // ==========================================================

  const initialCenter =
    safePoints.length
      ? safePoints[
          safePoints.length - 1
        ]
      : DEFAULT_POSITION;

  const initialZoom =
    safePoints.length
      ? GPS_ZOOM
      : DEFAULT_ZOOM;

  // ==========================================================
  // LIVE MEASUREMENTS
  // ==========================================================

  const liveArea =
    safePoints.length >= 3
      ? calculateArea(
          safePoints
        )
      : null;

  const livePerimeter =
    safePoints.length >= 2
      ? calculatePerimeter(
          safePoints
        )
      : null;

  const center =
    calculateCenter(
      safePoints
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* ====================================================
          MAP
      ==================================================== */}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        zoomControl
        doubleClickZoom={false}
        dragging
        touchZoom
        boxZoom
        keyboard
        zoomAnimation
        fadeAnimation={false}
        markerZoomAnimation={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <MapLayers />

        <MapResizeHandler />

        <BoundaryPointSelector
          onAddPoint={
            addManualPoint
          }
          disabled={
            !manualMode ||
            tracking
          }
        />

        <GPSAreaController
          tracking={tracking}
          onPosition={
            handleGPSPosition
          }
          onStatus={
            setGpsStatus
          }
          onTrackingError={() =>
            setTracking(false)
          }
        />

        <GPSLocationVisual
          gpsPosition={
            gpsPosition
          }
          gpsAccuracy={
            gpsAccuracy
          }
        />

        {/* ==================================================
            TRACKED PATH
        ================================================== */}

        {safePoints.length >=
          2 && (
          <Polyline
            positions={
              safePoints
            }
            interactive={false}
            pathOptions={{
              color: "#00d084",
              weight: 5,
              opacity: 0.95,
            }}
          />
        )}

        {/* ==================================================
            AREA
        ================================================== */}

        {safePoints.length >=
          3 && (
          <Polygon
            positions={
              safePoints
            }
            interactive={false}
            pathOptions={{
              color: "#0b6e32",
              weight: 4,
              fillColor: "#39a852",
              fillOpacity: 0.25,
            }}
          />
        )}

        {/* ==================================================
            VERTICES
        ================================================== */}

        {safePoints.map(
          (
            point,
            index
          ) => (
            <Marker
              key={`vertex-${index}`}
              position={point}
              icon={vertexIcon}
              draggable={!tracking}
              eventHandlers={{
                dragend: event => {
                  if (tracking) {
                    return;
                  }

                  const position =
                    event.target.getLatLng();

                  movePoint(
                    index,
                    position
                  );
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[
                  0,
                  -10,
                ]}
              >
                النقطة{" "}
                {index + 1}
              </Tooltip>
            </Marker>
          )
        )}

        {safePoints.map(
          (
            point,
            index
          ) => (
            <CircleMarker
              key={`center-${index}`}
              center={point}
              radius={3}
              interactive={false}
              pathOptions={{
                color: "#ffffff",
                weight: 1,
                fillColor:
                  "#ffffff",
                fillOpacity: 1,
              }}
            />
          )
        )}
      </MapContainer>

      {/* ====================================================
          OVERLAY
      ==================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 100000,
          pointerEvents: "none",
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            right: "12px",
            display: "flex",
            gap: "10px",
            direction: "rtl",
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: "52px",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius: "16px",
              background:
                "rgba(255,255,255,0.96)",
              boxShadow:
                "0 3px 15px rgba(0,0,0,0.25)",
              fontSize: "18px",
              fontWeight: "900",
              pointerEvents:
                "none",
            }}
          >
            🛰️ GPS Area — قياس الأرض
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "52px",
              height: "52px",
              border: "none",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.96)",
              boxShadow:
                "0 3px 15px rgba(0,0,0,0.25)",
              fontSize: "24px",
              fontWeight: "900",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            ✕
          </button>
        </div>

        {/* ==================================================
            GPS CONTROL
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: "78px",
            left: "12px",
            right: "12px",
            direction: "rtl",
            pointerEvents: "auto",
          }}
        >
          <GPSButton
            tracking={tracking}
            onStart={
              startTracking
            }
            onStop={
              stopTracking
            }
            disabled={false}
          />

          <button
            type="button"
            onClick={
              enableManual
            }
            disabled={tracking}
            style={{
              width: "100%",
              minHeight: "50px",
              marginTop: "8px",
              border:
                manualMode
                  ? "3px solid #0b6e32"
                  : "none",
              borderRadius: "15px",
              background:
                manualMode
                  ? "#edf8f0"
                  : "#ffffff",
              color:
                "#155d2b",
              fontSize: "16px",
              fontWeight: "900",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.25)",
              cursor: tracking
                ? "not-allowed"
                : "pointer",
              opacity: tracking
                ? 0.5
                : 1,
            }}
          >
            👆 التحديد اليدوي بالنقر
          </button>

          {gpsStatus.message && (
            <div
              style={{
                marginTop: "8px",
                padding:
                  "10px 12px",
                borderRadius: "13px",
                background:
                  gpsStatus.type ===
                  "error"
                    ? "rgba(183,28,28,0.94)"
                    : gpsStatus.type ===
                      "warning"
                    ? "rgba(180,110,0,0.95)"
                    : gpsStatus.type ===
                      "success"
                    ? "rgba(20,90,50,0.94)"
                    : "rgba(30,70,100,0.94)",
                color: "#ffffff",
                textAlign:
                  "center",
                fontSize: "14px",
                fontWeight: "800",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.25)",
                pointerEvents:
                  "none",
              }}
            >
              {
                gpsStatus.message
              }
            </div>
          )}
        </div>

        {/* ==================================================
            INSTRUCTION
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top:
              gpsStatus.message
                ? "205px"
                : "145px",
            left: "12px",
            right: "12px",
            padding: "14px",
            borderRadius: "16px",
            background:
              tracking
                ? "rgba(0,75,40,0.96)"
                : "rgba(20,80,40,0.94)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "900",
            direction: "rtl",
            boxShadow:
              "0 3px 15px rgba(0,0,0,0.3)",
            pointerEvents:
              "none",
          }}
        >
          {tracking ? (
            <>
              🚶 امشِ حول حدود الأرض

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                📡 سيتم تسجيل النقاط
                تلقائيًا أثناء المشي
              </div>
            </>
          ) : manualMode ? (
            <>
              👆 اضغط على زوايا الأرض

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                يمكنك سحب أي نقطة
                لتصحيح مكانها
              </div>
            </>
          ) : (
            <>
              🚶 ابدأ بقياس الأرض
              باستخدام GPS

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                اضغط «بدء قياس GPS»
                ثم امشِ حول الحدود
              </div>
            </>
          )}
        </div>

        {/* ==================================================
            GPS INFORMATION
        ================================================== */}

        {gpsPosition && (
          <div
            style={{
              position: "absolute",
              bottom:
                "250px",
              right: "12px",
              padding:
                "10px 13px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.96)",
              boxShadow:
                "0 3px 14px rgba(0,0,0,0.25)",
              fontSize: "13px",
              fontWeight: "800",
              direction: "rtl",
              pointerEvents:
                "none",
            }}
          >
            📍 GPS

            {Number.isFinite(
              Number(
                gpsAccuracy
              )
            ) && (
              <div
                style={{
                  marginTop: "4px",
                }}
              >
                الدقة: ±
                {Math.round(
                  Number(
                    gpsAccuracy
                  )
                )}
                م
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            POINTS
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "12px",
            padding:
              "10px 14px",
            borderRadius: "14px",
            background:
              "rgba(255,255,255,0.96)",
            boxShadow:
              "0 3px 14px rgba(0,0,0,0.25)",
            fontWeight: "900",
            direction: "rtl",
            pointerEvents:
              "none",
          }}
        >
          📍 النقاط:{" "}
          {
            safePoints.length
          }
        </div>

        {/* ==================================================
            MEASUREMENTS
        ================================================== */}

        {safePoints.length >=
          2 && (
          <div
            style={{
              position: "absolute",
              bottom: "180px",
              right: "12px",
              padding:
                "10px 14px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.96)",
              boxShadow:
                "0 3px 14px rgba(0,0,0,0.25)",
              fontWeight: "900",
              direction: "rtl",
              minWidth: "165px",
              pointerEvents:
                "none",
            }}
          >
            {safePoints.length >=
              3 && (
              <div>
                📐 المساحة:{" "}
                {
                  formatArea(
                    liveArea
                  )
                }
              </div>
            )}

            <div
              style={{
                marginTop:
                  safePoints.length >=
                  3
                    ? "5px"
                    : "0",
              }}
            >
              📏 المحيط:{" "}
              {
                formatDistance(
                  livePerimeter
                )
              }
            </div>
          </div>
        )}

        {/* ==================================================
            CENTER
        ================================================== */}

        {center && (
          <div
            style={{
              position: "absolute",
              bottom: "125px",
              left: "12px",
              padding:
                "8px 11px",
              borderRadius: "12px",
              background:
                "rgba(255,255,255,0.92)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.18)",
              fontSize: "11px",
              direction: "ltr",
              pointerEvents:
                "none",
            }}
          >
            {center[0].toFixed(6)},
            {" "}
            {center[1].toFixed(6)}
          </div>
        )}

        {/* ==================================================
            BOTTOM CONTROLS
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            right: "12px",
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr 1.4fr",
            gap: "8px",
            direction: "rtl",
            pointerEvents:
              "auto",
          }}
        >
          <button
            type="button"
            onClick={undo}
            disabled={
              !safePoints.length ||
              tracking
            }
            style={{
              minHeight: "58px",
              border: "none",
              borderRadius: "15px",
              background:
                "#ffffff",
              fontSize: "16px",
              fontWeight: "900",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.16)",
              cursor:
                safePoints.length &&
                !tracking
                  ? "pointer"
                  : "not-allowed",
              opacity:
                tracking
                  ? 0.5
                  : 1,
            }}
          >
            ↩️ تراجع
          </button>

          <button
            type="button"
            onClick={clear}
            disabled={
              !safePoints.length
            }
            style={{
              minHeight: "58px",
              border: "none",
              borderRadius: "15px",
              background:
                "#ffffff",
              fontSize: "16px",
              fontWeight: "900",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.16)",
              cursor:
                safePoints.length
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            🗑️ مسح
          </button>

          <button
            type="button"
            onClick={save}
            disabled={
              safePoints.length < 3
            }
            style={{
              minHeight: "58px",
              border: "none",
              borderRadius: "15px",
              background:
                safePoints.length >= 3
                  ? "#1b7f3a"
                  : "#9e9e9e",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "900",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.18)",
              cursor:
                safePoints.length >= 3
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            💾 اعتماد الحدود
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MAP PAGE
// ============================================================

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

  // ==========================================================
  // URL
  // ==========================================================

  const [
    returnPath,
    setReturnPath,
  ] = useState("");

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const urlFarmId =
      clean(
        params.get("farmId")
      );

    const urlReturn =
      clean(
        params.get("return")
      );

    if (urlReturn) {
      setReturnPath(
        urlReturn
      );
    }

    if (urlFarmId) {
      setFarmId(
        urlFarmId
      );
    }
  }, [setFarmId]);

  // ==========================================================
  // FORM
  // ==========================================================

  const [
    locationMethod,
    setLocationMethod,
  ] = useState("text");

  const [
    country,
    setCountry,
  ] = useState("");

  const [
    province,
    setProvince,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    town,
    setTown,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    northNeighbor,
    setNorthNeighbor,
  ] = useState("");

  const [
    southNeighbor,
    setSouthNeighbor,
  ] = useState("");

  const [
    eastNeighbor,
    setEastNeighbor,
  ] = useState("");

  const [
    westNeighbor,
    setWestNeighbor,
  ] = useState("");

  const [
    fieldPoints,
    setFieldPoints,
  ] = useState([]);

  const [
    mapEditor,
    setMapEditor,
  ] = useState(false);

  // ==========================================================
  // FARM
  // ==========================================================

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            getFarmId(
              farm
            ) ===
            clean(
              farmId
            )
        ),
      [
        farms,
        farmId,
      ]
    );

  const selectedFarmId =
    clean(farmId);

  const hasValidFarm =
    Boolean(
      selectedFarm &&
        getFarmId(
          selectedFarm
        ) ===
          selectedFarmId
    );

  // ==========================================================
  // OPEN MAP
  // ==========================================================

  const openMap =
    () => {
      if (!hasValidFarm) {
        alert(
          "اختر المزرعة أولًا قبل تحديد موقع الأرض."
        );

        return;
      }

      setLocationMethod(
        "map"
      );

      setMapEditor(
        true
      );
    };

  // ==========================================================
  // CLOSE MAP
  // ==========================================================

  const closeMap =
    () => {
      setMapEditor(
        false
      );
    };

  // ==========================================================
  // SAVE MAP
  // ==========================================================

  const saveMap =
    () => {
      if (
        fieldPoints.length <
        3
      ) {
        alert(
          "حدد 3 نقاط على الأقل."
        );

        return;
      }

      setLocationMethod(
        "map"
      );

      setMapEditor(
        false
      );
    };

  // ==========================================================
  // FARM CHANGE
  // ==========================================================

  const handleFarmChange =
    value => {
      const nextFarmId =
        clean(value);

      setFarmId(
        nextFarmId
      );

      setFieldPoints([]);
    };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm =
    () => {
      setCountry("");
      setProvince("");
      setCity("");
      setTown("");
      setDescription("");

      setNorthNeighbor("");
      setSouthNeighbor("");
      setEastNeighbor("");
      setWestNeighbor("");

      setFieldPoints([]);

      setNotes("");

      setLocationMethod(
        "text"
      );
    };

  // ==========================================================
  // SAVE LOCATION
  // ==========================================================

  const handleSave =
    async () => {
      const currentFarmId =
        clean(farmId);

      if (!currentFarmId) {
        alert(
          "اختر المزرعة أولًا."
        );

        return;
      }

      if (!hasValidFarm) {
        alert(
          "المزرعة المختارة غير موجودة أو أن معرف المزرعة غير صحيح."
        );

        return;
      }

      if (
        locationMethod ===
          "map" &&
        fieldPoints.length < 3
      ) {
        alert(
          "حدد حدود الأرض على الخريطة أولًا."
        );

        return;
      }

      if (
        locationMethod ===
        "text"
      ) {
        const hasTextData = [
          country,
          province,
          city,
          town,
          description,
          northNeighbor,
          southNeighbor,
          eastNeighbor,
          westNeighbor,
          notes,
        ].some(
          value =>
            clean(value)
              .length > 0
        );

        if (!hasTextData) {
          alert(
            "اكتب معلومات موقع الأرض أولًا."
          );

          return;
        }
      }

      const points =
        normalizePoints(
          fieldPoints
        );

      const center =
        calculateCenter(
          points
        );

      const calculatedArea =
        locationMethod ===
        "map"
          ? calculateArea(
              points
            )
          : null;

      const calculatedPerimeter =
        locationMethod ===
        "map"
          ? calculatePerimeter(
              points
            )
          : null;

      const locationData = {
        farmId:
          currentFarmId,

        farmName:
          getFarmName(
            selectedFarm
          ),

        type:
          locationType ||
          "field",

        source:
          locationMethod,

        country:
          clean(country),

        region:
          clean(province),

        province:
          clean(province),

        city:
          clean(city),

        town:
          clean(town),

        village:
          clean(town),

        placeName:
          clean(town) ||
          clean(city),

        locationDescription:
          clean(description),

        description:
          clean(description),

        northNeighbor:
          clean(
            northNeighbor
          ),

        southNeighbor:
          clean(
            southNeighbor
          ),

        eastNeighbor:
          clean(
            eastNeighbor
          ),

        westNeighbor:
          clean(
            westNeighbor
          ),

        north:
          clean(
            northNeighbor
          ),

        south:
          clean(
            southNeighbor
          ),

        east:
          clean(
            eastNeighbor
          ),

        west:
          clean(
            westNeighbor
          ),

        points:
          points.map(
            point => ({
              latitude:
                point[0],
              longitude:
                point[1],
            })
          ),

        boundary:
          points.map(
            point => ({
              latitude:
                point[0],
              longitude:
                point[1],
            })
          ),

        latitude:
          center?.[0] ??
          null,

        longitude:
          center?.[1] ??
          null,

        area:
          calculatedArea,

        perimeter:
          calculatedPerimeter,

        notes:
          clean(notes),

        status:
          "active",
      };

      try {
        const saved =
          await addLocation(
            locationData
          );

        if (
          saved === true ||
          saved
        ) {
          resetForm();

          if (
            returnPath ===
              "crops" ||
            returnPath ===
              "new-farm"
          ) {
            window.history.back();
          }
        }
      } catch (error) {
        console.error(
          "Map save error:",
          error
        );

        alert(
          error?.message ||
            "حدث خطأ أثناء حفظ موقع الأرض."
        );
      }
    };

  // ==========================================================
  // MAP EDITOR
  // ==========================================================

  if (mapEditor) {
    return (
      <FieldMapEditor
        points={
          fieldPoints
        }
        setPoints={
          setFieldPoints
        }
        onClose={
          closeMap
        }
        onSave={
          saveMap
        }
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      style={{
        padding: "12px",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          marginBottom: "18px",
        }}
      >
        🗺️ موقع الأرض
      </h1>

      <Card title="🌾 الأرض والمزرعة">
        <select
          value={
            farmId || ""
          }
          onChange={e =>
            handleFarmChange(
              e.target.value
            )
          }
          style={{
            width: "100%",
            minHeight: "64px",
            padding: "12px",
            border:
              "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            background:
              "#ffffff",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map(farm => {
            const id =
              getFarmId(
                farm
              );

            return (
              <option
                key={id}
                value={id}
              >
                {
                  getFarmName(
                    farm
                  )
                }
              </option>
            );
          })}
        </select>

        {hasValidFarm && (
          <div
            style={{
              marginTop: "12px",
              padding: "13px",
              borderRadius: "14px",
              background:
                "#edf8f0",
              color: "#155d2b",
              fontWeight: "900",
            }}
          >
            🌾 المزرعة المختارة:{" "}
            {
              getFarmName(
                selectedFarm
              )
            }
          </div>
        )}

        <div
          style={{
            height: "14px",
          }}
        />

        <select
          value={
            locationType ||
            "field"
          }
          onChange={e =>
            setLocationType(
              e.target.value
            )
          }
          style={{
            width: "100%",
            minHeight: "64px",
            padding: "12px",
            border:
              "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            background:
              "#ffffff",
          }}
        >
          <option value="field">
            🌱 حقل
          </option>

          <option value="farm">
            🌾 مزرعة
          </option>

          <option value="waterSource">
            💧 مصدر مياه
          </option>
        </select>
      </Card>

      <div
        style={{
          height: "14px",
        }}
      />

      <Card title="📍 كيف تريد تحديد موقع الأرض؟">
        <div
          style={{
            display: "grid",
            gap: "12px",
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
              minHeight: "100px",
              padding: "16px",
              border:
                locationMethod ===
                "text"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",
              background:
                locationMethod ===
                "text"
                  ? "#edf8f0"
                  : "#ffffff",
              borderRadius: "18px",
              textAlign: "right",
              fontSize: "19px",
              fontWeight: "900",
            }}
          >
            ✍️ كتابة موقع الأرض

            <div
              style={{
                marginTop: "7px",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "1.8",
              }}
            >
              البلد → المحافظة →
              المدينة → البلدة →
              الجهات المحيطة
            </div>
          </button>

          <button
            type="button"
            onClick={
              openMap
            }
            disabled={
              !hasValidFarm
            }
            style={{
              minHeight: "100px",
              padding: "16px",
              border:
                locationMethod ===
                "map"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",
              background:
                locationMethod ===
                "map"
                  ? "#edf8f0"
                  : "#ffffff",
              borderRadius: "18px",
              textAlign: "right",
              fontSize: "19px",
              fontWeight: "900",
              opacity:
                hasValidFarm
                  ? 1
                  : 0.55,
            }}
          >
            🛰️ GPS Area — قياس الأرض

            <div
              style={{
                marginTop: "7px",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "1.8",
              }}
            >
              🚶 ابدأ GPS ثم امشِ حول
              حدود الأرض وسيتم تسجيل
              النقاط تلقائيًا
            </div>
          </button>
        </div>
      </Card>

      <div
        style={{
          height: "14px",
        }}
      />

      {locationMethod ===
        "text" && (
        <Card title="✍️ بيانات موقع الأرض">
          <TextLocationForm
            country={country}
            setCountry={
              setCountry
            }
            province={province}
            setProvince={
              setProvince
            }
            city={city}
            setCity={setCity}
            town={town}
            setTown={setTown}
            description={
              description
            }
            setDescription={
              setDescription
            }
            northNeighbor={
              northNeighbor
            }
            setNorthNeighbor={
              setNorthNeighbor
            }
            southNeighbor={
              southNeighbor
            }
            setSouthNeighbor={
              setSouthNeighbor
            }
            eastNeighbor={
              eastNeighbor
            }
            setEastNeighbor={
              setEastNeighbor
            }
            westNeighbor={
              westNeighbor
            }
            setWestNeighbor={
              setWestNeighbor
            }
            notes={
              notes || ""
            }
            setNotes={
              setNotes
            }
          />
        </Card>
      )}

      {locationMethod ===
        "map" && (
        <Card title="🛰️ GPS Area — حدود الأرض">
          <div
            style={{
              padding: "18px",
              borderRadius: "18px",
              background:
                "#f2f7f3",
              lineHeight: "1.9",
              fontSize: "17px",
            }}
          >
            <strong>
              {fieldPoints.length >=
              3
                ? "تم تسجيل حدود الأرض."
                : "لم يتم تسجيل حدود الأرض بعد."}
            </strong>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              النقاط المسجلة:{" "}
              <strong>
                {
                  fieldPoints.length
                }
              </strong>
            </div>

            {fieldPoints.length >=
              3 && (
              <>
                <div
                  style={{
                    marginTop: "8px",
                  }}
                >
                  📐 المساحة:{" "}
                  <strong>
                    {
                      formatArea(
                        calculateArea(
                          fieldPoints
                        )
                      )
                    }
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: "5px",
                  }}
                >
                  📏 المحيط:{" "}
                  <strong>
                    {
                      formatDistance(
                        calculatePerimeter(
                          fieldPoints
                        )
                      )
                    }
                  </strong>
                </div>
              </>
            )}

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <Button
                onClick={
                  openMap
                }
              >
                🚶 فتح GPS Area وقياس الأرض
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div
        style={{
          height: "18px",
        }}
      />

      <Button
        onClick={
          handleSave
        }
        disabled={
          loading
        }
      >
        {loading
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ موقع الأرض"}
      </Button>

      <h2
        style={{
          marginTop: "28px",
          fontSize: "23px",
        }}
      >
        🗺️ المواقع المحفوظة
      </h2>

      {locations.length ===
      0 ? (
        <p>
          لا توجد مواقع محفوظة حتى الآن.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {locations.map(
            item => {
              const title =
                item.town ||
                item.village ||
                item.city ||
                item.placeName ||
                item.farmName ||
                "موقع أرض";

              const hasNeighbors =
                item.northNeighbor ||
                item.southNeighbor ||
                item.eastNeighbor ||
                item.westNeighbor;

              const hasCoordinates =
                Number.isFinite(
                  Number(
                    item.latitude
                  )
                ) &&
                Number.isFinite(
                  Number(
                    item.longitude
                  )
                );

              return (
                <Card
                  key={
                    item.id
                  }
                  title={
                    title
                  }
                >
                  {item.farmName && (
                    <p>
                      🌾{" "}
                      {
                        item.farmName
                      }
                    </p>
                  )}

                  {item.country && (
                    <p>
                      🌍{" "}
                      {
                        item.country
                      }
                    </p>
                  )}

                  {item.region && (
                    <p>
                      🏛️{" "}
                      {
                        item.region
                      }
                    </p>
                  )}

                  {item.city && (
                    <p>
                      🏙️{" "}
                      {
                        item.city
                      }
                    </p>
                  )}

                  {item.town && (
                    <p>
                      🏘️{" "}
                      {
                        item.town
                      }
                    </p>
                  )}

                  {item.locationDescription && (
                    <p
                      style={{
                        whiteSpace:
                          "pre-wrap",
                        lineHeight:
                          "1.8",
                      }}
                    >
                      📍{" "}
                      {
                        item.locationDescription
                      }
                    </p>
                  )}

                  {hasNeighbors && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "16px",
                        borderRadius:
                          "14px",
                        background:
                          "#f2f7f3",
                        lineHeight:
                          "1.9",
                      }}
                    >
                      <strong>
                        🧭 الجهات المحيطة
                      </strong>

                      {item.northNeighbor && (
                        <div>
                          ⬆️ الشمال:{" "}
                          {
                            item.northNeighbor
                          }
                        </div>
                      )}

                      {item.southNeighbor && (
                        <div>
                          ⬇️ الجنوب:{" "}
                          {
                            item.southNeighbor
                          }
                        </div>
                      )}

                      {item.eastNeighbor && (
                        <div>
                          ➡️ الشرق:{" "}
                          {
                            item.eastNeighbor
                          }
                        </div>
                      )}

                      {item.westNeighbor && (
                        <div>
                          ⬅️ الغرب:{" "}
                          {
                            item.westNeighbor
                          }
                        </div>
                      )}
                    </div>
                  )}

                  {Number(
                    item.area
                  ) > 0 && (
                    <p>
                      📐 المساحة:{" "}
                      {
                        formatArea(
                          item.area
                        )
                      }
                    </p>
                  )}

                  {Number(
                    item.perimeter
                  ) > 0 && (
                    <p>
                      📏 المحيط:{" "}
                      {
                        formatDistance(
                          item.perimeter
                        )
                      }
                    </p>
                  )}

                  {Array.isArray(
                    item.points
                  ) &&
                    item.points
                      .length >=
                      3 && (
                      <p>
                        📍 عدد نقاط الحدود:{" "}
                        {
                          item.points
                            .length
                        }
                      </p>
                    )}

                  {item.notes && (
                    <p
                      style={{
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      📝{" "}
                      {
                        item.notes
                      }
                    </p>
                  )}

                  {hasCoordinates && (
                    <a
                      href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display:
                          "inline-block",
                        marginTop: "8px",
                        fontSize: "17px",
                      }}
                    >
                      🗺️ فتح الموقع على
                      Google Maps
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
                    🗑️ حذف
                  </Button>
                </Card>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
