// src/pages/Map.jsx

import {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useMapHook from "../hooks/useMap.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";


// =========================================================
// LAVENDER — MAP
// نسخة خفيفة:
// Map.jsx → useMap.js → mapService → mapRepository
// =========================================================

const DEFAULT_POSITION = [36.7, 38.7];

const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

const GPS_ATTEMPTS = 4;
const GPS_WAIT = 1800;

// نعتبر الموقع جيدًا عندما تصبح الدقة 50م أو أقل.
// ويمكن قبول 100م كموقع جيد عمليًا.
const GOOD_ACCURACY = 50;
const ACCEPTABLE_ACCURACY = 100;


// =========================================================
// HELPERS
// =========================================================

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}


function radians(value) {
  return Number(value) * Math.PI / 180;
}


function distanceMeters(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return 0;
  }

  const lat1 = radians(a[0]);
  const lat2 = radians(b[0]);

  const dLat = radians(b[0] - a[0]);
  const dLon = radians(b[1] - a[1]);

  const r = 6371008.8;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  return (
    r *
    2 *
    Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x)
    )
  );
}


function calculatePerimeter(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return 0;
  }

  let total = 0;

  for (let i = 0; i < points.length; i++) {
    total += distanceMeters(
      points[i],
      points[(i + 1) % points.length]
    );
  }

  return total;
}


function calculateArea(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return 0;
  }

  const valid = points.filter(
    point =>
      Array.isArray(point) &&
      point.length >= 2 &&
      Number.isFinite(Number(point[0])) &&
      Number.isFinite(Number(point[1]))
  );

  if (valid.length < 3) {
    return 0;
  }

  const earthRadius = 6378137;

  const meanLat =
    valid.reduce(
      (sum, point) =>
        sum + radians(point[0]),
      0
    ) / valid.length;

  const cosLat = Math.cos(meanLat);

  const projected = valid.map(point => [
    earthRadius *
      radians(point[1]) *
      cosLat,

    earthRadius *
      radians(point[0]),
  ]);

  let area = 0;

  for (let i = 0; i < projected.length; i++) {
    const current = projected[i];
    const next =
      projected[(i + 1) % projected.length];

    area +=
      current[0] * next[1] -
      next[0] * current[1];
  }

  return Math.abs(area / 2);
}


function formatArea(value) {
  const area = Number(value);

  if (!Number.isFinite(area) || area <= 0) {
    return "0 م²";
  }

  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} هكتار`;
  }

  return `${area.toFixed(1)} م²`;
}


function formatDistance(value) {
  const distance = Number(value);

  if (!Number.isFinite(distance) || distance <= 0) {
    return "0 م";
  }

  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(2)} كم`;
  }

  return `${distance.toFixed(1)} م`;
}


// =========================================================
// MAP LAYERS
// =========================================================

function MapLayers() {
  return (
    <>
      {/* القمر الصناعي */}
      <TileLayer
        attribution="
          © Esri © Maxar © Earthstar Geographics
        "
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      {/* الطرق */}
      <TileLayer
        attribution="
          © Esri © OpenStreetMap contributors
        "
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        opacity={0.9}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      {/* أسماء المدن والقرى والبلدات والمناطق */}
      <TileLayer
        attribution="
          © Esri
        "
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
        opacity={1}
        keepBuffer={2}
        updateWhenIdle
        updateWhenZooming={false}
      />

      {/* طبقة أسماء إضافية — Labels فقط */}
      <TileLayer
        attribution="
          © OpenStreetMap contributors © CARTO
        "
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


// =========================================================
// MAP RESIZE
// =========================================================

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize(false);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map]);

  return null;
}


// =========================================================
// MAP CLICK
// =========================================================

function BoundaryPointSelector({ onAddPoint }) {
  useMapEvents({
    click(event) {
      const lat = Number(event.latlng.lat);
      const lng = Number(event.latlng.lng);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      onAddPoint([lat, lng]);
    },
  });

  return null;
}


// =========================================================
// GPS CONTROLLER
// =========================================================
//
// لا watchPosition.
// كل ضغطة = عملية GPS مستقلة.
// نأخذ عدة قراءات ونختار الأفضل.
// لا يوجد تحريك مستمر للخريطة.
// =========================================================

