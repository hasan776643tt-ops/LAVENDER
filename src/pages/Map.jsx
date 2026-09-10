// =========================================================
// LAVENDER — MAP PAGE
// src/pages/Map.jsx
// =========================================================

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
import "../styles/Map.css";

import useMapHook from "../hooks/useMap.js";

import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

import {
  calculateArea,
  calculatePerimeter,
  calculateCenter,
} from "../utils/geoUtils.js";


// =========================================================
// CONSTANTS
// =========================================================

const DEFAULT_POSITION = [36.7, 38.7];

const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

const GPS_MAX_ATTEMPTS = 4;
const GPS_RETRY_WAIT = 1800;

const GPS_GOOD_ACCURACY = 50;
const GPS_ACCEPTABLE_ACCURACY = 100;


// =========================================================
// HELPERS
// =========================================================

function cleanString(value) {
  return String(value ?? "").trim();
}

function isValidCoordinate(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function normalizePoint(point) {
  if (!point) return null;

  const latitude =
    point.latitude ??
    point.lat ??
    point.y;

  const longitude =
    point.longitude ??
    point.lng ??
    point.lon ??
    point.x;

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return [
    Number(latitude),
    Number(longitude),
  ];
}

function normalizePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(normalizePoint)
    .filter(Boolean);
}

function getCenterFromPoints(points) {
  const normalized = normalizePoints(points);

  if (!normalized.length) {
    return DEFAULT_POSITION;
  }

  try {
    if (typeof calculateCenter === "function") {
      const center = calculateCenter(normalized);

      const normalizedCenter = normalizePoint(center);

      if (normalizedCenter) {
        return normalizedCenter;
      }
    }
  } catch {
    // fallback below
  }

  const lat =
    normalized.reduce(
      (sum, point) => sum + point[0],
      0
    ) / normalized.length;

  const lng =
    normalized.reduce(
      (sum, point) => sum + point[1],
      0
    ) / normalized.length;

  return [lat, lng];
}

function getMapLocationCenter(location) {
  if (!location) {
    return null;
  }

  const direct = normalizePoint(location);

  if (direct) {
    return direct;
  }

  const center = normalizePoint({
    latitude:
      location.latitude ??
      location.center?.latitude ??
      location.center?.lat ??
      location.lat,

    longitude:
      location.longitude ??
      location.center?.longitude ??
      location.center?.lng ??
      location.lng,
  });

  if (center) {
    return center;
  }

  const points =
    location.points ??
    location.boundary ??
    [];

  const normalized = normalizePoints(points);

  if (normalized.length) {
    return getCenterFromPoints(normalized);
  }

  return null;
}


// =========================================================
// MAP LAYERS
// =========================================================

