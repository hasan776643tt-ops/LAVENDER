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
  Circle,
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
// تحديد موقع الأرض:
//
// 1. الكتابة
//    - البلد
//    - المحافظة / المنطقة
//    - المدينة
//    - البلدة / القرية
//    - وصف الأرض
//    - الجهات المحيطة
//
// 2. الخريطة
//    - صور أقمار صناعية / جوية
//    - طرق
//    - أسماء المدن والقرى والبلدات والأماكن
//    - GPS الهاتف
//    - تحديد زوايا الأرض يدويًا
//    - حساب المساحة
//    - حساب المحيط
//
// مهم:
// لا نغيّر useMapHook أو farmService أو نظام الحفظ.
//
// التعديل الحالي محصور في:
// 1. تحسين طبقة الأسماء والمراجع فوق صور الأقمار الصناعية.
// 2. جعل طلب GPS صريحًا عند ضغط المستخدم.
// 3. منع GPS من إعادة تحريك الخريطة بعد تحديد الموقع.
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

// تكبير مناسب عند طلب موقع الهاتف
const GPS_ZOOM = 19;

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
// MAP BASE LAYERS
// =========================================================
//
// الطبقة 1:
// صور الأقمار الصناعية / الجوية
//
// الطبقة 2:
// الطرق
//
// الطبقة 3:
// المراجع والأسماء والحدود والأماكن
//
// ملاحظة مهمة:
// World_Reference_Overlay مصمم ليكون طبقة مرجعية
// فوق الصور الجوية، لذلك لا نستبدل صور الأقمار الصناعية
// بخريطة بيضاء.
//
// =========================================================

function MapLayers() {

  return (

    <>

      {/* =================================================
          1 — SATELLITE / AERIAL IMAGERY
          ================================================= */}

      <TileLayer

        attribution="
          © Esri
          © Maxar
          © Earthstar Geographics
          © GIS User Community
        "

        url={
          "https://server.arcgisonline.com/" +
          "ArcGIS/rest/services/" +
          "World_Imagery/MapServer/tile/{z}/{y}/{x}"
        }

        maxZoom={
          20
        }

        maxNativeZoom={
          19
        }

        tileSize={
          256
        }

        detectRetina

      />


      {/* =================================================
          2 — ROADS / TRANSPORTATION
          ================================================= */}

      <TileLayer

        attribution="
          © Esri
          © OpenStreetMap contributors
        "

        url={
          "https://server.arcgisonline.com/" +
          "ArcGIS/rest/services/" +
          "Reference/World_Transportation/" +
          "MapServer/tile/{z}/{y}/{x}"
        }

        maxZoom={
          20
        }

        maxNativeZoom={
          19
        }

        tileSize={
          256
        }

        opacity={
          0.95
        }

        detectRetina

      />


      {/* =================================================
          3 — PLACE NAMES / CITIES / VILLAGES / PLACES
          =================================================
          
          هذه الطبقة شفافة نسبيًا وتعمل فوق صور الأقمار
          الصناعية، وتضيف:
          
          - أسماء المدن
          - أسماء البلدات
          - أسماء القرى
          - أسماء الأماكن
          - المراجع الجغرافية
          - الحدود
          
          بدل طبقة World_Boundaries_and_Places السابقة.
          
          ================================================= */}

      <TileLayer

        attribution="
          © Esri
          © OpenStreetMap contributors
        "

        url={
          "https://server.arcgisonline.com/" +
          "ArcGIS/rest/services/" +
          "Reference/World_Reference_Overlay/" +
          "MapServer/tile/{z}/{y}/{x}"
        }

        maxZoom={
          20
        }

        maxNativeZoom={
          19
        }

        tileSize={
          256
        }

        opacity={
          1
        }

        detectRetina

        zIndex={
          500
        }

      />

    </>

  );
}


// =========================================================
// MAP RESIZE
// =========================================================

