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

const DEFAULT_POSITION = [
  36.7,
  38.7,
];

const DEFAULT_ZOOM = 14;
const GPS_ZOOM = 18;

const GPS_MAX_ATTEMPTS = 4;
const GPS_RETRY_WAIT = 1800;

const GPS_GOOD_ACCURACY = 50;


// =========================================================
// HELPERS
// =========================================================

function cleanString(value) {
  return String(value ?? "").trim();
}


function isValidCoordinate(
  lat,
  lng
) {
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
  if (!point) {
    return null;
  }

  if (
    Array.isArray(point) &&
    point.length >= 2
  ) {
    const latitude = Number(point[0]);
    const longitude = Number(point[1]);

    if (
      !isValidCoordinate(
        latitude,
        longitude
      )
    ) {
      return null;
    }

    return [
      latitude,
      longitude,
    ];
  }

  const latitude =
    point?.latitude ??
    point?.lat ??
    point?.y;

  const longitude =
    point?.longitude ??
    point?.lng ??
    point?.lon ??
    point?.x;

  if (
    !isValidCoordinate(
      latitude,
      longitude
    )
  ) {
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
  const normalized =
    normalizePoints(points);

  if (!normalized.length) {
    return DEFAULT_POSITION;
  }

  try {
    if (
      typeof calculateCenter ===
      "function"
    ) {
      const center =
        calculateCenter(
          normalized
        );

      const normalizedCenter =
        normalizePoint(center);

      if (normalizedCenter) {
        return normalizedCenter;
      }
    }
  } catch {
    // fallback
  }

  const latitude =
    normalized.reduce(
      (sum, point) =>
        sum + point[0],
      0
    ) / normalized.length;

  const longitude =
    normalized.reduce(
      (sum, point) =>
        sum + point[1],
      0
    ) / normalized.length;

  return [
    latitude,
    longitude,
  ];
}


function getMapLocationCenter(location) {
  if (!location) {
    return null;
  }

  const direct =
    normalizePoint(location);

  if (direct) {
    return direct;
  }

  const center =
    normalizePoint({
      latitude:
        location?.latitude ??
        location?.center?.latitude ??
        location?.center?.lat ??
        location?.lat,

      longitude:
        location?.longitude ??
        location?.center?.longitude ??
        location?.center?.lng ??
        location?.lng,
    });

  if (center) {
    return center;
  }

  const points =
    location?.points ??
    location?.boundary ??
    location?.coordinates ??
    [];

  const normalized =
    normalizePoints(points);

  if (normalized.length) {
    return getCenterFromPoints(
      normalized
    );
  }

  return null;
}


function getLocationFarmId(location) {
  return (
    location?.farmId ??
    location?.farm_id ??
    location?.farmID ??
    location?.farm?.id ??
    location?.farm?._id ??
    location?.farm?.farmId ??
    ""
  );
}


// =========================================================
// ADMINISTRATIVE
// =========================================================

function getAdministrativeSource(result) {
  if (
    !result ||
    typeof result !== "object"
  ) {
    return {};
  }

  return {
    ...result,
    ...(result.address || {}),
    ...(result.administrative || {}),
    ...(result.location || {}),
    ...(result.reverseGeocode || {}),
    ...(result.geocoding || {}),
    ...(result.geo || {}),
  };
}


function normalizeAdministrativeData(result) {
  const data =
    getAdministrativeSource(result);

  const country =
    cleanString(
      data.country ??
      data.countryName ??
      data.country_name ??
      ""
    );

  const governorate =
    cleanString(
      data.governorate ??
      data.governorateName ??
      data.province ??
      data.provinceName ??
      data.state ??
      data.stateName ??
      data.state_district ??
      data.region ??
      data.regionName ??
      data.county ??
      data.district ??
      ""
    );

  const city =
    cleanString(
      data.city ??
      data.cityName ??
      data.municipality ??
      data.municipalityName ??
      data.city_district ??
      data.locality ??
      data.county ??
      data.district ??
      ""
    );

  const village =
    cleanString(
      data.village ??
      data.villageName ??
      data.town ??
      data.townName ??
      data.suburb ??
      data.hamlet ??
      data.locality ??
      data.place ??
      data.placeName ??
      data.neighbourhood ??
      data.neighborhood ??
      ""
    );

  return {
    country,
    governorate,
    city,
    village,
  };
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
    const timer =
      setTimeout(() => {
        map.invalidateSize();
      }, 200);

    return () =>
      clearTimeout(timer);
  }, [map]);

  return null;
}


// =========================================================
// MAP CENTER
// =========================================================

