// src/pages/Map.jsx

import { useMemo, useState, useEffect, useRef } from "react";
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

const DEFAULT_POSITION = [36.7, 38.7];
const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

/* =========================================================
   HELPERS
========================================================= */

function distance(a, b) {
  const R = 6371008.8;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function perimeter(points) {
  if (points.length < 3) return 0;

  return points.reduce(
    (sum, point, i) =>
      sum + distance(point, points[(i + 1) % points.length]),
    0
  );
}

function area(points) {
  if (points.length < 3) return 0;

  const R = 6378137;
  const avgLat =
    points.reduce((sum, p) => sum + p[0], 0) / points.length;

  const cosLat = Math.cos((avgLat * Math.PI) / 180);

  const xy = points.map(([lat, lng]) => [
    R * ((lng * Math.PI) / 180) * cosLat,
    R * ((lat * Math.PI) / 180),
  ]);

  let result = 0;

  for (let i = 0; i < xy.length; i++) {
    const a = xy[i];
    const b = xy[(i + 1) % xy.length];

    result += a[0] * b[1] - b[0] * a[1];
  }

  return Math.abs(result / 2);
}

function formatArea(value) {
  if (!value || value <= 0) return "0 م²";

  return value >= 10000
    ? `${(value / 10000).toFixed(2)} هكتار`
    : `${value.toFixed(1)} م²`;
}

function formatDistance(value) {
  if (!value || value <= 0) return "0 م";

  return value >= 1000
    ? `${(value / 1000).toFixed(2)} كم`
    : `${value.toFixed(1)} م`;
}

/* =========================================================
   MAP LAYERS
========================================================= */

function MapLayers() {
  return (
    <>
      {/* صور الأقمار الصناعية */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="© Esri © Maxar © Earthstar Geographics"
        maxZoom={20}
        maxNativeZoom={19}
      />

      {/* الطرق + أسماء الأماكن */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="© Esri"
        opacity={0}
      />

      {/* طبقة حديثة للسياق الجغرافي */}
      <TileLayer
        url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        attribution="© Esri © OpenStreetMap contributors"
        opacity={0.95}
        maxZoom={20}
        maxNativeZoom={19}
      />

      {/* أسماء المدن والقرى والأماكن */}
      <TileLayer
        url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Basemap_v2/MapServer/tile/{z}/{y}/{x}"
        attribution="© Esri"
        opacity={0.75}
        maxZoom={20}
        maxNativeZoom={19}
      />
    </>
  );
}

/* =========================================================
   MAP RESIZE
========================================================= */

function MapResize() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

/* =========================================================
   MANUAL POINTS
========================================================= */

function PointSelector({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

/* =========================================================
   GPS
========================================================= */

function GPSController({
  requestId,
  onPosition,
  onStatus,
}) {
  const map = useMap();
  const lastRequest = useRef(0);

  useEffect(() => {
    if (!requestId || requestId === lastRequest.current) {
      return;
    }

    lastRequest.current = requestId;

    if (!navigator.geolocation) {
      onStatus({
        type: "error",
        message: "📍 جهازك أو المتصفح لا يدعم تحديد الموقع.",
      });
      return;
    }

    onStatus({
      type: "loading",
      message:
        "⏳ جارٍ طلب إذن الموقع من الهاتف...",
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = Number(position.coords.latitude);
        const lng = Number(position.coords.longitude);
        const accuracy = Number(position.coords.accuracy);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          onStatus({
            type: "error",
            message: "📍 تعذر قراءة موقع الهاتف.",
          });
          return;
        }

        /*
         * لا نعتبر ±2000م موقعًا دقيقًا.
         */
        if (!Number.isFinite(accuracy) || accuracy > 250) {
          onPosition({
            point: [lat, lng],
            accuracy,
            accurate: false,
          });

          onStatus({
            type: "warning",
            message:
              `⚠️ الموقع الحالي غير دقيق — الدقة ±${Math.round(
                accuracy
              )}م. فعّل الموقع الدقيق/GPS ثم حاول مرة أخرى.`,
          });

          return;
        }

        const point = [lat, lng];

        onPosition({
          point,
          accuracy,
          accurate: true,
        });

        /*
         * تحريك واحد فقط.
         */
        map.flyTo(point, Math.max(map.getZoom(), GPS_ZOOM), {
          animate: true,
          duration: 0.8,
        });

        onStatus({
          type: "success",
          message:
            `📍 تم تحديد موقعك — الدقة ±${Math.round(
              accuracy
            )}م`,
        });
      },
      error => {
        let message =
          "📍 تعذر تحديد موقعك.";

        if (error.code === 1) {
          message =
            "🔒 لم يتم السماح بالموقع. اسمح للمتصفح باستخدام موقع الهاتف ثم حاول مرة أخرى.";
        }

        if (error.code === 2) {
          message =
            "📍 موقع الهاتف غير متاح. تأكد من تشغيل GPS وخدمات الموقع.";
        }

        if (error.code === 3) {
          message =
            "⏳ انتهى وقت تحديد الموقع. حاول مرة أخرى في مكان مفتوح.";
        }

        onStatus({
          type: "error",
          message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  }, [requestId, map, onPosition, onStatus]);

  return null;
}

/* =========================================================
   GPS VISUAL
========================================================= */

function GPSMarker({ position, accuracy }) {
  if (!position) return null;

  return (
    <>
      {Number.isFinite(accuracy) && accuracy > 0 && (
        <Circle
          center={position}
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
        center={position}
        radius={9}
        pathOptions={{
          color: "#fff",
          weight: 4,
          fillColor: "#1976d2",
          fillOpacity: 1,
        }}
      />
    </>
  );
}

/* =========================================================
   FIELD EDITOR
========================================================= */

function FieldMapEditor({
  points,
  setPoints,
  onClose,
  onSave,
}) {
  const [requestId, setRequestId] = useState(0);
  const [gps, setGps] = useState(null);

  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });

  const loading = status.type === "loading";

  const addPoint = point => {
    setPoints(current => [...current, point]);
  };

  const requestGPS = () => {
    if (loading) return;

    setStatus({
      type: "loading",
      message: "⏳ جارٍ طلب GPS والموقع الدقيق...",
    });

    setRequestId(id => id + 1);
  };

  const undo = () => {
    setPoints(current => current.slice(0, -1));
  };

  const clear = () => {
    setPoints([]);
  };

  const save = () => {
    if (points.length < 3) {
      alert("يجب تحديد 3 نقاط على الأقل.");
      return;
    }

    onSave();
  };

  const center =
    points.length > 0
      ? points[points.length - 1]
      : DEFAULT_POSITION;

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
        zoom={points.length ? 18 : DEFAULT_ZOOM}
        scrollWheelZoom
        dragging
        touchZoom
        zoomControl
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <MapLayers />

        <MapResize />

        <PointSelector onAdd={addPoint} />

        <GPSController
          requestId={requestId}
          onPosition={setGps}
          onStatus={setStatus}
        />

        {gps && (
          <GPSMarker
            position={gps.point}
            accuracy={gps.accuracy}
          />
        )}

        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "#0b6e32",
              weight: 4,
              fillColor: "#39a852",
              fillOpacity: 0.25,
            }}
          />
        )}

        {points.length === 2 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#0b6e32",
              weight: 4,
            }}
          />
        )}

        {points.map((point, index) => (
          <CircleMarker
            key={`${point[0]}-${point[1]}-${index}`}
            center={point}
            radius={9}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor: "#0b6e32",
              fillOpacity: 1,
            }}
          />
        ))}
      </MapContainer>

      {/* العنوان */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 100000,
          display: "flex",
          gap: 10,
          direction: "rtl",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 3px 15px rgba(0,0,0,.25)",
            fontWeight: 900,
          }}
        >
          🛰️ تحديد حدود الأرض
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: 52,
            height: 52,
            border: 0,
            borderRadius: "50%",
            background: "#fff",
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          ✕
        </button>
      </div>

      {/* GPS */}
      <div
        style={{
          position: "absolute",
          top: 78,
          left: 12,
          right: 12,
          zIndex: 100000,
          direction: "rtl",
        }}
      >
        <button
          type="button"
          disabled={loading}
          onClick={requestGPS}
          style={{
            width: "100%",
            minHeight: 58,
            border: 0,
            borderRadius: 16,
            background: loading ? "#78909c" : "#1976d2",
            color: "#fff",
            fontSize: 17,
            fontWeight: 900,
          }}
        >
          {loading
            ? "⏳ جارٍ تحديد الموقع..."
            : "📍 تحديد موقعي الآن"}
        </button>

        {status.message && (
          <div
            style={{
              marginTop: 8,
              padding: 10,
              borderRadius: 13,
              background:
                status.type === "error"
                  ? "#b71c1c"
                  : status.type === "warning"
                  ? "#9a6700"
                  : status.type === "success"
                  ? "#145a32"
                  : "#1e4664",
              color: "#fff",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {status.message}
          </div>
        )}
      </div>

      {/* التعليمات */}
      <div
        style={{
          position: "absolute",
          top: status.message ? 178 : 150,
          left: 12,
          right: 12,
          zIndex: 100000,
          padding: 12,
          borderRadius: 16,
          background: "rgba(20,80,40,.94)",
          color: "#fff",
          textAlign: "center",
          fontWeight: 800,
          direction: "rtl",
        }}
      >
        👆 اضغط على زوايا الأرض واحدة تلو الأخرى

        <div
          style={{
            marginTop: 5,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          🛰️ حرّك الخريطة بحرية ثم حدد الزوايا
        </div>
      </div>

      {/* المعلومات */}
      <div
        style={{
          position: "absolute",
          bottom: 145,
          left: 12,
          zIndex: 100000,
          padding: "10px 14px",
          borderRadius: 14,
          background: "#fff",
          boxShadow: "0 3px 14px rgba(0,0,0,.25)",
          fontWeight: 900,
          direction: "rtl",
        }}
      >
        📍 النقاط: {points.length}
      </div>

      {gps && (
        <div
          style={{
            position: "absolute",
            bottom: 145,
            right: 12,
            zIndex: 100000,
            padding: "10px 13px",
            borderRadius: 14,
            background: "#fff",
            boxShadow: "0 3px 14px rgba(0,0,0,.25)",
            fontSize: 13,
            fontWeight: 800,
            direction: "rtl",
          }}
        >
          📍 موقع الهاتف

          {Number.isFinite(gps.accuracy) && (
            <div
              style={{
                marginTop: 4,
                color:
                  gps.accurate
                    ? "#1976d2"
                    : "#9a6700",
              }}
            >
              الدقة: ±{Math.round(gps.accuracy)}م
            </div>
          )}
        </div>
      )}

      {/* الأزرار */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 100000,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.3fr",
          gap: 8,
          direction: "rtl",
        }}
      >
        <button
          type="button"
          onClick={undo}
          disabled={!points.length}
          style={{
            minHeight: 58,
            border: 0,
            borderRadius: 15,
            background: "#fff",
            fontWeight: 900,
          }}
        >
          ↩️ تراجع
        </button>

        <button
          type="button"
          onClick={clear}
          disabled={!points.length}
          style={{
            minHeight: 58,
            border: 0,
            borderRadius: 15,
            background: "#fff",
            fontWeight: 900,
          }}
        >
          🗑️ مسح
        </button>

        <button
          type="button"
          onClick={save}
          disabled={points.length < 3}
          style={{
            minHeight: 58,
            border: 0,
            borderRadius: 15,
            background:
              points.length >= 3
                ? "#1b7f3a"
                : "#9e9e9e",
            color: "#fff",
            fontWeight: 900,
          }}
        >
          💾 حفظ الأرض
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   TEXT FIELD
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
    minHeight: textarea ? 120 : 62,
    padding: 14,
    border: "2px solid #d7ded9",
    borderRadius: 16,
    fontSize: 17,
    background: "#fff",
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
          marginBottom: 7,
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
   MAIN
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

  const [method, setMethod] = useState("text");

  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [description, setDescription] = useState("");

  const [points, setPoints] = useState([]);
  const [editor, setEditor] = useState(false);

  const farm = useMemo(
    () =>
      farms.find(
        item => String(item.id) === String(farmId)
      ),
    [farms, farmId]
  );

  const reset = () => {
    setCountry("");
    setProvince("");
    setCity("");
    setTown("");
    setDescription("");
    setPoints([]);
    setNotes("");
    setMethod("text");
  };

  const saveMap = () => {
    if (points.length < 3) {
      alert("حدد 3 نقاط على الأقل.");
      return;
    }

    setEditor(false);
  };

  const save = async () => {
    if (!farmId) {
      alert("اختر المزرعة أولًا.");
      return;
    }

    if (method === "map" && points.length < 3) {
      alert("حدد حدود الأرض على الخريطة.");
      return;
    }

    const first = points[0];

    try {
      await addLocation({
        farmId: String(farmId),
        farmName: farm?.name || "",
        type: locationType || "field",
        source: method,

        country: country.trim(),
        region: province.trim(),
        city: city.trim(),
        town: town.trim(),
        village: town.trim(),

        placeName:
          town.trim() || city.trim(),

        locationDescription:
          description.trim(),

        points: points.map(p => ({
          latitude: Number(p[0]),
          longitude: Number(p[1]),
        })),

        latitude: first ? Number(first[0]) : null,
        longitude: first ? Number(first[1]) : null,

        area:
          method === "map"
            ? area(points)
            : null,

        perimeter:
          method === "map"
            ? perimeter(points)
            : null,

        notes: notes?.trim() || "",
        status: "active",
      });

      reset();
    } catch (error) {
      console.error(error);

      alert(
        error?.message ||
          "حدث خطأ أثناء حفظ الموقع."
      );
    }
  };

  if (editor) {
    return (
      <FieldMapEditor
        points={points}
        setPoints={setPoints}
        onClose={() => setEditor(false)}
        onSave={saveMap}
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
          onChange={e =>
            setFarmId(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: 62,
            borderRadius: 16,
            fontSize: 18,
          }}
        >
          <option value="">
            اختر المزرعة
          </option>

          {farms.map(item => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <div style={{ height: 12 }} />

        <select
          value={locationType || "field"}
          onChange={e =>
            setLocationType(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: 62,
            borderRadius: 16,
            fontSize: 18,
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

      <div style={{ height: 14 }} />

      <Card title="📍 طريقة تحديد الموقع">
        <button
          type="button"
          onClick={() => setMethod("text")}
          style={{
            width: "100%",
            minHeight: 90,
            marginBottom: 10,
            borderRadius: 18,
            border:
              method === "text"
                ? "3px solid #1b7f3a"
                : "2px solid #ddd",
            background:
              method === "text"
                ? "#edf8f0"
                : "#fff",
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          ✍️ كتابة موقع الأرض
        </button>

        <button
          type="button"
          onClick={() => {
            setMethod("map");
            setEditor(true);
          }}
          style={{
            width: "100%",
            minHeight: 90,
            borderRadius: 18,
            border:
              method === "map"
                ? "3px solid #1b7f3a"
                : "2px solid #ddd",
            background:
              method === "map"
                ? "#edf8f0"
                : "#fff",
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          🛰️ تحديد الأرض على الخريطة
        </button>
      </Card>

      {method === "text" && (
        <>
          <div style={{ height: 14 }} />

          <Card title="✍️ بيانات موقع الأرض">
            <div
              style={{
                display: "grid",
                gap: 15,
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
                placeholder="اكتب المحافظة"
              />

              <Field
                label="🏙️ المدينة"
                value={city}
                onChange={setCity}
                placeholder="اكتب المدينة"
              />

              <Field
                label="🏘️ البلدة / القرية"
                value={town}
                onChange={setTown}
                placeholder="اكتب البلدة أو القرية"
              />

              <Field
                textarea
                label="📍 وصف موقع الأرض"
                value={description}
                onChange={setDescription}
                placeholder="وصف الموقع"
              />

              <Field
                textarea
                label="📝 ملاحظات"
                value={notes || ""}
                onChange={setNotes}
                placeholder="ملاحظات"
              />
            </div>
          </Card>
        </>
      )}

      {method === "map" && (
        <>
          <div style={{ height: 14 }} />

          <Card title="🛰️ حدود الأرض">
            <p>
              النقاط المحددة:{" "}
              <strong>{points.length}</strong>
            </p>

            {points.length >= 3 && (
              <>
                <p>
                  📐 المساحة:{" "}
                  <strong>
                    {formatArea(area(points))}
                  </strong>
                </p>

                <p>
                  📏 المحيط:{" "}
                  <strong>
                    {formatDistance(
                      perimeter(points)
                    )}
                  </strong>
                </p>
              </>
            )}

            <Button
              onClick={() => setEditor(true)}
            >
              🛰️ فتح الخريطة
            </Button>
          </Card>
        </>
      )}

      <div style={{ height: 18 }} />

      <Button onClick={save}>
        {loading
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ موقع الأرض"}
      </Button>

      <h2>🗺️ المواقع المحفوظة</h2>

      {locations.length === 0 ? (
        <p>لا توجد مواقع محفوظة حتى الآن.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 14,
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
                <p>
                  📍 {item.locationDescription}
                </p>
              )}

              {Number(item.area) > 0 && (
                <p>
                  📐 {formatArea(item.area)}
                </p>
              )}

              {Number(item.perimeter) > 0 && (
                <p>
                  📏 {formatDistance(item.perimeter)}
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