function MapResizeHandler() {

  const map =
    useMap();

  useEffect(() => {

    const timers = [

      window.setTimeout(
        () => {
          map.invalidateSize(
            true
          );
        },
        100
      ),

      window.setTimeout(
        () => {
          map.invalidateSize(
            true
          );
        },
        500
      ),

      window.setTimeout(
        () => {
          map.invalidateSize(
            true
          );
        },
        1000
      ),

    ];

    return () => {

      timers.forEach(
        timer =>
          window.clearTimeout(
            timer
          )
      );

    };

  }, [map]);

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
// GPS CONTROLLER
// =========================================================
//
// مهم جدًا:
//
// هذا المكوّن لا يعمل إلا عندما يتغير requestId.
//
// لا يوجد watchPosition دائم.
// لا يوجد تتبع مستمر للهاتف.
// لا يوجد إعادة مركز للخريطة أثناء تحريك المستخدم.
//
// عند الضغط على:
// "📍 تحديد موقعي الآن"
//
// يتم طلب GPS مرة واحدة.
//
// =========================================================

function GPSController({
  requestId,
  onPosition,
  onStatus,
}) {

  const map =
    useMap();

  useEffect(() => {

    if (
      !requestId
    ) {

      return undefined;
    }

    if (
      typeof window ===
      "undefined" ||
      typeof navigator ===
      "undefined"
    ) {

      onStatus({
        type:
          "error",

        message:
          "المتصفح غير قادر على الوصول إلى خدمات الموقع."
      });

      return undefined;
    }


    if (
      !navigator.geolocation
    ) {

      onStatus({
        type:
          "error",

        message:
          "الهاتف أو المتصفح لا يدعم تحديد الموقع."
      });

      return undefined;
    }


    // -----------------------------------------------------
    // بداية طلب GPS فعلي
    // -----------------------------------------------------

    onStatus({
      type:
        "loading",

      message:
        "📍 جارٍ طلب إذن الموقع من الهاتف..."
    });


    let finished =
      false;


    const handleSuccess =
      position => {

        if (
          finished
        ) {

          return;
        }

        finished =
          true;


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
          )
        ) {

          onStatus({
            type:
              "error",

            message:
              "تعذر قراءة إحداثيات الموقع من الهاتف."
          });

          return;
        }


        const safeAccuracy =
          Number.isFinite(
            accuracy
          )
            ? accuracy
            : null;


        const gpsPoint = [
          latitude,
          longitude,
        ];


        // -------------------------------------------------
        // إرسال الموقع للأب
        // -------------------------------------------------

        onPosition({
          point:
            gpsPoint,

          accuracy:
            safeAccuracy,
        });


        // -------------------------------------------------
        // نقل الخريطة مرة واحدة فقط
        //
        // مهم:
        // بعد هذه العملية لا يوجد أي كود يتابع GPS
        // أو يعيد الخريطة إلى الهاتف.
        // -------------------------------------------------

        map.flyTo(
          gpsPoint,
          GPS_ZOOM,
          {
            animate:
              true,

            duration:
              0.9,
          }
        );


        // -------------------------------------------------
        // نجاح
        // -------------------------------------------------

        if (
          safeAccuracy !== null
        ) {

          onStatus({
            type:
              "success",

            message:
              `📍 تم تحديد موقعك — الدقة التقريبية ±${Math.round(
                safeAccuracy
              )} م`
          });

        } else {

          onStatus({
            type:
              "success",

            message:
              "📍 تم تحديد موقعك بنجاح."
          });

        }

      };


    const handleError =
      error => {

        if (
          finished
        ) {

          return;
        }

        finished =
          true;


        console.error(
          "GPS error:",
          error
        );


        let message =
          "تعذر تحديد موقعك.";


        // -------------------------------------------------
        // المستخدم رفض الإذن
        // -------------------------------------------------

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          message =
            "📍 لم يُسمح للموقع بالوصول إلى GPS. اسمح للموقع من إعدادات المتصفح/الموقع ثم اضغط «تحديد موقعي الآن» مرة أخرى.";

        }


        // -------------------------------------------------
        // خدمات الموقع / GPS غير متاحة
        // -------------------------------------------------

        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "📡 موقع الهاتف غير متاح. شغّل «الموقع/GPS» في الهاتف وتأكد من أن المتصفح لديه إذن الموقع، ثم حاول مرة أخرى.";

        }


        // -------------------------------------------------
        // Timeout
        // -------------------------------------------------

        else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "⏳ لم يصل GPS إلى موقع دقيق خلال الوقت المحدد. تأكد من تشغيل الموقع ثم حاول مرة أخرى.";

        }


        onStatus({
          type:
            "error",

          message,
        });

      };


    // -----------------------------------------------------
    // الطلب الفعلي
    //
    // هذا هو الاستدعاء الذي يسمح للمتصفح بإظهار
    // نافذة طلب إذن الموقع عندما تكون حالة الإذن = prompt.
    // -----------------------------------------------------

    navigator.geolocation.getCurrentPosition(

      handleSuccess,

      handleError,

      {
        enableHighAccuracy:
          true,

        timeout:
          30000,

        maximumAge:
          0,
      }

    );


    // -----------------------------------------------------
    // لا يوجد watchPosition
    //
    // وهذا مقصود لمنع:
    // الخريطة تتحرك خلف المستخدم
    // أو تعيده إلى موقع الهاتف.
    // -----------------------------------------------------

    return () => {

      finished =
        true;

    };

  }, [
    requestId,
    map,
    onPosition,
    onStatus,
  ]);

  return null;
}


// =========================================================
// GPS LOCATION VISUAL
// =========================================================