function GPSController({
  requestId,
  onPosition,
  onStatus,
}) {
  const map = useMap();

  const positionRef = useRef(onPosition);
  const statusRef = useRef(onStatus);

  useEffect(() => {
    positionRef.current = onPosition;
  }, [onPosition]);

  useEffect(() => {
    statusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    if (!requestId) {
      return undefined;
    }

    let cancelled = false;
    let best = null;
    let attempts = 0;

    const wait = ms =>
      new Promise(resolve =>
        window.setTimeout(resolve, ms)
      );

    const getPosition = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 0,
          }
        );
      });

    const run = async () => {
      if (
        typeof navigator === "undefined" ||
        !navigator.geolocation
      ) {
        statusRef.current?.({
          type: "error",
          message:
            "📍 جهازك أو المتصفح لا يدعم تحديد الموقع.",
        });

        return;
      }

      statusRef.current?.({
        type: "loading",
        message:
          "📍 جارٍ طلب إذن الموقع من الهاتف...",
      });

      while (
        !cancelled &&
        attempts < GPS_ATTEMPTS
      ) {
        attempts += 1;

        try {
          const result = await getPosition();

          if (cancelled) {
            return;
          }

          const latitude =
            Number(result.coords.latitude);

          const longitude =
            Number(result.coords.longitude);

          const accuracy =
            Number(result.coords.accuracy);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            continue;
          }

          if (
            !Number.isFinite(accuracy)
          ) {
            continue;
          }

          const candidate = {
            point: [
              latitude,
              longitude,
            ],
            accuracy,
          };

          if (
            !best ||
            accuracy < best.accuracy
          ) {
            best = candidate;
          }

          statusRef.current?.({
            type: "loading",
            message:
              `📡 محاولة ${attempts}/${GPS_ATTEMPTS} — الدقة الحالية ±${Math.round(
                accuracy
              )}م`,
          });

          // إذا وصلنا لدقة ممتازة لا داعي للمزيد.
          if (
            accuracy <= GOOD_ACCURACY
          ) {
            break;
          }

          if (
            accuracy <= ACCEPTABLE_ACCURACY
          ) {
            break;
          }

          await wait(GPS_WAIT);
        } catch (error) {
          if (cancelled) {
            return;
          }

          if (
            error?.code ===
            error.PERMISSION_DENIED
          ) {
            statusRef.current?.({
              type: "error",
              message:
                "⚠️ لم يتم السماح للموقع. اسمح للتطبيق/المتصفح باستخدام موقع الهاتف ثم اضغط الزر مرة أخرى.",
            });

            return;
          }

          if (
            error?.code ===
            error.POSITION_UNAVAILABLE
          ) {
            statusRef.current?.({
              type: "loading",
              message:
                "📡 موقع GPS غير متاح حاليًا — جارٍ إعادة المحاولة...",
            });

            await wait(GPS_WAIT);
            continue;
          }

          if (
            error?.code ===
            error.TIMEOUT
          ) {
            statusRef.current?.({
              type: "loading",
              message:
                "⏳ انتهت محاولة GPS — جارٍ إعادة المحاولة...",
            });

            await wait(GPS_WAIT);
            continue;
          }
        }
      }

      if (
        cancelled ||
        !best
      ) {
        if (!cancelled) {
          statusRef.current?.({
            type: "error",
            message:
              "⚠️ تعذر الحصول على موقع GPS حاليًا. تأكد من تشغيل خدمات الموقع ثم حاول مرة أخرى.",
          });
        }

        return;
      }

      // إرسال أفضل قراءة فقط.
      positionRef.current?.(best);

      // تحريك الخريطة مرة واحدة فقط.
      map.setView(
        best.point,
        Math.max(
          map.getZoom(),
          GPS_ZOOM
        ),
        {
          animate: false,
        }
      );

      if (
        best.accuracy <= GOOD_ACCURACY
      ) {
        statusRef.current?.({
          type: "success",
          message:
            `📍 تم تحديد موقعك بدقة جيدة — ±${Math.round(
              best.accuracy
            )}م`,
        });
      } else if (
        best.accuracy <= ACCEPTABLE_ACCURACY
      ) {
        statusRef.current?.({
          type: "success",
          message:
            `📍 تم تحديد موقعك — الدقة ±${Math.round(
              best.accuracy
            )}م`,
        });
      } else {
        statusRef.current?.({
          type: "warning",
          message:
            `⚠️ أفضل دقة حصل عليها الهاتف ±${Math.round(
              best.accuracy
            )}م. فعّل "الموقع الدقيق/GPS" للحصول على نتيجة أفضل.`,
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [requestId, map]);

  return null;
}


// =========================================================
// GPS VISUAL
// =========================================================

function GPSLocationVisual({
  gpsPosition,
  gpsAccuracy,
}) {
  if (
    !Array.isArray(gpsPosition) ||
    gpsPosition.length !== 2
  ) {
    return null;
  }

  const accuracy = Number(gpsAccuracy);

  return (
    <>
      {Number.isFinite(accuracy) &&
        accuracy > 0 && (
          <Circle
            center={gpsPosition}
            radius={accuracy}
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


// =========================================================
// FIELD
// =========================================================

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  minHeight = "70px",
}) {
  const style = {
    width: "100%",
    boxSizing: "border-box",
    minHeight: textarea
      ? minHeight
      : "64px",
    padding: "14px",
    border: "2px solid #d7ded9",
    borderRadius: "16px",
    fontSize: "18px",
    lineHeight: "1.8",
    background: "#ffffff",
    outline: "none",
    resize: textarea
      ? "vertical"
      : "none",
  };

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
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={style}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={style}
        />
      )}
    </label>
  );
}


