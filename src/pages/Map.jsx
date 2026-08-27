// src/pages/Map.jsx

import { useEffect, useMemo, useRef, useState } from "react";
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

const DEFAULT_CENTER = [36.7, 38.7];
const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

/* =========================================================
   Helpers
========================================================= */

const number = value => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const radians = value => (Number(value) * Math.PI) / 180;

function distanceMeters(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;

  const R = 6371008.8;
  const lat1 = radians(a[0]);
  const lat2 = radians(b[0]);
  const dLat = radians(b[0] - a[0]);
  const dLon = radians(b[1] - a[1]);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function perimeter(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;

  return points.reduce(
    (total, point, index) =>
      total +
      distanceMeters(point, points[(index + 1) % points.length]),
    0
  );
}

function area(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;

  const valid = points.filter(
    p => Array.isArray(p) && p.length >= 2
  );

  if (valid.length < 3) return 0;

  const R = 6378137;
  const lat =
    valid.reduce((sum, p) => sum + radians(p[0]), 0) /
    valid.length;

  const cosLat = Math.cos(lat);

  const projected = valid.map(([latValue, lonValue]) => [
    R * radians(lonValue) * cosLat,
    R * radians(latValue),
  ]);

  return Math.abs(
    projected.reduce((sum, current, i) => {
      const next = projected[(i + 1) % projected.length];

      return (
        sum +
        current[0] * next[1] -
        next[0] * current[1]
      );
    }, 0) / 2
  );
}

function formatArea(value) {
  const n = Number(value);

  if (!Number.isFinite(n) || n <= 0) return "0 م²";

  return n >= 10000
    ? `${(n / 10000).toFixed(2)} هكتار`
    : `${n.toFixed(1)} م²`;
}

function formatDistance(value) {
  const n = Number(value);

  if (!Number.isFinite(n) || n <= 0) return "0 م";

  return n >= 1000
    ? `${(n / 1000).toFixed(2)} كم`
    : `${n.toFixed(1)} م`;
}

/* =========================================================
   Map layers

   Satellite
      +
   Roads / places / villages / cities / POI labels

   CARTO's Voyager labels layer is transparent and intended
   to sit above another basemap.
========================================================= */

function MapLayers() {
  return (
    <>
      <TileLayer
        attribution="© Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={20}
        maxNativeZoom={19}
      />

      <TileLayer
        attribution="© OpenStreetMap contributors © CARTO"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png"
        subdomains={["a", "b", "c", "d"]}
        maxZoom={20}
        opacity={1}
        zIndex={10}
      />
    </>
  );
}

/* =========================================================
   Map resize
========================================================= */

function MapResize() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(
      () => map.invalidateSize(false),
      300
    );

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

/* =========================================================
   Manual boundary points
========================================================= */

function BoundarySelector({ onAdd }) {
  useMapEvents({
    click(event) {
      const point = [
        number(event.latlng.lat),
        number(event.latlng.lng),
      ];

      if (point.every(Number.isFinite)) {
        onAdd(point);
      }
    },
  });

  return null;
}

/* =========================================================
   GPS

   Important:
   - getCurrentPosition only
   - no watchPosition
   - one request per button press
   - one flyTo after successful GPS
   - map remains free afterwards
========================================================= */

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
    if (!requestId) return;

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      statusRef.current({
        type: "error",
        message: "📍 هذا الجهاز أو المتصفح لا يدعم تحديد الموقع.",
      });
      return;
    }

    let cancelled = false;

    statusRef.current({
      type: "loading",
      message: "⏳ جارٍ طلب إذن الموقع وتحديد موقعك...",
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        if (cancelled) return;

        const lat = number(position.coords.latitude);
        const lng = number(position.coords.longitude);
        const accuracy = number(position.coords.accuracy);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          statusRef.current({
            type: "error",
            message: "📍 تعذر قراءة إحداثيات موقع الهاتف.",
          });
          return;
        }

        const point = [lat, lng];

        positionRef.current({
          point,
          accuracy,
        });

        /*
          النقل إلى GPS يحدث هنا مرة واحدة فقط.
          لا يوجد أي مركز دائم للخريطة.
        */
        map.flyTo(point, Math.max(map.getZoom(), GPS_ZOOM), {
          animate: true,
          duration: 0.7,
          easeLinearity: 0.25,
        });

        statusRef.current({
          type: "success",
          message: Number.isFinite(accuracy)
            ? `📍 تم تحديد موقعك — الدقة ±${Math.round(accuracy)} م`
            : "📍 تم تحديد موقعك بنجاح.",
        });
      },

      error => {
        if (cancelled) return;

        let message = "📍 تعذر تحديد موقعك.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "📍 تم رفض إذن الموقع. افتح إعدادات المتصفح واسمح للموقع ثم اضغط الزر مرة أخرى.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message =
            "📍 موقع الهاتف غير متاح. تأكد من تشغيل GPS وخدمات الموقع.";
        } else if (error.code === error.TIMEOUT) {
          message =
            "⏳ استغرق تحديد الموقع وقتًا طويلًا. تأكد من تشغيل GPS وحاول مرة أخرى.";
        }

        statusRef.current({
          type: "error",
          message,
        });
      },

      {
        enableHighAccuracy: true,
        timeout: 45000,
        maximumAge: 0,
      }
    );

    return () => {
      cancelled = true;
    };
  }, [requestId, map]);

  return null;
}

