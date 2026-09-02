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
  useMap,
  useMapEvents,
} from "react-leaflet";

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
// LAVENDER — MAP
// ============================================================

const DEFAULT_POSITION = [36.7, 38.7];
const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

const GPS_ATTEMPTS = 4;
const GPS_WAIT = 1800;

const GOOD_ACCURACY = 50;
const ACCEPTABLE_ACCURACY = 100;


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
    const timer = window.setTimeout(
      () => map.invalidateSize(false),
      250
    );

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}


// ============================================================
// BOUNDARY POINT SELECTOR
// ============================================================

function BoundaryPointSelector({ onAddPoint }) {
  useMapEvents({
    click(event) {
      const point = normalizePoint([
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
// GPS CONTROLLER
// ============================================================

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

      if (window.isSecureContext === false) {
        statusRef.current?.({
          type: "error",
          message:
            "⚠️ تحديد الموقع يحتاج اتصال HTTPS آمن.",
        });

        return;
      }

      statusRef.current?.({
        type: "loading",
        message:
          "📍 جارٍ طلب موقع الهاتف...",
      });

      while (
        !cancelled &&
        attempts < GPS_ATTEMPTS
      ) {
        attempts += 1;

        try {
          const result =
            await getPosition();

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
            !Number.isFinite(longitude) ||
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
              `📡 محاولة ${attempts}/${GPS_ATTEMPTS} — الدقة ±${Math.round(
                accuracy
              )}م`,
          });

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

          if (error?.code === 1) {
            statusRef.current?.({
              type: "error",
              message:
                "⚠️ لم يتم السماح للموقع. اسمح للمتصفح باستخدام موقع الهاتف ثم حاول مرة أخرى.",
            });

            return;
          }

          if (
            error?.code === 2 ||
            error?.code === 3
          ) {
            statusRef.current?.({
              type: "loading",
              message:
                "📡 موقع GPS غير متاح حاليًا — جارٍ إعادة المحاولة...",
            });

            await wait(GPS_WAIT);
            continue;
          }

          console.error(
            "GPS error:",
            error
          );

          statusRef.current?.({
            type: "error",
            message:
              "⚠️ حدث خطأ أثناء تحديد موقع الهاتف.",
          });

          return;
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
              "⚠️ تعذر الحصول على موقع GPS حاليًا. تأكد من تشغيل الموقع الدقيق/GPS ثم حاول مرة أخرى.",
          });
        }

        return;
      }

      positionRef.current?.(best);

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
            )}م. فعّل الموقع الدقيق/GPS.`,
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


// ============================================================
// GPS VISUAL
// ============================================================

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

  const accuracy =
    Number(gpsAccuracy);

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


// ============================================================
// FORM FIELD
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
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight,
            padding: "14px",
            border: "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            lineHeight: "1.8",
            background: "#ffffff",
            outline: "none",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight: "64px",
            padding: "14px",
            border: "2px solid #d7ded9",
            borderRadius: "16px",
            fontSize: "18px",
            lineHeight: "1.8",
            background: "#ffffff",
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
        placeholder="أي معلومات إضافية"
      />
    </div>
  );
}


// ============================================================
// GPS BUTTON
// ============================================================

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

  const handleGPSPosition =
    data => {
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

  const handleGPSStatus =
    status => {
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
        "📍 جارٍ طلب موقع الهاتف...",
    });

    setGpsRequestId(
      value => value + 1
    );
  };

  const addPoint = point => {
    const normalized =
      normalizePoint(point);

    if (!normalized) {
      return;
    }

    setPoints(current => [
      ...current,
      normalized,
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
    safePoints.length
      ? safePoints[
          safePoints.length - 1
        ]
      : DEFAULT_POSITION;

  const initialZoom =
    safePoints.length
      ? GPS_ZOOM
      : DEFAULT_ZOOM;

  const instructionTop =
    gpsStatus.message
      ? "176px"
      : "150px";

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
          onPosition={handleGPSPosition}
          onStatus={handleGPSStatus}
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

      <div
        style={{
          position: "absolute",
          top: instructionTop,
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
          🛰️ حرّك الخريطة وكبّر ثم حدد الزوايا بدقة
        </div>
      </div>

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
          disabled={!safePoints.length}
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
          disabled={!safePoints.length}
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
          disabled={safePoints.length < 3}
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
          💾 اعتماد الحدود
        </button>
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

  // ----------------------------------------------------------
  // URL CONTEXT
  // ----------------------------------------------------------

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
      clean(params.get("farmId"));

    const urlReturn =
      clean(params.get("return"));

    if (urlReturn) {
      setReturnPath(urlReturn);
    }

    /*
     * أهم إصلاح:
     *
     * Crops يفتح:
     * /map?return=crops&farmId=...
     *
     * يجب على Map أن يأخذ farmId
     * من الرابط ويضعه في حالة الخريطة.
     */
    if (urlFarmId) {
      setFarmId(urlFarmId);
    }
  }, [setFarmId]);


  // ----------------------------------------------------------
  // FORM
  // ----------------------------------------------------------

  const [
    locationMethod,
    setLocationMethod,
  ] = useState("text");

  const [country, setCountry] =
    useState("");

  const [province, setProvince] =
    useState("");

  const [city, setCity] =
    useState("");

  const [town, setTown] =
    useState("");

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


  // ----------------------------------------------------------
  // FARM
  // ----------------------------------------------------------

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            getFarmId(farm) ===
            clean(farmId)
        ),
      [farms, farmId]
    );


  // ----------------------------------------------------------
  // VALID FARM
  // ----------------------------------------------------------

  const selectedFarmId =
    clean(farmId);

  const hasValidFarm =
    Boolean(
      selectedFarm &&
      getFarmId(selectedFarm) ===
        selectedFarmId
    );


  // ----------------------------------------------------------
  // MAP
  // ----------------------------------------------------------

  const openMap = () => {
    if (!hasValidFarm) {
      alert(
        "اختر المزرعة أولًا قبل تحديد موقع الأرض."
      );

      return;
    }

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


  // ----------------------------------------------------------
  // FARM CHANGE
  // ----------------------------------------------------------

  const handleFarmChange = value => {
    const nextFarmId =
      clean(value);

    setFarmId(nextFarmId);

    /*
     * لا نحمل حدود مزرعة أخرى
     * داخل المزرعة الجديدة.
     */
    setFieldPoints([]);
  };


  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // SAVE LOCATION
  // ----------------------------------------------------------

  const handleSave = async () => {
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
      locationMethod === "map" &&
      fieldPoints.length < 3
    ) {
      alert(
        "حدد حدود الأرض على الخريطة أولًا."
      );

      return;
    }

    if (
      locationMethod === "text"
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
          clean(value).length > 0
      );

      if (!hasTextData) {
        alert(
          "اكتب معلومات موقع الأرض أولًا."
        );

        return;
      }
    }

    const points =
      normalizePoints(fieldPoints);

    const firstPoint =
      points.length
        ? points[0]
        : null;

    const calculatedArea =
      locationMethod === "map"
        ? calculateArea(points)
        : null;

    const calculatedPerimeter =
      locationMethod === "map"
        ? calculatePerimeter(points)
        : null;

    /*
     * هذا هو المصدر الوحيد لمعرف المزرعة
     * أثناء الحفظ.
     *
     * farmId مأخوذ من:
     * 1. URL عند القدوم من Crops
     * 2. أو اختيار المستخدم من قائمة المزارع
     */
    const locationData = {
      farmId: currentFarmId,

      farmName:
        getFarmName(selectedFarm),

      type:
        locationType || "field",

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
        clean(northNeighbor),

      southNeighbor:
        clean(southNeighbor),

      eastNeighbor:
        clean(eastNeighbor),

      westNeighbor:
        clean(westNeighbor),

      north:
        clean(northNeighbor),

      south:
        clean(southNeighbor),

      east:
        clean(eastNeighbor),

      west:
        clean(westNeighbor),

      /*
       * الحدود الجغرافية الحقيقية.
       */
      points:
        points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        })),

      boundary:
        points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        })),

      /*
       * الإحداثيات هنا من النقاط التي
       * حددها المستخدم، وليس من Nominatim.
       */
      latitude:
        firstPoint?.[0] ?? null,

      longitude:
        firstPoint?.[1] ?? null,

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

      if (saved === true) {
        resetForm();

        /*
         * إذا جاءت الخريطة من المحاصيل،
         * نعيد المستخدم إليها بعد الحفظ.
         */
        if (
          returnPath === "crops"
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


  // ----------------------------------------------------------
  // FULL SCREEN MAP
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // PAGE
  // ----------------------------------------------------------

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

      {/* FARM */}

      <Card title="🌾 الأرض والمزرعة">
        <select
          value={farmId || ""}
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
            background: "#ffffff",
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map(farm => {
            const id =
              getFarmId(farm);

            return (
              <option
                key={id}
                value={id}
              >
                {getFarmName(farm)}
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
              background: "#edf8f0",
              color: "#155d2b",
              fontWeight: "900",
            }}
          >
            🌾 المزرعة المختارة:
            {" "}
            {getFarmName(selectedFarm)}
          </div>
        )}

        <div
          style={{
            height: "14px",
          }}
        />

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

      {/* METHOD */}

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
            disabled={!hasValidFarm}
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
              opacity:
                hasValidFarm
                  ? 1
                  : 0.55,
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

      {/* TEXT */}

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

      {/* MAP SUMMARY */}

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

            <div
              style={{
                marginTop: "8px",
              }}
            >
              النقاط المحددة:{" "}
              <strong>
                {fieldPoints.length}
              </strong>
            </div>

            {fieldPoints.length >= 3 && (
              <>
                <div
                  style={{
                    marginTop: "8px",
                  }}
                >
                  📐 المساحة:{" "}
                  <strong>
                    {formatArea(
                      calculateArea(
                        fieldPoints
                      )
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: "5px",
                  }}
                >
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

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <Button onClick={openMap}>
                🛰️ فتح الخريطة وتحديد الأرض
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ height: "18px" }} />

      {/* SAVE */}

      <Button
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ موقع الأرض"}
      </Button>

      {/* SAVED LOCATIONS */}

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
          {locations.map(item => {
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
                Number(item.latitude)
              ) &&
              Number.isFinite(
                Number(item.longitude)
              );

            return (
              <Card
                key={item.id}
                title={title}
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

                {hasNeighbors && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "16px",
                      borderRadius: "14px",
                      background:
                        "#f2f7f3",
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
                    {formatArea(
                      item.area
                    )}
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

                {Array.isArray(item.points) &&
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

                {hasCoordinates && (
                  <a
                    href={
                      `https://maps.google.com/?q=${item.latitude},${item.longitude}`
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
                    deleteLocation(
                      item.id
                    )
                  }
                >
                  🗑️ حذف
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