function MapCenterController({
  center,
  zoom,
}) {
  const map = useMap();

  const lastCenterRef =
    useRef(null);

  useEffect(() => {
    if (
      !center ||
      !Array.isArray(center)
    ) {
      return;
    }

    const latitude =
      Number(center[0]);

    const longitude =
      Number(center[1]);

    if (
      !isValidCoordinate(
        latitude,
        longitude
      )
    ) {
      return;
    }

    const key =
      `${latitude.toFixed(7)}:${longitude.toFixed(7)}:${zoom}`;

    if (
      lastCenterRef.current === key
    ) {
      return;
    }

    lastCenterRef.current = key;

    map.setView(
      [
        latitude,
        longitude,
      ],
      zoom ??
        map.getZoom(),
      {
        animate: true,
      }
    );
  }, [
    center,
    zoom,
    map,
  ]);

  return null;
}


// =========================================================
// BOUNDARY CLICK
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
        <Tooltip
          permanent
          direction="top"
        >
          📍 موقع الهاتف الحالي
        </Tooltip>
      </CircleMarker>
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
        ? "⏳ جارٍ تحديد موقع الهاتف..."
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
    points.length > 0 ||
    gpsPosition
      ? GPS_ZOOM
      : DEFAULT_ZOOM;

  const area =
    useMemo(() => {
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

  const perimeter =
    useMemo(() => {
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
    if (
      !isValidCoordinate(
        latitude,
        longitude
      )
    ) {
      return;
    }

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
              اضغط «تحديد موقعي الآن» ليتم
              تحديد مكان هاتفك على الخريطة.
              موقع الهاتف مرجع فقط ولا يضيف
              نقطة حدود تلقائيًا.
              بعد ذلك حرّك الخريطة يدويًا
              واضغط على حدود الأرض لإضافة
              النقاط.
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

          </MapContainer>

        </div>


        <div className="map-editor-footer">

          <div>
            {points.length < 3 ? (
              <span className="map-warning">
                يجب تحديد 3 نقاط على الأقل
                لحفظ حدود الأرض.
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


  // =======================================================
  // URL
  // =======================================================

  const params =
    useMemo(
      () =>
        new URLSearchParams(
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

  const returnPath =
    cleanString(urlReturn).toLowerCase();

  const isNewFarmFlow =
    returnPath === "new-farm" ||
    returnPath === "newfarm";


  // =======================================================
  // STATE
  // =======================================================

  const [
    locationType,
    setLocationType,
  ] = useState("field");

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

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    neighbors,
    setNeighbors,
  ] = useState("");

  const [
    locationMethod,
    setLocationMethod,
  ] = useState("map");

  const [points, setPoints] =
    useState([]);

  const [mapOpen, setMapOpen] =
    useState(false);

  const [
    gpsPosition,
    setGpsPosition,
  ] = useState(null);

  const [
    gpsLoading,
    setGpsLoading,
  ] = useState(false);

  const [gpsError, setGpsError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    currentCenter,
    setCurrentCenter,
  ] = useState(
    DEFAULT_POSITION
  );


  // =======================================================
  // FARM
  // =======================================================

  const selectedFarm =
    useMemo(() => {
      const id =
        farmId ||
        urlFarmId;

      if (!id) {
        return null;
      }

      return (
        farms.find(farm => {
          const candidate =
            farm?.id ??
            farm?._id ??
            farm?.farmId ??
            farm?.farm_id;

          return (
            String(candidate) ===
            String(id)
          );
        }) || null
      );
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


  // =======================================================
  // FARM CHANGE
  // =======================================================

  const handleFarmChange =
    event => {
      const value =
        event.target.value;

      setFarmId?.(value);

      setError("");
      setMessage("");

      if (!value) {
        return;
      }

      const location =
        locations.find(
          item =>
            String(
              getLocationFarmId(item)
            ) ===
            String(value)
        );

      if (!location) {
        setPoints([]);
        setCountry("");
        setProvince("");
        setCity("");
        setTown("");
        setDescription("");
        setNeighbors("");
        setNotes("");
        return;
      }

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
          location.boundary ??
          location.coordinates
        );

      setPoints(savedPoints);

      const admin =
        normalizeAdministrativeData(
          location
        );

      setCountry(admin.country);
      setProvince(
        admin.governorate
      );
      setCity(admin.city);
      setTown(admin.village);

      setDescription(
        location.description ??
        location.locationDescription ??
        ""
      );

      setNeighbors(
        location.neighbors ?? ""
      );

      setNotes(
        location.notes ?? ""
      );
    };


  // =======================================================
  // GPS
  // =======================================================

  const requestGPS = () => {
    if (
      typeof navigator ===
        "undefined" ||
      !navigator.geolocation
    ) {
      setGpsError(
        "GPS غير متوفر على هذا الجهاز أو المتصفح."
      );

      return;
    }

    setGpsLoading(true);
    setGpsError("");

    let attempts = 0;
    let best = null;
    let finished = false;

    const timers = [];

    const cleanupTimers = () => {
      timers.forEach(timer =>
        clearTimeout(timer)
      );
    };


    const finish = position => {
      if (finished) {
        return;
      }

      finished = true;
      cleanupTimers();

      if (position) {
        setGpsPosition(position);

        /*
         * GPS يحرك الخريطة فقط.
         * لا تتم إضافة نقطة.
         */
        setCurrentCenter([
          position.latitude,
          position.longitude,
        ]);
      }

      setGpsLoading(false);
    };


    const fail = text => {
      if (finished) {
        return;
      }

      finished = true;
      cleanupTimers();

      setGpsLoading(false);
      setGpsError(text);
    };


    const tryGetPosition = () => {
      if (finished) {
        return;
      }

      attempts += 1;

      navigator.geolocation.getCurrentPosition(
        position => {
          if (finished) {
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
              attempts <
              GPS_MAX_ATTEMPTS
            ) {
              timers.push(
                setTimeout(
                  tryGetPosition,
                  GPS_RETRY_WAIT
                )
              );
            } else {
              fail(
                "تعذر الحصول على إحداثيات صالحة من GPS."
              );
            }

            return;
          }

          const result = {
            latitude:
              Number(latitude),

            longitude:
              Number(longitude),

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

          /*
           * إذا كانت الدقة جيدة،
           * نستخدمها فورًا.
           */
          if (
            result.accuracy != null &&
            result.accuracy <=
              GPS_GOOD_ACCURACY
          ) {
            finish(result);
            return;
          }

          /*
           * نحاول الحصول على قراءة
           * أفضل إذا كانت الدقة ضعيفة.
           */
          if (
            attempts <
            GPS_MAX_ATTEMPTS
          ) {
            timers.push(
              setTimeout(
                tryGetPosition,
                GPS_RETRY_WAIT
              )
            );

            return;
          }

          /*
           * بعد انتهاء المحاولات نستخدم
           * أفضل قراءة حصلنا عليها.
           */
          if (best) {
            finish(best);

            if (
              best.accuracy != null &&
              best.accuracy > 100
            ) {
              setGpsError(
                "تم تحديد موقع الهاتف، لكن الدقة منخفضة نسبيًا. استخدم الموقع كمرجع ثم حرّك الخريطة يدويًا."
              );
            }
          } else {
            fail(
              "تعذر تحديد موقع الهاتف."
            );
          }
        },

        geoError => {
          if (finished) {
            return;
          }

          /*
           * لا نعتبر أول Timeout أو
           * PositionUnavailable فشلًا نهائيًا.
           */
          if (
            attempts <
            GPS_MAX_ATTEMPTS
          ) {
            timers.push(
              setTimeout(
                tryGetPosition,
                GPS_RETRY_WAIT
              )
            );

            return;
          }

          if (
            geoError?.code === 1
          ) {
            fail(
              "تم رفض إذن الموقع. اسمح للمتصفح باستخدام موقع الهاتف ثم اضغط «تحديد موقعي الآن» مرة أخرى."
            );
          } else if (
            geoError?.code === 2
          ) {
            fail(
              "تعذر تحديد موقع الهاتف حاليًا. تأكد من تشغيل الموقع GPS."
            );
          } else if (
            geoError?.code === 3
          ) {
            fail(
              "انتهت مهلة تحديد موقع الهاتف. حاول مرة أخرى في مكان مفتوح."
            );
          } else {
            fail(
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


  // =======================================================
  // OPEN MAP
  // =======================================================

  const openMap = () => {
    setError("");
    setMessage("");
    setGpsError("");

    if (!hasValidFarm) {
      setError(
        "يجب تحديد المزرعة أولًا."
      );

      return;
    }

    setMapOpen(true);

    /*
     * عند فتح الخريطة يتم طلب GPS.
     * GPS لا يضيف نقطة حدود.
     */
    requestGPS();
  };


  // =======================================================
  // REVERSE GEOCODING
  // =======================================================

  const getAdministrativeData =
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

        const admin =
          normalizeAdministrativeData(
            result
          );

        if (admin.country) {
          setCountry(
            admin.country
          );
        }

        if (admin.governorate) {
          setProvince(
            admin.governorate
          );
        }

        if (admin.city) {
          setCity(
            admin.city
          );
        }

        if (admin.village) {
          setTown(
            admin.village
          );
        }

        return {
          result,
          admin,
        };
      } catch {
        return null;
      }
    };


  // =======================================================
  // BUILD LOCATION
  // =======================================================

  const buildLocationData =
    async ({
      selectedPoints = [],
      source = "map",
      administrativeData = null,
    } = {}) => {
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

      /*
       * الحدود اليدوية هي المصدر الحقيقي
       * لمركز الأرض.
       */
      const center =
        normalized.length
          ? getCenterFromPoints(
              normalized
            )
          : currentCenter;

      if (
        !center ||
        !isValidCoordinate(
          center[0],
          center[1]
        )
      ) {
        throw new Error(
          "تعذر تحديد مركز الموقع."
        );
      }

      let reverseResult =
        administrativeData?.result ??
        null;

      let reverseAdmin =
        administrativeData?.admin ??
        null;

      /*
       * إذا لم نحصل على reverse geocoding
       * قبل هذه المرحلة، نطلبه مباشرة.
       */
      if (
        !reverseResult &&
        typeof reverseGeocode ===
          "function"
      ) {
        try {
          reverseResult =
            await reverseGeocode(
              center[0],
              center[1]
            );
        } catch {
          reverseResult = null;
        }
      }

      if (!reverseAdmin) {
        reverseAdmin =
          normalizeAdministrativeData(
            reverseResult
          );
      }

      /*
       * أولوية البيانات:
       * 1. ما كتبه المستخدم.
       * 2. reverse geocoding.
       */
      const finalCountry =
        cleanString(
          country ||
          reverseAdmin.country
        );

      const finalProvince =
        cleanString(
          province ||
          reverseAdmin.governorate
        );

      const finalCity =
        cleanString(
          city ||
          reverseAdmin.city
        );

      const finalTown =
        cleanString(
          town ||
          reverseAdmin.village
        );

      let area = null;
      let perimeter = null;

      if (normalized.length >= 3) {
        try {
          area =
            Number(
              calculateArea(
                normalized
              ) || 0
            );
        } catch {
          area = 0;
        }

        try {
          perimeter =
            Number(
              calculatePerimeter(
                normalized
              ) || 0
            );
        } catch {
          perimeter = 0;
        }
      }

      const canonicalPoints =
        normalized.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));

      return {
        farmId:
          String(currentFarmId),

        farmName:
          currentFarmName ||
          urlFarmName ||
          "المزرعة الجديدة",

        type:
          locationType,

        locationType:
          locationType,

        source,

        /*
         * المركز الحقيقي الناتج من الحدود.
         */
        latitude:
          center[0],

        longitude:
          center[1],

        /*
         * الحدود الحقيقية.
         */
        points:
          canonicalPoints,

        boundary:
          canonicalPoints,

        coordinates:
          canonicalPoints,

        area:
          normalized.length >= 3
            ? area
            : null,

        perimeter:
          normalized.length >= 3
            ? perimeter
            : null,

        /*
         * البيانات الإدارية.
         */
        country:
          finalCountry,

        countryName:
          finalCountry,

        governorate:
          finalProvince,

        governorateName:
          finalProvince,

        province:
          finalProvince,

        provinceName:
          finalProvince,

        region:
          finalProvince,

        regionName:
          finalProvince,

        city:
          finalCity,

        cityName:
          finalCity,

        municipality:
          finalCity,

        village:
          finalTown,

        villageName:
          finalTown,

        town:
          finalTown,

        place:
          finalTown,

        placeName:
          finalTown,

        description:
          cleanString(
            description
          ),

        locationDescription:
          cleanString(
            description
          ),

        neighbors:
          cleanString(
            neighbors
          ),

        notes:
          cleanString(
            notes
          ),

        status:
          "active",
      };
    };


  // =======================================================
  // PERSIST LOCATION
  // =======================================================

  const persistLocation =
    async ({
      selectedPoints = [],
      source = "map",
      returnAfterSave = false,
      administrativeData = null,
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

            administrativeData,
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

        /*
         * بعد الحفظ تبقى البيانات المحلية
         * أيضًا جاهزة.
         */
        const savedAdmin =
          normalizeAdministrativeData(
            saved
          );

        if (savedAdmin.country) {
          setCountry(
            savedAdmin.country
          );
        }

        if (savedAdmin.governorate) {
          setProvince(
            savedAdmin.governorate
          );
        }

        if (savedAdmin.city) {
          setCity(
            savedAdmin.city
          );
        }

        if (savedAdmin.village) {
          setTown(
            savedAdmin.village
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

        /*
         * العودة إلى الصفحة التي فتحت الخريطة.
         */
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

        return null;
      } finally {
        setSaving(false);
      }
    };


  // =======================================================
  // SAVE MAP
  // =======================================================

  const saveMap = async () => {
    setError("");
    setMessage("");

    if (points.length < 3) {
      setError(
        "يجب تحديد 3 نقاط على الأقل."
      );

      return;
    }

    try {
      /*
       * reverse geocoding يتم من مركز
       * الحدود اليدوية، وليس من GPS.
       */
      const administrativeData =
        await getAdministrativeData(
          points
        );

      await persistLocation({
        selectedPoints: points,
        source: "map",
        returnAfterSave:
          Boolean(returnPath),
        administrativeData,
      });

      if (!returnPath) {
        setMapOpen(false);

        setMessage(
          "تم حفظ موقع الأرض بنجاح."
        );
      }
    } catch (saveError) {
      setError(
        saveError?.message ||
        "تعذر حفظ الموقع."
      );
    }
  };


  // =======================================================
  // MAIN SAVE
  // =======================================================

  const handleSave =
    async event => {
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

        await saveMap();

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
        // الخطأ ظاهر للمستخدم
      }
    };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete =
    async location => {
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
      } catch (deleteError) {
        setError(
          deleteError?.message ||
          "تعذر حذف الموقع."
        );
      }
    };


  // =======================================================
  // URL FARM
  // =======================================================

  useEffect(() => {
    if (!urlFarmId) {
      return;
    }

    setFarmId?.(
      String(urlFarmId)
    );
  }, [
    urlFarmId,
    setFarmId,
  ]);


  // =======================================================
  // LOAD SAVED LOCATION
  // =======================================================

  useEffect(() => {
    if (!currentFarmId) {
      return;
    }

    const matches =
      locations.filter(
        location =>
          String(
            getLocationFarmId(
              location
            )
          ) ===
          String(
            currentFarmId
          )
      );

    if (!matches.length) {
      return;
    }

    const saved =
      matches[matches.length - 1];

    const savedPoints =
      normalizePoints(
        saved.points ??
        saved.boundary ??
        saved.coordinates
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

    const admin =
      normalizeAdministrativeData(
        saved
      );

    setCountry(admin.country);
    setProvince(
      admin.governorate
    );
    setCity(admin.city);
    setTown(admin.village);

    setDescription(
      saved.description ??
      saved.locationDescription ??
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


  // =======================================================
  // RENDER
  // =======================================================

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
              value={
                currentFarmId
              }
              onChange={
                handleFarmChange
              }
              disabled={loading}
            >
              <option value="">
                اختر المزرعة
              </option>

              {farms.map(farm => {
                const id =
                  farm?.id ??
                  farm?._id ??
                  farm?.farmId ??
                  farm?.farm_id;

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
            اختر المزرعة أولًا حتى يتم
            ربط الموقع بها.
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
                  اضغط «تحديد موقعي الآن»
                  ليطلب التطبيق إذن الموقع
                  من الهاتف. سيتم وضع موقع
                  الهاتف على الخريطة فقط.
                  لا تتم إضافة نقطة حدود
                  تلقائيًا.
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


              {gpsPosition ? (
                <div className="map-success">
                  ✓ تم تحديد موقع الهاتف.
                  يمكنك الآن فتح الخريطة وتحريكها
                  يدويًا إلى أرضك.
                </div>
              ) : null}


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
            setDescription={
              setDescription
            }
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

            {locations.map(location => {
              const id =
                location?.id ??
                location?._id ??
                location?.locationId;

              const locationFarmId =
                getLocationFarmId(
                  location
                );

              const farm =
                farms.find(item => {
                  const id =
                    item?.id ??
                    item?._id ??
                    item?.farmId ??
                    item?.farm_id;

                  return (
                    String(id) ===
                    String(
                      locationFarmId
                    )
                  );
                });

              const name =
                farm?.name ??
                farm?.farmName ??
                location?.farmName ??
                "مزرعة";

              const admin =
                normalizeAdministrativeData(
                  location
                );

              const place =
                admin.village ||
                admin.city ||
                admin.governorate ||
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
            })}

          </div>

        ) : null}

      </Card>


      {mapOpen ? (
        <FieldMapEditor
          points={points}
          setPoints={setPoints}
          gpsPosition={gpsPosition}
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
