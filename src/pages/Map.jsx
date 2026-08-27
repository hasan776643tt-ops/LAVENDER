// src/pages/Map.jsx

import {
  useMemo,
  useState,
  useEffect,
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

import useMapHook
  from "../hooks/useMap.js";

import Card
  from "../components/Card.jsx";

import Button
  from "../components/Button.jsx";


// =========================================================
// LAVENDER — MAP
// =========================================================
//
// طرق تحديد الأرض:
//
// 1. الخريطة
//    - تفتح ملء الشاشة
//    - المستخدم يضع نقاط حدود الأرض
//    - النقاط هي الإحداثيات الحقيقية
//    - حساب المساحة والمحيط
//    - حفظ النقاط
//
// 2. الكتابة
//    - البلد
//    - المحافظة / المنطقة
//    - المدينة
//    - البلدة / القرية
//    - وصف الأرض
//    - جار الشمال
//    - جار الجنوب
//    - جار الشرق
//    - جار الغرب
//
// لا يوجد استبدال تلقائي لموقع المستخدم.
//
// =========================================================


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
// NUMBER
// =========================================================

function toNumber(
  value
) {

  const number =
    Number(value);


  return Number.isFinite(
    number
  )
    ? number
    : null;

}


// =========================================================
// RADIANS
// =========================================================

function toRadians(
  value
) {

  return (
    Number(value) *
    Math.PI /
    180
  );

}


// =========================================================
// DISTANCE
// =========================================================

function distanceMeters(
  pointA,
  pointB
) {

  if (
    !Array.isArray(pointA) ||
    !Array.isArray(pointB)
  ) {

    return 0;

  }


  const lat1 =
    toRadians(
      pointA[0]
    );


  const lat2 =
    toRadians(
      pointB[0]
    );


  const dLat =
    toRadians(
      pointB[0] -
      pointA[0]
    );


  const dLon =
    toRadians(
      pointB[1] -
      pointA[1]
    );


  const earthRadius =
    6371008.8;


  const a =
    Math.sin(
      dLat / 2
    ) ** 2 +

    Math.cos(lat1) *
    Math.cos(lat2) *

    Math.sin(
      dLon / 2
    ) ** 2;


  return (
    earthRadius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );

}


// =========================================================
// PERIMETER
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
      point =>
        Array.isArray(point) &&
        point.length >= 2
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
        toRadians(
          point[0]
        ),
      0
    ) /
    validPoints.length;


  const cosLatitude =
    Math.cos(
      referenceLatitude
    );


  const projected =
    validPoints.map(
      point => {

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
// MAP LAYERS
// =========================================================

function MapLayers() {

  return (

    <TileLayer

      attribution="
        © OpenStreetMap contributors
        © Esri
      "

      url="
        https://server.arcgisonline.com/
        ArcGIS/rest/services/
        World_Imagery/MapServer/tile/{z}/{y}/{x}
      "

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
// MAP CLICK
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
// LARGE FIELD
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

    width:
      "100%",

    boxSizing:
      "border-box",

    minHeight:
      textarea
        ? minHeight
        : "68px",

    padding:
      "15px",

    border:
      "2px solid #d7ded9",

    borderRadius:
      "16px",

    fontSize:
      "18px",

    lineHeight:
      "1.8",

    background:
      "#ffffff",

    outline:
      "none",

    resize:
      textarea
        ? "vertical"
        : "none",

  };


  return (

    <label
      style={{
        display:
          "block",

        direction:
          "rtl",
      }}
    >

      <strong
        style={{
          display:
            "block",

          marginBottom:
            "8px",

          fontSize:
            "17px",
        }}
      >

        {label}

      </strong>


      {textarea ? (

        <textarea

          value={
            value
          }

          onChange={
            event =>
              onChange(
                event.target.value
              )
          }

          placeholder={
            placeholder
          }

          style={
            style
          }

        />

      ) : (

        <input

          type="text"

          value={
            value
          }

          onChange={
            event =>
              onChange(
                event.target.value
              )
          }

          placeholder={
            placeholder
          }

          style={
            style
          }

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
        display:
          "grid",

        gap:
          "18px",

        direction:
          "rtl",
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
        minHeight="150px"
        label="📍 وصف موقع الأرض"
        value={description}
        onChange={setDescription}
        placeholder="اكتب وصفًا واضحًا لمكان الأرض"
      />


      <div
        style={{
          padding:
            "18px",

          borderRadius:
            "18px",

          background:
            "#f2f7f3",

          display:
            "grid",

          gap:
            "14px",
        }}
      >

        <strong
          style={{
            fontSize:
              "19px",
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
        minHeight="150px"
        label="📝 ملاحظات"
        value={notes}
        onChange={setNotes}
        placeholder="أي معلومات إضافية عن الأرض"
      />

    </div>

  );

}


// =========================================================
// FULL SCREEN MAP EDITOR
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


  const [center, setCenter] =
    useState(
      safePoints.length
        ? safePoints[
            safePoints.length - 1
          ]
        : DEFAULT_POSITION
    );


  // =======================================================
  // ADD
  // =======================================================

  const addPoint =
    point => {

      setPoints(
        current => [
          ...current,
          point,
        ]
      );


      setCenter(
        point
      );

    };


  // =======================================================
  // UNDO
  // =======================================================

  const undo =
    () => {

      setPoints(
        current =>
          current.slice(
            0,
            -1
          )
      );

    };


  // =======================================================
  // CLEAR
  // =======================================================

  const clear =
    () => {

      setPoints([]);

      setCenter(
        DEFAULT_POSITION
      );

    };


  // =======================================================
  // SAVE
  // =======================================================

  const save =
    () => {

      if (
        safePoints.length < 3
      ) {

        alert(
          "يجب تحديد 3 نقاط على الأقل لحفظ حدود الأرض."
        );

        return;

      }


      onSave();

    };


  return (

    <div
      style={{
        position:
          "fixed",

        inset:
          0,

        zIndex:
          99999,

        background:
          "#ffffff",
      }}
    >

      <MapContainer

        center={
          safePoints.length
            ? safePoints[
                safePoints.length - 1
              ]
            : DEFAULT_POSITION
        }

        zoom={
          safePoints.length
            ? EDITOR_ZOOM
            : DEFAULT_ZOOM
        }

        scrollWheelZoom

        zoomControl

        style={{
          width:
            "100%",

          height:
            "100%",
        }}

      >

        <MapLayers />

        <MapResizeHandler />

        <MapCenterController
          center={center}
        />

        <BoundaryPointSelector
          onAddPoint={addPoint}
        />


        {safePoints.length >= 3 && (

          <Polygon

            positions={
              safePoints
            }

            pathOptions={{
              color:
                "#1b7f3a",

              weight:
                4,

              fillColor:
                "#4caf50",

              fillOpacity:
                0.28,
            }}

          />

        )}


        {safePoints.length === 2 && (

          <Polyline

            positions={
              safePoints
            }

            pathOptions={{
              color:
                "#1b7f3a",

              weight:
                4,
            }}

          />

        )}


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

              radius={
                9
              }

              pathOptions={{
                color:
                  "#ffffff",

                weight:
                  3,

                fillColor:
                  "#1b7f3a",

                fillOpacity:
                  1,
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
          position:
            "absolute",

          top:
            "12px",

          left:
            "12px",

          right:
            "12px",

          zIndex:
            100000,

          display:
            "flex",

          gap:
            "10px",

          direction:
            "rtl",
        }}
      >

        <div
          style={{
            flex:
              1,

            minHeight:
              "52px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            borderRadius:
              "16px",

            background:
              "rgba(255,255,255,0.96)",

            boxShadow:
              "0 3px 15px rgba(0,0,0,0.25)",

            fontSize:
              "18px",

            fontWeight:
              "900",
          }}
        >

          🗺️ تحديد حدود الأرض

        </div>


        <button

          type="button"

          onClick={
            onClose
          }

          style={{
            width:
              "52px",

            height:
              "52px",

            border:
              "none",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,0.96)",

            boxShadow:
              "0 3px 15px rgba(0,0,0,0.25)",

            fontSize:
              "24px",

            fontWeight:
              "900",
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
          position:
            "absolute",

          top:
            "78px",

          left:
            "12px",

          right:
            "12px",

          zIndex:
            100000,

          padding:
            "14px",

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
            "800",

          direction:
            "rtl",

          boxShadow:
            "0 3px 15px rgba(0,0,0,0.3)",
        }}
      >

        👆 اضغط على زوايا الأرض واحدة تلو الأخرى لتحديد حدودها

      </div>


      {/* =================================================
          POINT COUNT
      ================================================= */}

      <div
        style={{
          position:
            "absolute",

          bottom:
            "145px",

          left:
            "12px",

          zIndex:
            100000,

          padding:
            "10px 14px",

          borderRadius:
            "14px",

          background:
            "rgba(255,255,255,0.96)",

          boxShadow:
            "0 3px 14px rgba(0,0,0,0.25)",

          fontWeight:
            "900",

          direction:
            "rtl",
        }}
      >

        📍 النقاط:{" "}
        {safePoints.length}

      </div>


      {/* =================================================
          BOTTOM BAR
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
            100000,

          display:
            "grid",

          gridTemplateColumns:
            "1fr 1fr 1.3fr",

          gap:
            "8px",

          direction:
            "rtl",
        }}
      >

        <button

          type="button"

          onClick={
            undo
          }

          disabled={
            safePoints.length === 0
          }

          style={{
            minHeight:
              "58px",

            border:
              "none",

            borderRadius:
              "15px",

            background:
              "#ffffff",

            fontSize:
              "16px",

            fontWeight:
              "900",
          }}

        >

          ↩️ تراجع

        </button>


        <button

          type="button"

          onClick={
            clear
          }

          disabled={
            safePoints.length === 0
          }

          style={{
            minHeight:
              "58px",

            border:
              "none",

            borderRadius:
              "15px",

            background:
              "#ffffff",

            fontSize:
              "16px",

            fontWeight:
              "900",
          }}

        >

          🗑️ مسح

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
              "58px",

            border:
              "none",

            borderRadius:
              "15px",

            background:
              safePoints.length >= 3
                ? "#1b7f3a"
                : "#9e9e9e",

            color:
              "#ffffff",

            fontSize:
              "17px",

            fontWeight:
              "900",
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


  // =======================================================
  // METHOD
  // =======================================================

  const [
    locationMethod,
    setLocationMethod,
  ] = useState(
    "text"
  );


  // =======================================================
  // TEXT
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


  // =======================================================
  // NEIGHBORS
  // =======================================================

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


  // =======================================================
  // POINTS
  // =======================================================

  const [
    fieldPoints,
    setFieldPoints,
  ] = useState([]);


  // =======================================================
  // EDITOR
  // =======================================================

  const [
    mapEditor,
    setMapEditor,
  ] = useState(false);


  // =======================================================
  // SELECTED FARM
  // =======================================================

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          farm =>
            String(farm.id) ===
            String(farmId)
        ),

      [
        farms,
        farmId,
      ]
    );


  // =======================================================
  // OPEN MAP
  // =======================================================

  const openMap =
    () => {

      setLocationMethod(
        "map"
      );


      setMapEditor(
        true
      );

    };


  // =======================================================
  // CLOSE MAP
  // =======================================================

  const closeMap =
    () => {

      setMapEditor(
        false
      );

    };


  // =======================================================
  // SAVE MAP DRAWING
  // =======================================================

  const saveMap =
    () => {

      if (
        fieldPoints.length < 3
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


  // =======================================================
  // RESET
  // =======================================================

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


  // =======================================================
  // SAVE LOCATION
  // =======================================================

  const handleSave =
    async () => {

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

        farmId:
          String(farmId),

        farmName:
          selectedFarm?.name ||
          "",

        type:
          locationType ||
          "field",

        source:
          locationMethod,


        // -----------------------------------------------
        // TEXT
        // -----------------------------------------------

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


        // -----------------------------------------------
        // NEIGHBORS
        // -----------------------------------------------

        northNeighbor:
          northNeighbor.trim(),

        southNeighbor:
          southNeighbor.trim(),

        eastNeighbor:
          eastNeighbor.trim(),

        westNeighbor:
          westNeighbor.trim(),


        // -----------------------------------------------
        // MAP
        // -----------------------------------------------

        points:
          fieldPoints.map(
            point => ({

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


        area:
          locationMethod === "map"
            ? calculateArea(
                fieldPoints
              )
            : null,


        perimeter:
          locationMethod === "map"
            ? calculatePerimeter(
                fieldPoints
              )
            : null,


        notes:
          notes?.trim() ||
          "",


        status:
          "active",

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


  // =======================================================
  // FULL SCREEN MAP
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

        onClose={
          closeMap
        }

        onSave={
          saveMap
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

        🗺️ موقع الأرض

      </h1>


      {/* =================================================
          FARM
      ================================================= */}

      <Card
        title="🌾 الأرض والمزرعة"
      >

        <select

          value={
            farmId || ""
          }

          onChange={
            event =>
              setFarmId(
                event.target.value
              )
          }

          style={{
            width:
              "100%",

            minHeight:
              "64px",

            padding:
              "12px",

            border:
              "2px solid #d7ded9",

            borderRadius:
              "16px",

            fontSize:
              "18px",

            background:
              "#ffffff",
          }}

        >

          <option value="">

            اختر المزرعة

          </option>


          {farms.map(
            farm => (

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
              "14px",
          }}
        />


        <select

          value={
            locationType ||
            "field"
          }

          onChange={
            event =>
              setLocationType(
                event.target.value
              )
          }

          style={{
            width:
              "100%",

            minHeight:
              "64px",

            padding:
              "12px",

            border:
              "2px solid #d7ded9",

            borderRadius:
              "16px",

            fontSize:
              "18px",

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
          height:
            "14px",
        }}
      />


      {/* =================================================
          METHOD
      ================================================= */}

      <Card
        title="📍 كيف تريد تحديد موقع الأرض؟"
      >

        <div
          style={{
            display:
              "grid",

            gap:
              "12px",
          }}
        >

          {/* TEXT */}

          <button

            type="button"

            onClick={() =>
              setLocationMethod(
                "text"
              )
            }

            style={{
              minHeight:
                "100px",

              padding:
                "16px",

              borderRadius:
                "18px",

              border:
                locationMethod === "text"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              background:
                locationMethod === "text"
                  ? "#edf8f0"
                  : "#ffffff",

              textAlign:
                "right",

              fontSize:
                "19px",

              fontWeight:
                "900",
            }}

          >

            ✍️ كتابة موقع الأرض

            <div
              style={{
                marginTop:
                  "7px",

                fontSize:
                  "15px",

                fontWeight:
                  "400",

                lineHeight:
                  "1.8",
              }}
            >

              البلد → المحافظة → المدينة → البلدة → الجهات المحيطة

            </div>

          </button>


          {/* MAP */}

          <button

            type="button"

            onClick={
              openMap
            }

            style={{
              minHeight:
                "100px",

              padding:
                "16px",

              borderRadius:
                "18px",

              border:
                locationMethod === "map"
                  ? "3px solid #1b7f3a"
                  : "2px solid #d7ded9",

              background:
                locationMethod === "map"
                  ? "#edf8f0"
                  : "#ffffff",

              textAlign:
                "right",

              fontSize:
                "19px",

              fontWeight:
                "900",
            }}

          >

            🗺️ تحديد الأرض على الخريطة

            <div
              style={{
                marginTop:
                  "7px",

                fontSize:
                  "15px",

                fontWeight:
                  "400",

                lineHeight:
                  "1.8",
              }}
            >

              افتح الخريطة كاملة وحدد حدود الأرض بالنقاط يدويًا

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


      {/* =================================================
          TEXT MODE
      ================================================= */}

      {locationMethod === "text" && (

        <Card
          title="✍️ بيانات موقع الأرض"
        >

          <TextLocationForm

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

            city={
              city
            }

            setCity={
              setCity
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


      {/* =================================================
          MAP MODE
      ================================================= */}

      {locationMethod === "map" && (

        <Card
          title="🗺️ حدود الأرض"
        >

          <div
            style={{
              padding:
                "18px",

              borderRadius:
                "18px",

              background:
                "#f2f7f3",

              lineHeight:
                "1.9",

              fontSize:
                "17px",
            }}
          >

            <strong>

              {fieldPoints.length >= 3
                ? "تم تحديد حدود الأرض."
                : "لم يتم تحديد حدود الأرض بعد."}

            </strong>


            <div
              style={{
                marginTop:
                  "8px",
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
                    marginTop:
                      "8px",
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
                    marginTop:
                      "5px",
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
                marginTop:
                  "15px",
              }}
            >

              <Button
                onClick={
                  openMap
                }
              >

                🗺️ فتح الخريطة كاملة

              </Button>

            </div>

          </div>

        </Card>

      )}


      <div
        style={{
          height:
            "18px",
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
          ? "⏳ جارٍ الحفظ..."
          : "💾 حفظ موقع الأرض"}

      </Button>


      {/* =================================================
          SAVED
      ================================================= */}

      <h2
        style={{
          marginTop:
            "28px",

          fontSize:
            "23px",
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
            display:
              "grid",

            gap:
              "14px",
          }}
        >

          {locations.map(
            item => (

              <Card

                key={
                  item.id
                }

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

                      lineHeight:
                        "1.8",
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
                      marginTop:
                        "12px",

                      padding:
                        "16px",

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
                      display:
                        "inline-block",

                      marginTop:
                        "8px",

                      fontSize:
                        "17px",
                    }}

                  >

                    🗺️ فتح الموقع على Google Maps

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

                  🗑️ حذف

                </Button>

              </Card>

            )
          )}

        </div>

      )}

    </div>

  );

}