/* =========================================================
   GPS visual
========================================================= */

function GPSMarker({ position, accuracy }) {
  if (!Array.isArray(position)) return null;

  const radius = number(accuracy);

  return (
    <>
      {Number.isFinite(radius) && radius > 0 && (
        <Circle
          center={position}
          radius={radius}
          pathOptions={{
            color: "#1976d2",
            weight: 2,
            fillColor: "#2196f3",
            fillOpacity: 0.1,
          }}
        />
      )}

      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          color: "#fff",
          weight: 3,
          fillColor: "#1976d2",
          fillOpacity: 1,
        }}
      />
    </>
  );
}

/* =========================================================
   Simple input
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
}) {
  const style = {
    width: "100%",
    boxSizing: "border-box",
    minHeight: textarea ? "130px" : "58px",
    padding: "13px",
    border: "2px solid #d7ded9",
    borderRadius: "15px",
    fontSize: "17px",
    lineHeight: "1.8",
    background: "#fff",
    outline: "none",
    resize: textarea ? "vertical" : "none",
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
        }}
      >
        {label}
      </strong>

      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={style}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={style}
        />
      )}
    </label>
  );
}

/* =========================================================
   Text location
========================================================= */

function TextLocationForm(props) {
  return (
    <div
      style={{
        display: "grid",
        gap: "15px",
        direction: "rtl",
      }}
    >
      <Field
        label="🌍 البلد"
        value={props.country}
        onChange={props.setCountry}
        placeholder="اسم البلد"
      />

      <Field
        label="🏛️ المحافظة / المنطقة"
        value={props.province}
        onChange={props.setProvince}
        placeholder="اسم المحافظة أو المنطقة"
      />

      <Field
        label="🏙️ المدينة"
        value={props.city}
        onChange={props.setCity}
        placeholder="اسم المدينة"
      />

      <Field
        label="🏘️ البلدة / القرية"
        value={props.town}
        onChange={props.setTown}
        placeholder="اسم البلدة أو القرية"
      />

      <Field
        textarea
        label="📍 وصف موقع الأرض"
        value={props.description}
        onChange={props.setDescription}
        placeholder="وصف موقع الأرض"
      />

      <div
        style={{
          padding: "15px",
          borderRadius: "16px",
          background: "#f2f7f3",
          display: "grid",
          gap: "12px",
        }}
      >
        <strong>🧭 الجهات المحيطة</strong>

        <Field
          label="⬆️ الشمال"
          value={props.northNeighbor}
          onChange={props.setNorthNeighbor}
          placeholder="جار الشمال"
        />

        <Field
          label="⬇️ الجنوب"
          value={props.southNeighbor}
          onChange={props.setSouthNeighbor}
          placeholder="جار الجنوب"
        />

        <Field
          label="➡️ الشرق"
          value={props.eastNeighbor}
          onChange={props.setEastNeighbor}
          placeholder="جار الشرق"
        />

        <Field
          label="⬅️ الغرب"
          value={props.westNeighbor}
          onChange={props.setWestNeighbor}
          placeholder="جار الغرب"
        />
      </div>

      <Field
        textarea
        label="📝 ملاحظات"
        value={props.notes}
        onChange={props.setNotes}
        placeholder="ملاحظات إضافية"
      />
    </div>
  );
}

/* =========================================================
   GPS button
========================================================= */

function GPSButton({ loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        minHeight: "55px",
        border: 0,
        borderRadius: "15px",
        background: loading ? "#78909c" : "#1976d2",
        color: "#fff",
        fontSize: "17px",
        fontWeight: 900,
      }}
    >
      {loading
        ? "⏳ جارٍ تحديد الموقع..."
        : "📍 تحديد موقعي الآن"}
    </button>
  );
}