// =========================================================
// TEXT LOCATION FORM
// =========================================================

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
        placeholder="اكتب اسم البلد"
      />

      <Field
        label="🏛️ المحافظة / المنطقة"
        value={province}
        onChange={setProvince}
        placeholder="اكتب المحافظة أو المنطقة"
      />

      <Field
        label="🏙️ المدينة"
        value={city}
        onChange={setCity}
        placeholder="اكتب اسم المدينة"
      />

      <Field
        label="🏘️ البلدة / القرية"
        value={town}
        onChange={setTown}
        placeholder="اكتب اسم البلدة أو القرية"
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
        <strong style={{ fontSize: "19px" }}>
          🧭 الجهات المحيطة بالأرض
        </strong>

        <Field
          label="⬆️ جار الشمال"
          value={northNeighbor}
          onChange={setNorthNeighbor}
          placeholder="من يجاور الأرض من الشمال؟"
        />

        <Field
          label="⬇️ جار الجنوب"
          value={southNeighbor}
          onChange={setSouthNeighbor}
          placeholder="من يجاور الأرض من الجنوب؟"
        />

        <Field
          label="➡️ جار الشرق"
          value={eastNeighbor}
          onChange={setEastNeighbor}
          placeholder="من يجاور الأرض من الشرق؟"
        />

        <Field
          label="⬅️ جار الغرب"
          value={westNeighbor}
          onChange={setWestNeighbor}
          placeholder="من يجاور الأرض من الغرب؟"
        />
      </div>

      <Field
        textarea
        minHeight="140px"
        label="📝 ملاحظات"
        value={notes}
        onChange={setNotes}
        placeholder="أي معلومات إضافية عن الأرض"
      />
    </div>
  );
}


// =========================================================
// GPS BUTTON
// =========================================================

function GPSButton({
  onClick,
  loading,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        minHeight: "58px",
        border: "none",
        borderRadius: "16px",
        background: loading
          ? "#78909c"
          : "#1976d2",
        color: "#ffffff",
        fontSize: "17px",
        fontWeight: "900",
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.25)",
        direction: "rtl",
        cursor: loading
          ? "wait"
          : "pointer",
      }}
    >
      {loading
        ? "⏳ جارٍ البحث عن أفضل موقع..."
        : "📍 تحديد موقعي الآن"}
    </button>
  );
}


// =========================================================
// MAP EDITOR
// =========================================================