function MapLayers() {
  return (
    <>
      <TileLayer
        attribution="© Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      <TileLayer
        attribution="© Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
      />

      <TileLayer
        attribution="© Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
      />

      <TileLayer
        attribution="© CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
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
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}


// =========================================================
// MAP CENTER CONTROLLER
// =========================================================

function MapCenterController({ center, zoom }) {
  const map = useMap();

  const lastCenterRef = useRef(null);

  useEffect(() => {
    if (!center || !Array.isArray(center)) {
      return;
    }

    const lat = Number(center[0]);
    const lng = Number(center[1]);

    if (!isValidCoordinate(lat, lng)) {
      return;
    }

    const key = `${lat.toFixed(7)}:${lng.toFixed(7)}:${zoom}`;

    if (lastCenterRef.current === key) {
      return;
    }

    lastCenterRef.current = key;

    map.setView(
      [lat, lng],
      zoom ?? map.getZoom(),
      {
        animate: true,
      }
    );
  }, [center, zoom, map]);

  return null;
}


// =========================================================
// MANUAL BOUNDARY POINT SELECTOR
// =========================================================

function BoundaryPointSelector({
  onSelect,
}) {
  useMapEvents({
    click(event) {
      if (!event?.latlng) {
        return;
      }

      onSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}


// =========================================================
// GPS CONTROLLER
// =========================================================

function GPSController({
  onLocation,
  onError,
  active,
}) {
  const attemptsRef = useRef(0);
  const bestPositionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      onError?.(
        "GPS غير متوفر على هذا الجهاز."
      );

      return undefined;
    }

    let cancelled = false;

    attemptsRef.current = 0;
    bestPositionRef.current = null;

    const clearRetry = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const finishWithBest = () => {
      if (cancelled) {
        return;
      }

      if (bestPositionRef.current) {
        onLocation?.(
          bestPositionRef.current
        );

        return;
      }

      onError?.(
        "تعذر الحصول على موقع الهاتف."
      );
    };

    const request = () => {
      if (cancelled) {
        return;
      }

      attemptsRef.current += 1;

      navigator.geolocation.getCurrentPosition(
        position => {
          if (cancelled) {
            return;
          }

          const latitude =
            position?.coords?.latitude;

          const longitude =
            position?.coords?.longitude;

          const accuracy =
            position?.coords?.accuracy;

          if (
            !isValidCoordinate(
              latitude,
              longitude
            )
          ) {
            if (
              attemptsRef.current <
              GPS_MAX_ATTEMPTS
            ) {
              timerRef.current =
                setTimeout(
                  request,
                  GPS_RETRY_WAIT
                );
            } else {
              finishWithBest();
            }

            return;
          }

          const current = {
            latitude: Number(latitude),
            longitude: Number(longitude),
            accuracy:
              Number.isFinite(
                Number(accuracy)
              )
                ? Number(accuracy)
                : null,
          };

          const previous =
            bestPositionRef.current;

          if (
            !previous ||
            (
              current.accuracy != null &&
              (
                previous.accuracy == null ||
                current.accuracy <
                  previous.accuracy
              )
            )
          ) {
            bestPositionRef.current =
              current;
          }

          if (
            current.accuracy != null &&
            current.accuracy <=
              GPS_GOOD_ACCURACY
          ) {
            onLocation?.(current);
            return;
          }

          if (
            attemptsRef.current >=
            GPS_MAX_ATTEMPTS
          ) {
            finishWithBest();
            return;
          }

          timerRef.current =
            setTimeout(
              request,
              GPS_RETRY_WAIT
            );
        },

        error => {
          if (cancelled) {
            return;
          }

          if (
            attemptsRef.current <
            GPS_MAX_ATTEMPTS
          ) {
            timerRef.current =
              setTimeout(
                request,
                GPS_RETRY_WAIT
              );

            return;
          }

          let message =
            "تعذر تحديد موقع الهاتف.";

          if (error?.code === 1) {
            message =
              "يرجى السماح للتطبيق باستخدام الموقع.";
          } else if (error?.code === 2) {
            message =
              "تعذر تحديد موقع الهاتف حاليًا.";
          } else if (error?.code === 3) {
            message =
              "انتهت مهلة تحديد الموقع.";
          }

          onError?.(message);
        },

        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    };

    request();

    return () => {
      cancelled = true;
      clearRetry();
    };
  }, [
    active,
    onLocation,
    onError,
  ]);

  return null;
}


// =========================================================
// GPS VISUAL
// =========================================================

function GPSLocationVisual({
  position,
}) {
  if (!position) {
    return null;
  }

  const center = [
    position.latitude,
    position.longitude,
  ];

  const accuracy =
    Number(position.accuracy);

  return (
    <>
      {Number.isFinite(accuracy) &&
      accuracy > 0 ? (
        <Circle
          center={center}
          radius={accuracy}
          pathOptions={{
            fillOpacity: 0.12,
            opacity: 0.5,
          }}
        />
      ) : null}

      <CircleMarker
        center={center}
        radius={7}
        pathOptions={{
          weight: 3,
          fillOpacity: 1,
        }}
      >
        <Tooltip permanent direction="top">
          📍 موقعي الحالي
        </Tooltip>
      </CircleMarker>
    </>
  );
}


// =========================================================
// INPUT FIELD
// =========================================================

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
}) {
  return (
    <div className="map-field">
      <label>{label}</label>

      {textarea ? (
        <textarea
          value={value}
          onChange={event =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={event =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
        />
      )}
    </div>
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
  neighbors,
  setNeighbors,
  notes,
  setNotes,
}) {
  return (
    <div className="map-location-form">
      <Field
        label="🌍 الدولة"
        value={country}
        onChange={setCountry}
        placeholder="مثال: سوريا"
      />

      <Field
        label="🏛️ المحافظة"
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
        label="🏘️ القرية"
        value={town}
        onChange={setTown}
        placeholder="اسم القرية أو البلدة"
      />

      <Field
        label="📍 وصف الموقع"
        value={description}
        onChange={setDescription}
        placeholder="وصف يساعد على معرفة مكان الأرض"
        textarea
      />

      <Field
        label="🧭 الحدود أو المعالم القريبة"
        value={neighbors}
        onChange={setNeighbors}
        placeholder="طريق، نهر، مزرعة، قرية..."
        textarea
      />

      <Field
        label="📝 ملاحظات"
        value={notes}
        onChange={setNotes}
        placeholder="أي ملاحظات إضافية"
        textarea
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
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      {loading
        ? "⏳ جارٍ تحديد موقعي..."
        : "📍 تحديد موقعي الآن"}
    </Button>
  );
}


// =========================================================
// FIELD MAP EDITOR
// =========================================================

function FieldMapEditor({
  points,
  setPoints,
  gpsPosition,
  setGpsPosition,
  gpsLoading,
  requestGPS,
  gpsError,
  setGpsError,
  onSave,
  onCancel,
}) {
  const center =
    points.length > 0
      ? getCenterFromPoints(points)
      : gpsPosition
        ? [
            gpsPosition.latitude,
            gpsPosition.longitude,
          ]
        : DEFAULT_POSITION;

  const zoom =
    gpsPosition || points.length
      ? GPS_ZOOM
      : DEFAULT_ZOOM;

  const area = useMemo(() => {
    if (points.length < 3) {
      return 0;
    }

    try {
      return Number(
        calculateArea(points) || 0
      );
    } catch {
      return 0;
    }
  }, [points]);

  const perimeter = useMemo(() => {
    if (points.length < 2) {
      return 0;
    }

    try {
      return Number(
        calculatePerimeter(points) || 0
      );
    } catch {
      return 0;
    }
  }, [points]);

  const handlePoint = (
    latitude,
    longitude
  ) => {
    setPoints(current => [
      ...current,
      [
        Number(latitude),
        Number(longitude),
      ],
    ]);
  };

  const removeLastPoint = () => {
    setPoints(current =>
      current.slice(0, -1)
    );
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const movePoint = (
    index,
    latitude,
    longitude
  ) => {
    setPoints(current =>
      current.map(
        (point, pointIndex) =>
          pointIndex === index
            ? [
                Number(latitude),
                Number(longitude),
              ]
            : point
      )
    );
  };

  return (
    <div className="map-editor-overlay">
      <div className="map-editor">
        <div className="map-editor-header">
          <div>
            <h2>
              🗺️ تحديد موقع الأرض
            </h2>

            <p>
              حرّك الخريطة يدويًا ثم اضغط
              على حدود الأرض لإضافة النقاط.
            </p>
          </div>

          <Button
            type="button"
            onClick={onCancel}
          >
            ✕
          </Button>
        </div>

        <div className="map-editor-toolbar">
          <GPSButton
            onClick={() => {
              setGpsError?.("");
              requestGPS();
            }}
            loading={gpsLoading}
          />

          <Button
            type="button"
            onClick={() => {
              if (!gpsPosition) {
                requestGPS();
                return;
              }

              handlePoint(
                gpsPosition.latitude,
                gpsPosition.longitude
              );
            }}
            disabled={!gpsPosition}
          >
            📍 إضافة نقطة من GPS
          </Button>

          <Button
            type="button"
            onClick={removeLastPoint}
            disabled={!points.length}
          >
            ↩️ تراجع
          </Button>

          <Button
            type="button"
            onClick={clearPoints}
            disabled={!points.length}
          >
            🗑️ مسح النقاط
          </Button>
        </div>

        {gpsError ? (
          <div className="map-error">
            {gpsError}
          </div>
        ) : null}

        <div className="map-editor-info">
          <span>
            📌 النقاط: {points.length}
          </span>

          <span>
            📐 المساحة:{" "}
            {area > 0
              ? `${area.toFixed(2)} م²`
              : "—"}
          </span>

          <span>
            📏 المحيط:{" "}
            {perimeter > 0
              ? `${perimeter.toFixed(2)} م`
              : "—"}
          </span>
        </div>

        <div className="map-editor-map">
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <MapLayers />

            <MapResizeHandler />

            <MapCenterController
              center={center}
              zoom={zoom}
            />

            <BoundaryPointSelector
              onSelect={handlePoint}
            />

            {points.length >= 2 ? (
              <Polyline
                positions={points}
                pathOptions={{
                  weight: 3,
                }}
              />
            ) : null}

            {points.length >= 3 ? (
              <Polygon
                positions={points}
                pathOptions={{
                  fillOpacity: 0.2,
                  weight: 3,
                }}
              />
            ) : null}

            {points.map(
              (point, index) => (
                <Marker
                  key={`${index}-${point[0]}-${point[1]}`}
                  position={point}
                  draggable
                  eventHandlers={{
                    dragend(event) {
                      const marker =
                        event.target;

                      const position =
                        marker.getLatLng();

                      movePoint(
                        index,
                        position.lat,
                        position.lng
                      );
                    },
                  }}
                >
                  <Tooltip>
                    النقطة {index + 1}
                  </Tooltip>
                </Marker>
              )
            )}

            <GPSLocationVisual
              position={gpsPosition}
            />

            <GPSController
              active={false}
              onLocation={() => {}}
              onError={() => {}}
            />
          </MapContainer>
        </div>

        <div className="map-editor-footer">
          <div>
            {points.length < 3 ? (
              <span className="map-warning">
                يجب تحديد 3 نقاط على الأقل لحفظ
                حدود الأرض.
              </span>
            ) : (
              <span className="map-success">
                ✓ تم تحديد حدود صالحة للحفظ.
              </span>
            )}
          </div>

          <div className="map-editor-actions">
            <Button
              type="button"
              onClick={onCancel}
            >
              إلغاء
            </Button>

            <Button
              type="button"
              onClick={onSave}
              disabled={points.length < 3}
            >
              💾 حفظ الموقع
            </Button>
          </div>
        </div>
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
    loading,
    addLocation,
    deleteLocation,
    reverseGeocode,
  } = useMapHook();

  // ---------------------------------------------------------
  // URL CONTEXT
  // ---------------------------------------------------------

  const params = useMemo(
    () => new URLSearchParams(
      window.location.search
    ),
    []
  );

  const urlFarmId =
    params.get("farmId") || "";

  const urlReturn =
    params.get("return") || "";

  const urlFarmName =
    params.get("farmName") || "";

  const getReturnPath = () => {
    const value =
      cleanString(urlReturn)
        .toLowerCase();

    if (
      value === "crop" ||
      value === "crops"
    ) {
      return "crops";
    }

    if (
      value === "new-farm" ||
      value === "newfarm"
    ) {
      return "new-farm";
    }

    if (
      value === "weather" ||
      value === "weather-page"
    ) {
      return "weather";
    }

    if (
      value === "irrigation" ||
      value === "irrigation-page"
    ) {
      return "irrigation";
    }

    return "";
  };

  const returnPath =
    getReturnPath();

  const isNewFarmFlow =
    returnPath === "new-farm";

  // ---------------------------------------------------------
  // LOCAL STATE
  // ---------------------------------------------------------

  const [locationType, setLocationType] =
    useState("field");

  const [notes, setNotes] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [province, setProvince] =
    useState("");

  const [city, setCity] =
    useState("");

  const [town, setTown] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [neighbors, setNeighbors] =
    useState("");

  const [locationMethod, setLocationMethod] =
    useState("map");

  const [points, setPoints] =
    useState([]);

  const [mapOpen, setMapOpen] =
    useState(false);

  const [gpsPosition, setGpsPosition] =
    useState(null);

  const [gpsLoading, setGpsLoading] =
    useState(false);

  const [gpsError, setGpsError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [currentCenter, setCurrentCenter] =
    useState(DEFAULT_POSITION);

  // ---------------------------------------------------------
  // FARM
  // ---------------------------------------------------------

  const selectedFarm = useMemo(() => {
    const id =
      farmId ||
      urlFarmId;

    if (!id) {
      return null;
    }

    return farms.find(farm => {
      const candidate =
        farm?.id ??
        farm?._id ??
        farm?.farmId;

      return (
        String(candidate) ===
        String(id)
      );
    }) || null;
  }, [
    farms,
    farmId,
    urlFarmId,
  ]);

  const currentFarmId =
    farmId ||
    urlFarmId ||
    "";

  const currentFarmName =
    selectedFarm?.name ??
    selectedFarm?.farmName ??
    selectedFarm?.title ??
    urlFarmName ??
    (
      isNewFarmFlow
        ? "المزرعة الجديدة"
        : ""
    );

  const hasValidFarm =
    Boolean(currentFarmId);

  // ---------------------------------------------------------
  // SELECT FARM FROM NORMAL MAP PAGE
  // ---------------------------------------------------------

  const handleFarmChange = event => {
    const value =
      event.target.value;

    setFarmId?.(value);

    setError("");
    setMessage("");

    if (!value) {
      return;
    }

    const farm =
      farms.find(item => {
        const id =
          item?.id ??
          item?._id ??
          item?.farmId;

        return (
          String(id) ===
          String(value)
        );
      });

    if (farm) {
      const location =
        locations.find(item => {
          const id =
            item?.farmId ??
            item?.farm_id;

          return (
            String(id) ===
            String(value)
          );
        });

      if (location) {
        const center =
          getMapLocationCenter(
            location
          );

        if (center) {
          setCurrentCenter(center);
        }

        const savedPoints =
          normalizePoints(
            location.points ??
            location.boundary
          );

        if (savedPoints.length) {
          setPoints(savedPoints);
        }

        setCountry(
          location.country ??
          ""
        );

        setProvince(
          location.province ??
          location.region ??
          ""

        );

        setCity(
          location.city ??
          ""
        );

        setTown(
          location.town ??
          location.village ??
          location.placeName ??
          ""
        );

        setDescription(
          location.description ??
          ""
        );

        setNeighbors(
          location.neighbors ??
          ""
        );

        setNotes(
          location.notes ??
          ""
        );
      }
    }
  };

  // ---------------------------------------------------------
  // GPS
  // ---------------------------------------------------------

  const requestGPS = () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setGpsError(
        "GPS غير متوفر على هذا الجهاز."
      );

      return;
    }

    setGpsLoading(true);
    setGpsError("");

    let attempts = 0;
    let best = null;

    const tryGetPosition = () => {
      attempts += 1;

      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude =
            position?.coords?.latitude;

          const longitude =
            position?.coords?.longitude;

          const accuracy =
            position?.coords?.accuracy;

          if (
            !isValidCoordinate(
              latitude,
              longitude
            )
          ) {
            if (
              attempts <
              GPS_MAX_ATTEMPTS
            ) {
              setTimeout(
                tryGetPosition,
                GPS_RETRY_WAIT
              );
            } else {
              setGpsLoading(false);

              setGpsError(
                "تعذر الحصول على موقع صالح."
              );
            }

            return;
          }

          const result = {
            latitude: Number(latitude),
            longitude: Number(longitude),
            accuracy:
              Number.isFinite(
                Number(accuracy)
              )
                ? Number(accuracy)
                : null,
          };

          if (
            !best ||
            (
              result.accuracy != null &&
              (
                best.accuracy == null ||
                result.accuracy <
                  best.accuracy
              )
            )
          ) {
            best = result;
          }

          if (
            result.accuracy != null &&
            result.accuracy <=
              GPS_GOOD_ACCURACY
          ) {
            setGpsPosition(result);

            setCurrentCenter([
              result.latitude,
              result.longitude,
            ]);

            setGpsLoading(false);

            return;
          }

          if (
            attempts <
            GPS_MAX_ATTEMPTS
          ) {
            setTimeout(
              tryGetPosition,
              GPS_RETRY_WAIT
            );

            return;
          }

          if (best) {
            setGpsPosition(best);

            setCurrentCenter([
              best.latitude,
              best.longitude,
            ]);

            if (
              best.accuracy >
              GPS_ACCEPTABLE_ACCURACY
            ) {
              setGpsError(
                "تم تحديد الموقع، لكن دقة GPS منخفضة نسبيًا. استخدمه كمرجع ثم حرّك الخريطة يدويًا."
              );
            }
          }

          setGpsLoading(false);
        },

        error => {
          if (
            attempts <
            GPS_MAX_ATTEMPTS
          ) {
            setTimeout(
              tryGetPosition,
              GPS_RETRY_WAIT
            );

            return;
          }

          setGpsLoading(false);

          if (error?.code === 1) {
            setGpsError(
              "يرجى السماح للتطبيق باستخدام الموقع."
            );
          } else if (
            error?.code === 2
          ) {
            setGpsError(
              "تعذر تحديد موقع الهاتف."
            );
          } else if (
            error?.code === 3
          ) {
            setGpsError(
              "انتهت مهلة تحديد الموقع."
            );
          } else {
            setGpsError(
              "تعذر تحديد موقع الهاتف."
            );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    };

    tryGetPosition();
  };

  // ---------------------------------------------------------
  // OPEN MAP
  // ---------------------------------------------------------

  const openMap = () => {
    setError("");
    setMessage("");

    if (!hasValidFarm) {
      setError(
        "يجب تحديد المزرعة أولًا."
      );

      return;
    }

    setMapOpen(true);
  };

  // ---------------------------------------------------------
  // REVERSE GEOCODING
  // ---------------------------------------------------------

  const fillAdministrativeData =
    async selectedPoints => {
      const normalized =
        normalizePoints(
          selectedPoints
        );

      if (!normalized.length) {
        return null;
      }

      const center =
        getCenterFromPoints(
          normalized
        );

      setCurrentCenter(center);

      if (
        typeof reverseGeocode !==
        "function"
      ) {
        return null;
      }

      try {
        const result =
          await reverseGeocode(
            center[0],
            center[1]
          );

        if (!result) {
          return null;
        }

        const data =
          result?.address ??
          result;

        const nextCountry =
          cleanString(
            data.country ??
            result.country
          );

        const nextProvince =
          cleanString(
            data.province ??
            data.state ??
            data.region ??
            result.province ??
            result.region
          );

        const nextCity =
          cleanString(
            data.city ??
            data.city_district ??
            data.municipality ??
            result.city
          );

        const nextTown =
          cleanString(
            data.village ??
            data.town ??
            data.suburb ??
            data.hamlet ??
            data.place ??
            result.village ??
            result.town
          );

        if (nextCountry) {
          setCountry(nextCountry);
        }

        if (nextProvince) {
          setProvince(
            nextProvince
          );
        }

        if (nextCity) {
          setCity(nextCity);
        }

        if (nextTown) {
          setTown(nextTown);
        }

        return result;
      } catch {
        return null;
      }
    };

  // ---------------------------------------------------------
  // BUILD CANONICAL LOCATION DATA
  // ---------------------------------------------------------

  const buildLocationData = async ({
    selectedPoints = [],
    source = "manual",
  } = {}) => {
    const normalized =
      normalizePoints(
        selectedPoints
      );

    const hasBoundary =
      normalized.length >= 3;

    let center =
      normalized.length
        ? getCenterFromPoints(
            normalized
          )
        : currentCenter;

    let reverseData = null;

    if (hasBoundary) {
      try {
        reverseData =
          await reverseGeocode?.(
            center[0],
            center[1]
          );
      } catch {
        reverseData = null;
      }
    }

    const reverseAddress =
      reverseData?.address ??
      reverseData ??
      {};

    const finalCountry =
      cleanString(
        country ||
        reverseAddress.country
      );

    const finalProvince =
      cleanString(
        province ||
        reverseAddress.province ||
        reverseAddress.state ||
        reverseAddress.region
      );

    const finalCity =
      cleanString(
        city ||
        reverseAddress.city ||
        reverseAddress.municipality ||
        reverseAddress.city_district
      );

    const finalTown =
      cleanString(
        town ||
        reverseAddress.village ||
        reverseAddress.town ||
        reverseAddress.suburb ||
        reverseAddress.hamlet ||
        reverseAddress.place
      );

    let area = null;
    let perimeter = null;

    if (hasBoundary) {
      try {
        area = Number(
          calculateArea(
            normalized
          ) || 0
        );
      } catch {
        area = 0;
      }

      try {
        perimeter = Number(
          calculatePerimeter(
            normalized
          ) || 0
        );
      } catch {
        perimeter = 0;
      }
    }

    const firstPoint =
      normalized[0] ?? null;

    return {
      farmId: currentFarmId,

      farmName:
        currentFarmName ||
        urlFarmName ||
        "المزرعة الجديدة",

      type: locationType,

      source,

      country:
        finalCountry,

      region:
        finalProvince,

      province:
        finalProvince,

      city:
        finalCity,

      town:
        finalTown,

      village:
        finalTown,

      placeName:
        finalTown,

      description:
        cleanString(description),

      neighbors:
        cleanString(neighbors),

      latitude:
        hasBoundary && firstPoint
          ? firstPoint[0]
          : null,

      longitude:
        hasBoundary && firstPoint
          ? firstPoint[1]
          : null,

      points:
        hasBoundary
          ? normalized.map(point => ({
              latitude: point[0],
              longitude: point[1],
            }))
          : [],

      boundary:
        hasBoundary
          ? normalized.map(point => ({
              latitude: point[0],
              longitude: point[1],
            }))
          : [],

      area:
        hasBoundary
          ? area
          : null,

      perimeter:
        hasBoundary
          ? perimeter
          : null,

      notes:
        cleanString(notes),

      status: "active",
    };
  };

  // ---------------------------------------------------------
  // RETURN TO SOURCE
  // ---------------------------------------------------------

  const returnToSource = () => {
    if (!returnPath) {
      return;
    }

    window.history.back();
  };

  // ---------------------------------------------------------
  // SAVE LOCATION
  // ---------------------------------------------------------

  const persistLocation = async ({
    selectedPoints = [],
    source = "manual",
    returnAfterSave = false,
  } = {}) => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const normalized =
        normalizePoints(
          selectedPoints
        );

      if (
        source === "map" &&
        normalized.length < 3
      ) {
        throw new Error(
          "يجب تحديد 3 نقاط على الأقل لحفظ حدود الأرض."
        );
      }

      if (!hasValidFarm) {
        throw new Error(
          "لا توجد مزرعة مرتبطة بهذا الموقع."
        );
      }

      const locationData =
        await buildLocationData({
          selectedPoints:
            normalized,
          source,
        });

      const saved =
        await addLocation(
          locationData
        );

      if (!saved) {
        throw new Error(
          "تعذر حفظ الموقع."
        );
      }

      const savedCenter =
        getMapLocationCenter(
          saved
        );

      if (savedCenter) {
        setCurrentCenter(
          savedCenter
        );
      }

      if (
        returnAfterSave &&
        returnPath
      ) {
        window.history.back();
        return saved;
      }

      setMessage(
        "تم حفظ موقع الأرض بنجاح."
      );

      return saved;
    } catch (err) {
      setError(
        err?.message ||
        "حدث خطأ أثناء حفظ الموقع."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // SAVE FROM MAP EDITOR
  // ---------------------------------------------------------

  const saveMap = async () => {
    if (points.length < 3) {
      setError(
        "يجب تحديد 3 نقاط على الأقل."
      );

      return;
    }

    try {
      if (returnPath) {
        await persistLocation({
          selectedPoints: points,
          source: "map",
          returnAfterSave: true,
        });

        return;
      }

      await fillAdministrativeData(
        points
      );

      setMapOpen(false);

      setMessage(
        "تم تحديد الموقع. اضغط «حفظ الموقع» لتثبيته."
      );
    } catch {
      // error already displayed
    }
  };

  // ---------------------------------------------------------
  // MAIN SAVE
  // ---------------------------------------------------------

  const handleSave = async event => {
    event?.preventDefault();

    setError("");
    setMessage("");

    if (!hasValidFarm) {
      setError(
        "يجب تحديد المزرعة أولًا."
      );

      return;
    }

    if (
      locationMethod === "map"
    ) {
      if (points.length < 3) {
        setError(
          "يجب تحديد 3 نقاط على الأقل من الخريطة."
        );

        return;
      }

      try {
        await persistLocation({
          selectedPoints: points,
          source: "map",
          returnAfterSave:
            Boolean(returnPath),
        });
      } catch {
        // error already displayed
      }

      return;
    }

    const hasTextLocation =
      Boolean(
        cleanString(country) ||
        cleanString(province) ||
        cleanString(city) ||
        cleanString(town) ||
        cleanString(description)
      );

    if (!hasTextLocation) {
      setError(
        "أدخل معلومات الموقع أو استخدم الخريطة."
      );

      return;
    }

    try {
      await persistLocation({
        selectedPoints: [],
        source: "manual",
        returnAfterSave:
          Boolean(returnPath),
      });
    } catch {
      // error already displayed
    }
  };

  // ---------------------------------------------------------
  // DELETE LOCATION
  // ---------------------------------------------------------

  const handleDelete = async location => {
    const id =
      location?.id ??
      location?._id ??
      location?.locationId;

    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        "هل تريد حذف هذا الموقع؟"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLocation(id);

      setMessage(
        "تم حذف الموقع."
      );
    } catch (err) {
      setError(
        err?.message ||
        "تعذر حذف الموقع."
      );
    }
  };

  // ---------------------------------------------------------
  // LOAD URL FARM ID
  // ---------------------------------------------------------

  useEffect(() => {
    if (!urlFarmId) {
      return;
    }

    setFarmId?.(urlFarmId);
  }, [
    urlFarmId,
    setFarmId,
  ]);

  // ---------------------------------------------------------
  // LOAD SAVED LOCATION FOR SELECTED FARM
  // ---------------------------------------------------------

  useEffect(() => {
    if (!currentFarmId) {
      return;
    }

    const saved =
      locations.find(location => {
        const id =
          location?.farmId ??
          location?.farm_id;

        return (
          String(id) ===
          String(currentFarmId)
        );
      });

    if (!saved) {
      return;
    }

    const savedPoints =
      normalizePoints(
        saved.points ??
        saved.boundary
      );

    if (savedPoints.length) {
      setPoints(savedPoints);

      setCurrentCenter(
        getCenterFromPoints(
          savedPoints
        )
      );
    } else {
      const savedCenter =
        getMapLocationCenter(
          saved
        );

      if (savedCenter) {
        setCurrentCenter(
          savedCenter
        );
      }
    }

    setCountry(
      saved.country ??
      ""
    );

    setProvince(
      saved.province ??
      saved.region ??
      ""
    );

    setCity(
      saved.city ??
      ""
    );

    setTown(
      saved.town ??
      saved.village ??
      saved.placeName ??
      ""
    );

    setDescription(
      saved.description ??
      ""
    );

    setNeighbors(
      saved.neighbors ??
      ""
    );

    setNotes(
      saved.notes ??
      ""
    );
  }, [
    currentFarmId,
    locations,
  ]);

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="map-page">
      <Card>
        <div className="map-page-header">
          <div>
            <h1>
              🗺️ تحديد موقع الأرض
            </h1>

            <p>
              حفظ موقع المزرعة وربطه بها
              لاستخدامه تلقائيًا في باقي
              أقسام التطبيق.
            </p>
          </div>
        </div>

        {isNewFarmFlow ? (
          <div className="map-new-farm-box">
            <strong>
              🌾 المزرعة الجديدة
            </strong>

            <span>
              {currentFarmName ||
                "مزرعة جديدة"}
            </span>
          </div>
        ) : (
          <div className="map-farm-section">
            <label>
              🏡 المزرعة
            </label>

            <select
              value={currentFarmId}
              onChange={handleFarmChange}
              disabled={loading}
            >
              <option value="">
                اختر المزرعة
              </option>

              {farms.map(farm => {
                const id =
                  farm?.id ??
                  farm?._id ??
                  farm?.farmId;

                const name =
                  farm?.name ??
                  farm?.farmName ??
                  farm?.title ??
                  "مزرعة";

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {!hasValidFarm ? (
          <div className="map-warning">
            اختر المزرعة أولًا حتى يتم ربط
            الموقع بها.
          </div>
        ) : null}

        {error ? (
          <div className="map-error">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="map-success">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleSave}
          className="map-main-form"
        >
          <div className="map-method-section">
            <h2>
              📍 طريقة تحديد الموقع
            </h2>

            <div className="map-method-buttons">
              <Button
                type="button"
                onClick={() =>
                  setLocationMethod("map")
                }
              >
                🗺️ تحديد على الخريطة
              </Button>

              <Button
                type="button"
                onClick={() =>
                  setLocationMethod("text")
                }
              >
                ✍️ كتابة الموقع
              </Button>
            </div>
          </div>

          {locationMethod === "map" ? (
            <div className="map-selection-section">
              <div className="map-gps-help">
                <strong>
                  📍 GPS مرجع فقط
                </strong>

                <p>
                  عند الضغط على «تحديد موقعي
                  الآن» سيظهر موقع الهاتف على
                  الخريطة ويتمركز عليها فقط.
                  لن تتم إضافة نقطة تلقائيًا.
                  بعد ذلك يمكنك تحريك الخريطة
                  يدويًا والنقر على حدود الأرض.
                </p>
              </div>

              <div className="map-selection-actions">
                <GPSButton
                  onClick={requestGPS}
                  loading={gpsLoading}
                />

                <Button
                  type="button"
                  onClick={openMap}
                  disabled={!hasValidFarm}
                >
                  🗺️ فتح الخريطة وتحديد الحدود
                </Button>
              </div>

              {gpsError ? (
                <div className="map-error">
                  {gpsError}
                </div>
              ) : null}

              <div className="map-points-summary">
                📌 عدد نقاط الحدود:{" "}
                <strong>
                  {points.length}
                </strong>
              </div>
            </div>
          ) : null}

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
            neighbors={neighbors}
            setNeighbors={setNeighbors}
            notes={notes}
            setNotes={setNotes}
          />

          <div className="map-save-section">
            <Button
              type="submit"
              disabled={
                saving ||
                loading ||
                !hasValidFarm
              }
            >
              {saving
                ? "⏳ جارٍ الحفظ..."
                : "💾 حفظ الموقع"}
            </Button>
          </div>
        </form>

        {!isNewFarmFlow &&
        Array.isArray(locations) &&
        locations.length > 0 ? (
          <div className="map-saved-locations">
            <h2>
              📌 المواقع المحفوظة
            </h2>

            {locations.map(
              location => {
                const id =
                  location?.id ??
                  location?._id ??
                  location?.locationId;

                const locationFarmId =
                  location?.farmId ??
                  location?.farm_id;

                const farm =
                  farms.find(item => {
                    const farmId =
                      item?.id ??
                      item?._id ??
                      item?.farmId;

                    return (
                      String(farmId) ===
                      String(locationFarmId)
                    );
                  });

                const name =
                  farm?.name ??
                  farm?.farmName ??
                  location?.farmName ??
                  "مزرعة";

                const place =
                  location?.village ??
                  location?.town ??
                  location?.city ??
                  location?.province ??
                  "";

                return (
                  <div
                    key={id}
                    className="map-saved-location"
                  >
                    <div>
                      <strong>
                        🏡 {name}
                      </strong>

                      {place ? (
                        <span>
                          {" "}
                          — {place}
                        </span>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          location
                        )
                      }
                    >
                      🗑️ حذف
                    </Button>
                  </div>
                );
              }
            )}
          </div>
        ) : null}
      </Card>

      {mapOpen ? (
        <FieldMapEditor
          points={points}
          setPoints={setPoints}
          gpsPosition={gpsPosition}
          setGpsPosition={setGpsPosition}
          gpsLoading={gpsLoading}
          requestGPS={requestGPS}
          gpsError={gpsError}
          setGpsError={setGpsError}
          onSave={saveMap}
          onCancel={() =>
            setMapOpen(false)
          }
        />
      ) : null}
    </div>
  );
}