function GPSLocationVisual({
  gpsPosition,
  gpsAccuracy,
}) {

  if (
    !Array.isArray(
      gpsPosition
    ) ||
    gpsPosition.length !== 2
  ) {

    return null;
  }


  const safeAccuracy =
    Number(
      gpsAccuracy
    );


  return (

    <>

      {/* =================================================
          GPS ACCURACY CIRCLE
          ================================================= */}

      {Number.isFinite(
        safeAccuracy
      ) &&
      safeAccuracy > 0 && (

        <Circle

          center={
            gpsPosition
          }

          radius={
            safeAccuracy
          }

          pathOptions={{
            color:
              "#1976d2",

            weight:
              2,

            fillColor:
              "#2196f3",

            fillOpacity:
              0.12,
          }}

        />

      )}


      {/* =================================================
          GPS POINT
          ================================================= */}

      <CircleMarker

        center={
          gpsPosition
        }

        radius={
          10
        }

        pathOptions={{
          color:
            "#ffffff",

          weight:
            4,

          fillColor:
            "#1976d2",

          fillOpacity:
            1,
        }}

      />

    </>

  );
}


// =========================================================
// FIELD INPUT
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
        value={
          country
        }
        onChange={
          setCountry
        }
        placeholder="اكتب اسم البلد"
      />


      <Field
        label="🏛️ المحافظة / المنطقة"
        value={
          province
        }
        onChange={
          setProvince
        }
        placeholder="اكتب المحافظة أو المنطقة"
      />


      <Field
        label="🏙️ المدينة"
        value={
          city
        }
        onChange={
          setCity
        }
        placeholder="اكتب اسم المدينة"
      />


      <Field
        label="🏘️ البلدة / القرية"
        value={
          town
        }
        onChange={
          setTown
        }
        placeholder="اكتب اسم البلدة أو القرية"
      />


      <Field
        textarea
        minHeight="150px"
        label="📍 وصف موقع الأرض"
        value={
          description
        }
        onChange={
          setDescription
        }
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
        minHeight="150px"
        label="📝 ملاحظات"
        value={
          notes
        }
        onChange={
          setNotes
        }
        placeholder="أي معلومات إضافية عن الأرض"
      />

    </div>
  );
}


// =========================================================
// GPS CONTROL BUTTON
// =========================================================