function FieldMapEditor({
  points,
  setPoints,
  onClose,
  onSave,
}) {
  const safePoints =
    Array.isArray(points)
      ? points
      : [];

  const [
    gpsRequestId,
    setGpsRequestId,
  ] = useState(0);

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
    gpsLoading,
    setGpsLoading,
  ] = useState(false);

  const handleGPSPosition = data => {
    if (
      !data ||
      !Array.isArray(data.point)
    ) {
      return;
    }

    setGpsPosition(data.point);
    setGpsAccuracy(data.accuracy);
    setGpsLoading(false);
  };

  const handleGPSStatus = status => {
    setGpsStatus(
      status || {
        type: "idle",
        message: "",
      }
    );

    setGpsLoading(
      status?.type === "loading"
    );
  };

  const requestGPS = () => {
    if (gpsLoading) {
      return;
    }

    setGpsLoading(true);

    setGpsStatus({
      type: "loading",
      message:
        "📍 جارٍ طلب إذن الموقع من الهاتف...",
    });

    setGpsRequestId(
      current => current + 1
    );
  };

  const addPoint = point => {
    setPoints(current => [
      ...current,
      point,
    ]);
  };

  const undo = () => {
    setPoints(current =>
      current.slice(0, -1)
    );
  };

  const clear = () => {
    setPoints([]);
  };

  const save = () => {
    if (safePoints.length < 3) {
      alert(
        "يجب تحديد 3 نقاط على الأقل لحفظ حدود الأرض."
      );

      return;
    }

    onSave();
  };

  const initialCenter =
    safePoints.length > 0
      ? safePoints[
          safePoints.length - 1
        ]
      : DEFAULT_POSITION;

  const initialZoom =
    safePoints.length > 0
      ? 18
      : DEFAULT_ZOOM;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#ffffff",
      }}
    >
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
          width: "100%",
          height: "100%",
        }}
      >
        <MapLayers />

        <MapResizeHandler />

        <BoundaryPointSelector
          onAddPoint={addPoint}
        />

        <GPSController
          requestId={gpsRequestId}
          onPosition={
            handleGPSPosition
          }
          onStatus={
            handleGPSStatus
          }
        />

        <GPSLocationVisual
          gpsPosition={gpsPosition}
          gpsAccuracy={gpsAccuracy}
        />

        {safePoints.length >= 3 && (
          <Polygon
            positions={safePoints}
            pathOptions={{
              color: "#0b6e32",
              weight: 4,
              fillColor: "#39a852",
              fillOpacity: 0.28,
            }}
          />
        )}

        {safePoints.length === 2 && (
          <Polyline
            positions={safePoints}
            pathOptions={{
              color: "#0b6e32",
              weight: 4,
            }}
          />
        )}

        {safePoints.map(
          (point, index) => (
            <CircleMarker
              key={`${point[0]}-${point[1]}-${index}`}
              center={point}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#0b6e32",
                fillOpacity: 1,
              }}
            />
          )
        )}
      </MapContainer>

      {/* TOP */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          right: "12px",
          zIndex: 100000,
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
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            background:
              "rgba(255,255,255,0.96)",
            boxShadow:
              "0 3px 15px rgba(0,0,0,0.25)",
            fontSize: "18px",
            fontWeight: "900",
          }}
        >
          🛰️ تحديد حدود الأرض
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
          }}
        >
          ✕
        </button>
      </div>

      {/* GPS */}
      <div
        style={{
          position: "absolute",
          top: "78px",
          left: "12px",
          right: "12px",
          zIndex: 100000,
          direction: "rtl",
        }}
      >
        <GPSButton
          onClick={requestGPS}
          loading={gpsLoading}
        />

        {gpsStatus.message && (
          <div
            style={{
              marginTop: "8px",
              padding: "10px 12px",
              borderRadius: "13px",
              background:
                gpsStatus.type === "error"
                  ? "rgba(183,28,28,0.94)"
                  : gpsStatus.type === "warning"
                  ? "rgba(180,110,0,0.95)"
                  : gpsStatus.type === "success"
                  ? "rgba(20,90,50,0.94)"
                  : "rgba(30,70,100,0.94)",
              color: "#ffffff",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "800",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.25)",
            }}
          >
            {gpsStatus.message}
          </div>
        )}
      </div>

      {/* INSTRUCTION */}
      <div
        style={{
          position: "absolute",
          top: gpsStatus.message
            ? "176px"
            : "150px",
          left: "12px",
          right: "12px",
          zIndex: 100000,
          padding: "13px",
          borderRadius: "16px",
          background:
            "rgba(20,80,40,0.94)",
          color: "#ffffff",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: "800",
          direction: "rtl",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.3)",
        }}
      >
        👆 اضغط على زوايا الأرض واحدة تلو الأخرى

        <div
          style={{
            marginTop: "5px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          🛰️ حرّك الخريطة بحرية ثم كبّر وحدد الزوايا
        </div>
      </div>

      {/* GPS INFO */}
      {gpsPosition && (
        <div
          style={{
            position: "absolute",
            bottom: "150px",
            right: "12px",
            zIndex: 100000,
            padding: "10px 13px",
            borderRadius: "14px",
            background:
              "rgba(255,255,255,0.96)",
            boxShadow:
              "0 3px 14px rgba(0,0,0,0.25)",
            fontSize: "13px",
            fontWeight: "800",
            direction: "rtl",
          }}
        >
          📍 موقع الهاتف

          {Number.isFinite(
            Number(gpsAccuracy)
          ) && (
            <div
              style={{
                marginTop: "4px",
                color:
                  Number(gpsAccuracy) <=
                  GOOD_ACCURACY
                    ? "#1b7f3a"
                    : "#b26a00",
              }}
            >
              الدقة: ±
              {Math.round(
                Number(gpsAccuracy)
              )}
              م
            </div>
          )}
        </div>
      )}

      {/* POINT COUNT */}
      <div
        style={{
          position: "absolute",
          bottom: "145px",
          left: "12px",
          zIndex: 100000,
          padding: "10px 14px",
          borderRadius: "14px",
          background:
            "rgba(255,255,255,0.96)",
          boxShadow:
            "0 3px 14px rgba(0,0,0,0.25)",
          fontWeight: "900",
          direction: "rtl",
        }}
      >
        📍 النقاط: {safePoints.length}
      </div>

      {/* BOTTOM */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          right: "12px",
          zIndex: 100000,
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1.3fr",
          gap: "8px",
          direction: "rtl",
        }}
      >
        <button
          type="button"
          onClick={undo}
          disabled={
            safePoints.length === 0
          }
          style={{
            minHeight: "58px",
            border: "none",
            borderRadius: "15px",
            background: "#ffffff",
            fontSize: "16px",
            fontWeight: "900",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.16)",
          }}
        >
          ↩️ تراجع
        </button>

        <button
          type="button"
          onClick={clear}
          disabled={
            safePoints.length === 0
          }
          style={{
            minHeight: "58px",
            border: "none",
            borderRadius: "15px",
            background: "#ffffff",
            fontSize: "16px",
            fontWeight: "900",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.16)",
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
          }}
        >
          💾 حفظ الأرض
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

  const selectedFarm = useMemo(
    () =>
      farms.find(
        farm =>
          String(farm.id) ===
          String(farmId)
      ),
    [farms, farmId]
  );

  const openMap = () => {
    setLocationMethod("map");
    setMapEditor(true);
  };

  const closeMap = () => {
    setMapEditor(false);
  };

  const saveMap = () => {
    if (fieldPoints.length < 3) {
      alert(
        "حدد 3 نقاط على الأقل."
      );

      return;
    }

    setLocationMethod("map");
    setMapEditor(false);
  };

  const resetForm = () => {
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
    setLocationMethod("text");
  };

  const handleSave = async () => {
    if (!farmId) {
      alert(
        "اختر المزرعة أولًا."
      );

      return;
    }

    if (
      locationMethod === "map" &&
      fieldPoints.length < 3
    ) {
      alert(
        "حدد حدود الأرض على الخريطة أولًا."
      );

      return;
    }

    if (
      locationMethod === "text" &&
      !country.trim() &&
      !province.trim() &&
      !city.trim() &&
      !town.trim() &&
      !description.trim() &&
      !northNeighbor.trim() &&
      !southNeighbor.trim() &&
      !eastNeighbor.trim() &&
      !westNeighbor.trim()
    ) {
      alert(
        "اكتب معلومات موقع الأرض أولًا."
      );

      return;
    }

    const firstPoint =
      fieldPoints.length
        ? fieldPoints[0]
        : null;

    const locationData = {
      farmId: String(farmId),

      farmName:
        selectedFarm?.name || "",

      type:
        locationType || "field",

      source:
        locationMethod,

      country:
        country.trim(),

      region:
        province.trim(),

      city:
        city.trim(),

      town:
        town.trim(),

      village:
        town.trim(),

      placeName:
        town.trim() ||
        city.trim(),

      locationDescription:
        description.trim(),

      northNeighbor:
        northNeighbor.trim(),

      southNeighbor:
        southNeighbor.trim(),

      eastNeighbor:
        eastNeighbor.trim(),

      westNeighbor:
        westNeighbor.trim(),

      points:
        fieldPoints.map(point => ({
          latitude: Number(point[0]),
          longitude: Number(point[1]),
        })),

      latitude:
        firstPoint
          ? Number(firstPoint[0])
          : null,

      longitude:
        firstPoint
          ? Number(firstPoint[1])
          : null,

      area:
        locationMethod === "map"
          ? calculateArea(fieldPoints)
          : null,

      perimeter:
        locationMethod === "map"
          ? calculatePerimeter(fieldPoints)
          : null,

      notes:
        notes?.trim() || "",

      status: "active",
    };

    try {
      await addLocation(
        locationData
      );

      resetForm();
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

  if (mapEditor) {
    return (
      <FieldMapEditor
        points={fieldPoints}
        setPoints={setFieldPoints}
        onClose={closeMap}
        onSave={saveMap}
      />
    );
  }

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
          value={farmId || ""}
          onChange={e =>
            setFarmId(
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
            background: "#ffffff",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map(farm => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name}
            </option>
          ))}
        </select>

        <div style={{ height: "14px" }} />

        <select
          value={
            locationType || "field"
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
            background: "#ffffff",
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

      <div style={{ height: "14px" }} />

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
              setLocationMethod("text")
            }
            style={{
              minHeight: "100px",
              padding: "16px",
              borderRadius: "18px",
              border:
                locationMethod === "text"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",
              background:
                locationMethod === "text"
                  ? "#edf8f0"
                  : "#ffffff",
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
              البلد → المحافظة → المدينة →
              البلدة → الجهات المحيطة
            </div>
          </button>

          <button
            type="button"
            onClick={openMap}
            style={{
              minHeight: "100px",
              padding: "16px",
              borderRadius: "18px",
              border:
                locationMethod === "map"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",
              background:
                locationMethod === "map"
                  ? "#edf8f0"
                  : "#ffffff",
              textAlign: "right",
              fontSize: "19px",
              fontWeight: "900",
            }}
          >
            🛰️ تحديد الأرض على الخريطة

            <div
              style={{
                marginTop: "7px",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "1.8",
              }}
            >
              قمر صناعي + طرق + مدن وقرى +
              GPS + تحديد يدوي
            </div>
          </button>
        </div>
      </Card>

      <div style={{ height: "14px" }} />

      {locationMethod === "text" && (
        <Card title="✍️ بيانات موقع الأرض">
          <TextLocationForm
            country={country}
            setCountry={setCountry}
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            town={town}
            setTown={setTown}
            description={description}
            setDescription={setDescription}
            northNeighbor={northNeighbor}
            setNorthNeighbor={
              setNorthNeighbor
            }
            southNeighbor={southNeighbor}
            setSouthNeighbor={
              setSouthNeighbor
            }
            eastNeighbor={eastNeighbor}
            setEastNeighbor={
              setEastNeighbor
            }
            westNeighbor={westNeighbor}
            setWestNeighbor={
              setWestNeighbor
            }
            notes={notes || ""}
            setNotes={setNotes}
          />
        </Card>
      )}

      {locationMethod === "map" && (
        <Card title="🛰️ حدود الأرض">
          <div
            style={{
              padding: "18px",
              borderRadius: "18px",
              background: "#f2f7f3",
              lineHeight: "1.9",
              fontSize: "17px",
            }}
          >
            <strong>
              {fieldPoints.length >= 3
                ? "تم تحديد حدود الأرض."
                : "لم يتم تحديد حدود الأرض بعد."}
            </strong>

            <div style={{ marginTop: "8px" }}>
              النقاط المحددة:{" "}
              <strong>
                {fieldPoints.length}
              </strong>
            </div>

            {fieldPoints.length >= 3 && (
              <>
                <div style={{ marginTop: "8px" }}>
                  📐 المساحة:{" "}
                  <strong>
                    {formatArea(
                      calculateArea(
                        fieldPoints
                      )
                    )}
                  </strong>
                </div>

                <div style={{ marginTop: "5px" }}>
                  📏 المحيط:{" "}
                  <strong>
                    {formatDistance(
                      calculatePerimeter(
                        fieldPoints
                      )
                    )}
                  </strong>
                </div>
              </>
            )}

            <div style={{ marginTop: "15px" }}>
              <Button onClick={openMap}>
                🛰️ فتح الخريطة وتحديد الأرض
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ height: "18px" }} />

      <Button onClick={handleSave}>
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

      {locations.length === 0 ? (
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
          {locations.map(item => (
            <Card
              key={item.id}
              title={
                item.town ||
                item.village ||
                item.city ||
                item.placeName ||
                item.farmName ||
                "موقع أرض"
              }
            >
              {item.farmName && (
                <p>
                  🌾 {item.farmName}
                </p>
              )}

              {item.country && (
                <p>
                  🌍 {item.country}
                </p>
              )}

              {item.region && (
                <p>
                  🏛️ {item.region}
                </p>
              )}

              {item.city && (
                <p>
                  🏙️ {item.city}
                </p>
              )}

              {item.town && (
                <p>
                  🏘️ {item.town}
                </p>
              )}

              {item.locationDescription && (
                <p
                  style={{
                    whiteSpace:
                      "pre-wrap",
                    lineHeight: "1.8",
                  }}
                >
                  📍{" "}
                  {item.locationDescription}
                </p>
              )}

              {(item.northNeighbor ||
                item.southNeighbor ||
                item.eastNeighbor ||
                item.westNeighbor) && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "#f2f7f3",
                    lineHeight: "1.9",
                  }}
                >
                  <strong>
                    🧭 الجهات المحيطة
                  </strong>

                  {item.northNeighbor && (
                    <div>
                      ⬆️ الشمال:{" "}
                      {item.northNeighbor}
                    </div>
                  )}

                  {item.southNeighbor && (
                    <div>
                      ⬇️ الجنوب:{" "}
                      {item.southNeighbor}
                    </div>
                  )}

                  {item.eastNeighbor && (
                    <div>
                      ➡️ الشرق:{" "}
                      {item.eastNeighbor}
                    </div>
                  )}

                  {item.westNeighbor && (
                    <div>
                      ⬅️ الغرب:{" "}
                      {item.westNeighbor}
                    </div>
                  )}
                </div>
              )}

              {Number(item.area) > 0 && (
                <p>
                  📐 المساحة:{" "}
                  {formatArea(item.area)}
                </p>
              )}

              {Number(item.perimeter) > 0 && (
                <p>
                  📏 المحيط:{" "}
                  {formatDistance(
                    item.perimeter
                  )}
                </p>
              )}

              {Array.isArray(
                item.points
              ) &&
                item.points.length >= 3 && (
                  <p>
                    📍 عدد نقاط الحدود:{" "}
                    {item.points.length}
                  </p>
                )}

              {item.notes && (
                <p
                  style={{
                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  📝 {item.notes}
                </p>
              )}

              {item.latitude !== null &&
                item.latitude !==
                  undefined &&
                item.longitude !== null &&
                item.longitude !==
                  undefined && (
                  <a
                    href={
                      `https://maps.google.com/?q=` +
                      `${item.latitude},${item.longitude}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display:
                        "inline-block",
                      marginTop: "8px",
                      fontSize: "17px",
                    }}
                  >
                    🗺️ فتح الموقع على Google Maps
                  </a>
                )}

              <div
                style={{
                  height: "12px",
                }}
              />

              <Button
                onClick={() =>
                  deleteLocation(item.id)
                }
              >
                🗑️ حذف
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