/* =========================================================
   Full screen map editor
========================================================= */

function FieldMapEditor({
  points,
  setPoints,
  onClose,
  onSave,
}) {
  const safePoints = Array.isArray(points) ? points : [];

  const [requestId, setRequestId] = useState(0);
  const [gpsPosition, setGpsPosition] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState({
    type: "idle",
    message: "",
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  const addPoint = point => {
    setPoints(current => [...current, point]);
  };

  const requestGPS = () => {
    setGpsLoading(true);
    setGpsStatus({
      type: "loading",
      message: "⏳ جارٍ طلب إذن الموقع من الهاتف...",
    });

    setRequestId(id => id + 1);
  };

  const handleGPSPosition = data => {
    if (!data?.point) return;

    setGpsPosition(data.point);
    setGpsAccuracy(data.accuracy);
    setGpsLoading(false);
  };

  const handleGPSStatus = status => {
    setGpsStatus(status);
    setGpsLoading(status?.type === "loading");
  };

  const undo = () => {
    setPoints(current => current.slice(0, -1));
  };

  const clear = () => {
    setPoints([]);
  };

  const save = () => {
    if (safePoints.length < 3) {
      alert("يجب تحديد 3 نقاط على الأقل.");
      return;
    }

    onSave();
  };

  const center =
    safePoints.length > 0
      ? safePoints[safePoints.length - 1]
      : DEFAULT_CENTER;

  const zoom =
    safePoints.length > 0 ? 17 : DEFAULT_ZOOM;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#fff",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl
        dragging
        touchZoom
        doubleClickZoom={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <MapLayers />
        <MapResize />

        <BoundarySelector onAdd={addPoint} />

        <GPSController
          requestId={requestId}
          onPosition={handleGPSPosition}
          onStatus={handleGPSStatus}
        />

        <GPSMarker
          position={gpsPosition}
          accuracy={gpsAccuracy}
        />

        {safePoints.length >= 3 && (
          <Polygon
            positions={safePoints}
            pathOptions={{
              color: "#0b6e32",
              weight: 3,
              fillColor: "#39a852",
              fillOpacity: 0.25,
            }}
          />
        )}

        {safePoints.length === 2 && (
          <Polyline
            positions={safePoints}
            pathOptions={{
              color: "#0b6e32",
              weight: 3,
            }}
          />
        )}

        {safePoints.map((point, index) => (
          <CircleMarker
            key={`${point[0]}-${point[1]}-${index}`}
            center={point}
            radius={8}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor: "#0b6e32",
              fillOpacity: 1,
            }}
          />
        ))}
      </MapContainer>

      {/* Top */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          display: "flex",
          gap: 8,
          direction: "rtl",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 50,
            display: "grid",
            placeItems: "center",
            borderRadius: 15,
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 3px 12px rgba(0,0,0,.2)",
            fontWeight: 900,
          }}
        >
          🛰️ تحديد حدود الأرض
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: 50,
            height: 50,
            border: 0,
            borderRadius: "50%",
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 3px 12px rgba(0,0,0,.2)",
            fontSize: 22,
          }}
        >
          ✕
        </button>
      </div>

      {/* GPS */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 12,
          right: 12,
          zIndex: 1000,
          direction: "rtl",
        }}
      >
        <GPSButton
          loading={gpsLoading}
          onClick={requestGPS}
        />

        {gpsStatus.message && (
          <div
            style={{
              marginTop: 7,
              padding: "9px 11px",
              borderRadius: 12,
              background:
                gpsStatus.type === "error"
                  ? "rgba(183,28,28,.94)"
                  : gpsStatus.type === "success"
                  ? "rgba(20,90,50,.94)"
                  : "rgba(30,70,100,.94)",
              color: "#fff",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 800,
              boxShadow: "0 3px 12px rgba(0,0,0,.2)",
            }}
          >
            {gpsStatus.message}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          top: gpsStatus.message ? 160 : 132,
          left: 12,
          right: 12,
          zIndex: 999,
          padding: 11,
          borderRadius: 14,
          background: "rgba(20,80,40,.92)",
          color: "#fff",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 800,
          direction: "rtl",
        }}
      >
        👆 اضغط على زوايا الأرض واحدة تلو الأخرى
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          🗺️ حرّك الخريطة بحرية ثم حدد النقاط
        </div>
      </div>

      {/* GPS info */}
      {gpsPosition && (
        <div
          style={{
            position: "absolute",
            bottom: 145,
            right: 12,
            zIndex: 1000,
            padding: "9px 12px",
            borderRadius: 13,
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 3px 12px rgba(0,0,0,.2)",
            fontSize: 12,
            fontWeight: 800,
            direction: "rtl",
          }}
        >
          📍 موقع الهاتف

          {Number.isFinite(number(gpsAccuracy)) && (
            <div
              style={{
                marginTop: 3,
                color: "#1976d2",
              }}
            >
              الدقة ±{Math.round(gpsAccuracy)} م
            </div>
          )}
        </div>
      )}

      {/* Point count */}
      <div
        style={{
          position: "absolute",
          bottom: 145,
          left: 12,
          zIndex: 1000,
          padding: "9px 12px",
          borderRadius: 13,
          background: "rgba(255,255,255,.95)",
          boxShadow: "0 3px 12px rgba(0,0,0,.2)",
          fontWeight: 900,
          direction: "rtl",
        }}
      >
        📍 النقاط: {safePoints.length}
      </div>

      {/* Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.3fr",
          gap: 8,
          direction: "rtl",
        }}
      >
        <button
          type="button"
          onClick={undo}
          disabled={!safePoints.length}
          style={bottomButton}
        >
          ↩️ تراجع
        </button>

        <button
          type="button"
          onClick={clear}
          disabled={!safePoints.length}
          style={bottomButton}
        >
          🗑️ مسح
        </button>

        <button
          type="button"
          onClick={save}
          disabled={safePoints.length < 3}
          style={{
            ...bottomButton,
            background:
              safePoints.length >= 3
                ? "#1b7f3a"
                : "#9e9e9e",
            color: "#fff",
          }}
        >
          💾 حفظ الأرض
        </button>
      </div>
    </div>
  );
}

const bottomButton = {
  minHeight: 55,
  border: 0,
  borderRadius: 14,
  background: "#fff",
  fontSize: 15,
  fontWeight: 900,
  boxShadow: "0 2px 8px rgba(0,0,0,.16)",
};

/* =========================================================
   Main page
========================================================= */

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

  const [locationMethod, setLocationMethod] =
    useState("text");

  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [description, setDescription] = useState("");

  const [northNeighbor, setNorthNeighbor] = useState("");
  const [southNeighbor, setSouthNeighbor] = useState("");
  const [eastNeighbor, setEastNeighbor] = useState("");
  const [westNeighbor, setWestNeighbor] = useState("");

  const [fieldPoints, setFieldPoints] = useState([]);
  const [mapEditor, setMapEditor] = useState(false);

  const selectedFarm = useMemo(
    () =>
      farms.find(
        farm => String(farm.id) === String(farmId)
      ),
    [farms, farmId]
  );

  const reset = () => {
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

  const saveLocation = async () => {
    if (!farmId) {
      alert("اختر المزرعة أولًا.");
      return;
    }

    if (
      locationMethod === "map" &&
      fieldPoints.length < 3
    ) {
      alert("حدد حدود الأرض على الخريطة أولًا.");
      return;
    }

    if (
      locationMethod === "text" &&
      ![
        country,
        province,
        city,
        town,
        description,
        northNeighbor,
        southNeighbor,
        eastNeighbor,
        westNeighbor,
      ].some(value => value.trim())
    ) {
      alert("اكتب معلومات موقع الأرض أولًا.");
      return;
    }

    const first = fieldPoints[0] || null;

    const data = {
      farmId: String(farmId),
      farmName: selectedFarm?.name || "",
      type: locationType || "field",
      source: locationMethod,

      country: country.trim(),
      region: province.trim(),
      city: city.trim(),
      town: town.trim(),
      village: town.trim(),

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

      points: fieldPoints.map(point => ({
        latitude: Number(point[0]),
        longitude: Number(point[1]),
      })),

      latitude: first ? Number(first[0]) : null,
      longitude: first ? Number(first[1]) : null,

      area:
        locationMethod === "map"
          ? area(fieldPoints)
          : null,

      perimeter:
        locationMethod === "map"
          ? perimeter(fieldPoints)
          : null,

      notes: notes?.trim() || "",
      status: "active",
    };

    try {
      await addLocation(data);
      reset();
    } catch (error) {
      console.error("Map save error:", error);

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
        onClose={() => setMapEditor(false)}
        onSave={() => setMapEditor(false)}
      />
    );
  }

  return (
    <div
      style={{
        padding: 12,
        direction: "rtl",
      }}
    >
      <h1>🗺️ موقع الأرض</h1>

      <Card title="🌾 الأرض والمزرعة">
        <select
          value={farmId || ""}
          onChange={e => setFarmId(e.target.value)}
          style={selectStyle}
        >
          <option value="">اختر المزرعة</option>

          {farms.map(farm => (
            <option
              key={farm.id}
              value={farm.id}
            >
              {farm.name}
            </option>
          ))}
        </select>

        <div style={{ height: 12 }} />

        <select
          value={locationType || "field"}
          onChange={e =>
            setLocationType(e.target.value)
          }
          style={selectStyle}
        >
          <option value="field">🌱 حقل</option>
          <option value="farm">🌾 مزرعة</option>
          <option value="waterSource">
            💧 مصدر مياه
          </option>
        </select>
      </Card>

      <div style={{ height: 12 }} />

      <Card title="📍 كيف تريد تحديد موقع الأرض؟">
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => setLocationMethod("text")}
            style={methodStyle(
              locationMethod === "text"
            )}
          >
            ✍️ كتابة موقع الأرض
            <small>
              البلد → المحافظة → المدينة → البلدة
            </small>
          </button>

          <button
            type="button"
            onClick={() => {
              setLocationMethod("map");
              setMapEditor(true);
            }}
            style={methodStyle(
              locationMethod === "map"
            )}
          >
            🛰️ تحديد الأرض على الخريطة
            <small>
              أقمار صناعية + طرق + مدن + قرى + GPS
            </small>
          </button>
        </div>
      </Card>

      <div style={{ height: 12 }} />

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
            setNorthNeighbor={setNorthNeighbor}
            southNeighbor={southNeighbor}
            setSouthNeighbor={setSouthNeighbor}
            eastNeighbor={eastNeighbor}
            setEastNeighbor={setEastNeighbor}
            westNeighbor={westNeighbor}
            setWestNeighbor={setWestNeighbor}
            notes={notes || ""}
            setNotes={setNotes}
          />
        </Card>
      )}

      {locationMethod === "map" && (
        <Card title="🛰️ حدود الأرض">
          <div
            style={{
              padding: 16,
              borderRadius: 15,
              background: "#f2f7f3",
              lineHeight: 1.8,
            }}
          >
            <strong>
              {fieldPoints.length >= 3
                ? "تم تحديد حدود الأرض."
                : "لم يتم تحديد الحدود بعد."}
            </strong>

            <div>
              النقاط: {fieldPoints.length}
            </div>

            {fieldPoints.length >= 3 && (
              <>
                <div>
                  📐 المساحة:{" "}
                  {formatArea(area(fieldPoints))}
                </div>

                <div>
                  📏 المحيط:{" "}
                  {formatDistance(
                    perimeter(fieldPoints)
                  )}
                </div>
              </>
            )}

            <div style={{ marginTop: 12 }}>
              <Button
                onClick={() => setMapEditor(true)}
              >
                🛰️ فتح الخريطة
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ height: 15 }} />

      <Button onClick={saveLocation}>
        {loading
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ موقع الأرض"}
      </Button>

      <h2 style={{ marginTop: 25 }}>
        🗺️ المواقع المحفوظة
      </h2>

      {locations.length === 0 ? (
        <p>لا توجد مواقع محفوظة حتى الآن.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
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
                <p>🌾 {item.farmName}</p>
              )}

              {item.country && (
                <p>🌍 {item.country}</p>
              )}

              {item.region && (
                <p>🏛️ {item.region}</p>
              )}

              {item.city && (
                <p>🏙️ {item.city}</p>
              )}

              {item.town && (
                <p>🏘️ {item.town}</p>
              )}

              {item.locationDescription && (
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8,
                  }}
                >
                  📍 {item.locationDescription}
                </p>
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
                  {formatDistance(item.perimeter)}
                </p>
              )}

              {item.notes && (
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  📝 {item.notes}
                </p>
              )}

              {item.latitude != null &&
                item.longitude != null && (
                  <a
                    href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🗺️ فتح الموقع على Google Maps
                  </a>
                )}

              <div style={{ height: 10 }} />

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

/* =========================================================
   Small styles
========================================================= */

const selectStyle = {
  width: "100%",
  minHeight: 58,
  padding: 12,
  border: "2px solid #d7ded9",
  borderRadius: 15,
  fontSize: 17,
  background: "#fff",
};

const methodStyle = selected => ({
  minHeight: 90,
  padding: 15,
  borderRadius: 17,
  border: selected
    ? "3px solid #1b7f3a"
    : "2px solid #d7ded9",
  background: selected
    ? "#edf8f0"
    : "#fff",
  textAlign: "right",
  fontSize: 18,
  fontWeight: 900,
});

export default Map;