function GPSButton({
  onClick,
  loading,
}) {

  return (

    <button

      type="button"

      onClick={
        onClick
      }

      disabled={
        loading
      }

      style={{
        width:
          "100%",

        minHeight:
          "58px",

        border:
          "none",

        borderRadius:
          "16px",

        background:
          loading
            ? "#78909c"
            : "#1976d2",

        color:
          "#ffffff",

        fontSize:
          "17px",

        fontWeight:
          "900",

        boxShadow:
          "0 3px 12px rgba(0,0,0,0.25)",

        direction:
          "rtl",

        cursor:
          loading
            ? "wait"
            : "pointer",
      }}

    >

      {loading
        ? "⏳ جارٍ طلب الموقع..."
        : "📍 تحديد موقعي الآن"}

    </button>
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


  // =======================================================
  // GPS
  // =======================================================

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
    type:
      "idle",

    message:
      "",
  });


  const [
    gpsLoading,
    setGpsLoading,
  ] = useState(false);


  // =======================================================
  // GPS POSITION CALLBACK
  // =======================================================

  const handleGPSPosition =
    positionData => {

      if (
        !positionData ||
        !Array.isArray(
          positionData.point
        )
      ) {

        return;
      }


      setGpsPosition(
        positionData.point
      );


      setGpsAccuracy(
        positionData.accuracy
      );


      setGpsLoading(
        false
      );
    };


  // =======================================================
  // GPS STATUS CALLBACK
  // =======================================================

  const handleGPSStatus =
    status => {

      setGpsStatus(
        status
      );


      if (
        status?.type ===
        "loading"
      ) {

        setGpsLoading(
          true
        );

      } else {

        setGpsLoading(
          false
        );
      }
    };


  // =======================================================
  // REQUEST GPS
  // =======================================================

  const requestGPS =
    () => {

      setGpsStatus({
        type:
          "loading",

        message:
          "📍 جارٍ طلب إذن الموقع من الهاتف..."
      });


      setGpsLoading(
        true
      );


      // ---------------------------------------------------
      // تشغيل طلب GPS جديد.
      //
      // لا نغيّر مركز الخريطة هنا.
      // GPSController هو الذي ينقل الخريطة مرة واحدة
      // بعد وصول الموقع الحقيقي.
      // ---------------------------------------------------

      setGpsRequestId(
        current =>
          current + 1
      );
    };


  // =======================================================
  // ADD POINT
  // =======================================================

  const addPoint =
    point => {

      setPoints(
        current => [
          ...current,
          point,
        ]
      );

      // ---------------------------------------------------
      // لا يوجد setCenter هنا.
      //
      // هذا مقصود حتى لا تتحرك الخريطة تلقائيًا مع كل نقطة.
      // ---------------------------------------------------
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


  // =======================================================
  // MAP EDITOR
  // =======================================================

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

        scrollWheelZoom={
          true
        }

        zoomControl={
          true
        }

        doubleClickZoom={
          false
        }

        style={{
          width:
            "100%",

          height:
            "100%",
        }}

      >

        <MapLayers />

        <MapResizeHandler />

        <BoundaryPointSelector
          onAddPoint={
            addPoint
          }
        />


        <GPSController

          requestId={
            gpsRequestId
          }

          onPosition={
            handleGPSPosition
          }

          onStatus={
            handleGPSStatus
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


        {/* =================================================
            FIELD POLYGON
            ================================================= */}

        {safePoints.length >= 3 && (

          <Polygon

            positions={
              safePoints
            }

            pathOptions={{
              color:
                "#0b6e32",

              weight:
                4,

              opacity:
                1,

              fillColor:
                "#39a852",

              fillOpacity:
                0.28,
            }}

          />

        )}


        {/* =================================================
            TWO POINT LINE
            ================================================= */}

        {safePoints.length === 2 && (

          <Polyline

            positions={
              safePoints
            }

            pathOptions={{
              color:
                "#0b6e32",

              weight:
                4,

              opacity:
                1,
            }}

          />

        )}


        {/* =================================================
            FIELD POINTS
            ================================================= */}

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
                10
              }

              pathOptions={{
                color:
                  "#ffffff",

                weight:
                  3,

                fillColor:
                  "#0b6e32",

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

          🛰️ تحديد حدود الأرض

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
          GPS BUTTON
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

          direction:
            "rtl",
        }}
      >

        <GPSButton

          onClick={
            requestGPS
          }

          loading={
            gpsLoading
          }

        />


        {gpsStatus.message && (

          <div
            style={{
              marginTop:
                "8px",

              padding:
                "10px 12px",

              borderRadius:
                "13px",

              background:
                gpsStatus.type ===
                "error"
                  ? "rgba(183,28,28,0.94)"
                  : gpsStatus.type ===
                    "success"
                    ? "rgba(20,90,50,0.94)"
                    : "rgba(30,70,100,0.94)",

              color:
                "#ffffff",

              textAlign:
                "center",

              fontSize:
                "14px",

              fontWeight:
                "800",

              boxShadow:
                "0 3px 12px rgba(0,0,0,0.25)",
            }}
          >

            {gpsStatus.message}

          </div>

        )}

      </div>


      {/* =================================================
          INSTRUCTION
          ================================================= */}

      <div
        style={{
          position:
            "absolute",

          top:
            gpsStatus.message
              ? "176px"
              : "150px",

          left:
            "12px",

          right:
            "12px",

          zIndex:
            100000,

          padding:
            "13px",

          borderRadius:
            "16px",

          background:
            "rgba(20,80,40,0.94)",

          color:
            "#ffffff",

          textAlign:
            "center",

          fontSize:
            "15px",

          fontWeight:
            "800",

          direction:
            "rtl",

          boxShadow:
            "0 3px 15px rgba(0,0,0,0.3)",
        }}
      >

        👆 اضغط على زوايا الأرض واحدة تلو الأخرى

        <div
          style={{
            marginTop:
              "5px",

            fontSize:
              "13px",

            fontWeight:
              "500",
          }}
        >

          🛰️ حرّك الخريطة بحرية، وكبّرها لرؤية الأرض
          والطرق والمباني والأسماء بدقة أكبر

        </div>

      </div>


      {/* =================================================
          GPS ACCURACY CARD
          ================================================= */}

      {gpsPosition && (

        <div
          style={{
            position:
              "absolute",

            bottom:
              "150px",

            right:
              "12px",

            zIndex:
              100000,

            padding:
              "10px 13px",

            borderRadius:
              "14px",

            background:
              "rgba(255,255,255,0.96)",

            boxShadow:
              "0 3px 14px rgba(0,0,0,0.25)",

            fontSize:
              "13px",

            fontWeight:
              "800",

            direction:
              "rtl",

            maxWidth:
              "190px",
          }}
        >

          📍 موقع الهاتف

          {Number.isFinite(
            Number(
              gpsAccuracy
            )
          ) && (

            <div
              style={{
                marginTop:
                  "4px",

                color:
                  "#1976d2",
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

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.16)",
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

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.16)",
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

            🛰️ تحديد الأرض على الخريطة

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

              صور أقمار صناعية + طرق + مدن + قرى + بلدات + GPS + تحديد يدوي

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
          title="🛰️ حدود الأرض"
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

                🛰️ فتح الخريطة وتحديد الأرض

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
