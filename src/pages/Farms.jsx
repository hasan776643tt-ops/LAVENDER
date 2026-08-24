// src/pages/Farms.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useFarms from "../hooks/useFarms.js";


// =========================================================
// LAVENDER — Farms Page
// المزرعة الذكية
//
// الصفحة الأولى:
// اختيار المزرعة
//
// عند اختيار مزرعة:
// تظهر خدمات المزرعة
// =========================================================


export default function Farms() {

  const navigate = useNavigate();


  // =======================================================
  // Farms Hook
  // =======================================================

  const {
    farms = [],
    loading,
    error,
    loadFarms,
  } = useFarms();


  // =======================================================
  // Selected Farm
  // =======================================================

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState(null);


  // =======================================================
  // Load Farms
  // =======================================================

  useEffect(() => {

    if (typeof loadFarms === "function") {
      loadFarms();
    }

  }, [loadFarms]);


  // =======================================================
  // Normalize Farms
  //
  // لا نغير بيانات المزرعة الأصلية.
  // فقط نضمن أن العرض يتعامل مع اختلاف أسماء الحقول.
  // =======================================================

  const normalizedFarms = useMemo(() => {

    if (!Array.isArray(farms)) {
      return [];
    }

    return farms.map((farm, index) => {

      const id =
        farm?.id ??
        farm?._id ??
        farm?.farmId ??
        index + 1;

      const name =
        farm?.name ??
        farm?.farmName ??
        farm?.title ??
        `مزرعة ${index + 1}`;

      return {
        ...farm,
        __displayId: id,
        __displayName: name,
        __number: index + 1,
      };

    });

  }, [farms]);


  // =======================================================
  // Farm Services
  // =======================================================

  const services = useMemo(() => {

    return [

      {
        id: "fertilizers",
        icon: "🧪",
        title: "الأسمدة",
        path: "/fertilizers",
      },

      {
        id: "expenses",
        icon: "💰",
        title: "المصروفات",
        path: "/expenses",
      },

      {
        id: "weather",
        icon: "☁️",
        title: "الطقس",
        path: "/weather",
      },

      {
        id: "map",
        icon: "🗺️",
        title: "الخريطة",
        path: "/map",
      },

      {
        id: "engineer",
        icon: "👨‍🌾",
        title: "المستشار الزراعي",
        path: "/engineer",
      },

      {
        id: "irrigation",
        icon: "💧",
        title: "الري",
        path: "/irrigation",
      },

      {
        id: "crops",
        icon: "🌱",
        title: "المحاصيل",
        path: "/crops",
      },

      {
        id: "diseases",
        icon: "🦠",
        title: "الأمراض",
        path: "/diseases",
      },

      {
        id: "harvest",
        icon: "🌽",
        title: "الحصاد",
        path: "/harvest",
      },

    ];

  }, []);


  // =======================================================
  // Open Farm
  // =======================================================

  const openFarm = (farm) => {

    setSelectedFarm(farm);

  };


  // =======================================================
  // Back To Farms
  // =======================================================

  const backToFarms = () => {

    setSelectedFarm(null);

  };


  // =======================================================
  // Open Service
  // =======================================================

  const openService = (service) => {

    if (!selectedFarm) {
      return;
    }


    const farmId =
      selectedFarm.__displayId;


    const separator =
      service.path.includes("?")
        ? "&"
        : "?";


    navigate(
      `${service.path}${separator}farmId=${encodeURIComponent(
        farmId
      )}`
    );

  };


  // =======================================================
  // Loading
  // =======================================================

  if (loading && normalizedFarms.length === 0) {

    return (

      <main
        className="farms-selector"
        dir="rtl"
      >

        <section
          className="farms-selector-header"
        >

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <p className="farms-selector-subtitle">
            جاري تحميل مزارعك...
          </p>

        </section>

      </main>

    );

  }


  // =======================================================
  // Error
  // =======================================================

  if (
    error &&
    normalizedFarms.length === 0
  ) {

    return (

      <main
        className="farms-selector"
        dir="rtl"
      >

        <section
          className="farms-selector-header"
        >

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <p className="farms-selector-subtitle">
            تعذر تحميل المزارع
          </p>

        </section>


        <div className="card card-smart">

          <div className="card-body">

            حدث خطأ أثناء تحميل بيانات المزارع.

          </div>

        </div>

      </main>

    );

  }


  // =======================================================
  // EMPTY
  // =======================================================

  if (
    !selectedFarm &&
    normalizedFarms.length === 0
  ) {

    return (

      <main
        className="farms-selector"
        dir="rtl"
      >

        <section
          className="farms-selector-header"
        >

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <p className="farms-selector-subtitle">
            مزارعي
          </p>

        </section>


        <section
          className="card card-smart"
        >

          <div className="card-body">

            <div
              style={{
                textAlign: "center",
                padding: "25px 10px",
              }}
            >

              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "10px",
                }}
              >
                🌱
              </div>

              <h2>
                لا توجد مزارع بعد
              </h2>

              <p>
                أضف مزرعتك لتظهر هنا.
              </p>

            </div>

          </div>

        </section>

      </main>

    );

  }


  // =========================================================
  // FARM SERVICES SCREEN
  // =========================================================

  if (selectedFarm) {

    return (

      <main
        className="farm-services-page"
        dir="rtl"
      >


        {/* =================================================
            FARM HEADER
        ================================================= */}

        <section
          className="farm-services-header"
        >

          <button
            type="button"
            onClick={backToFarms}
            aria-label="العودة إلى المزارع"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "40px",
              height: "40px",
              border: "0",
              borderRadius: "50%",
              background: "#e5f2e7",
              color: "#18532e",
              fontSize: "20px",
              cursor: "pointer",
              fontWeight: "900",
            }}
          >
            ←
          </button>


          <div
            className="farm-services-number"
          >
            {selectedFarm.__number}
          </div>


          <h1
            className="farm-services-title"
          >
            {selectedFarm.__displayName}
          </h1>


          <p
            className="farm-services-subtitle"
          >
            اختر الخدمة التي تريد الدخول إليها
          </p>

        </section>


        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          className="farm-services-grid"
        >

          {services.map((service) => (

            <button
              key={service.id}
              type="button"
              className="farm-service-choice"
              onClick={() =>
                openService(service)
              }
            >

              <span
                className="farm-service-icon"
                aria-hidden="true"
              >
                {service.icon}
              </span>


              <span
                className="farm-service-name"
              >
                {service.title}
              </span>

            </button>

          ))}

        </section>


      </main>

    );

  }


  // =========================================================
  // FARMS SELECTION SCREEN
  // =========================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
    >


      {/* ===================================================
          HEADER
      =================================================== */}

      <section
        className="farms-selector-header"
      >

        <h1
          className="farms-selector-title"
        >
          المزرعة الذكية
        </h1>


        <p
          className="farms-selector-subtitle"
        >
          مزارعي
        </p>


        <p
          className="farms-selector-subtitle"
          style={{
            marginTop: "2px",
          }}
        >
          اختر المزرعة التي تريد الدخول إليها
        </p>

      </section>


      {/* ===================================================
          FARMS GRID
      =================================================== */}

      <section
        className="farms-grid"
        aria-label="قائمة المزارع"
      >

        {normalizedFarms.map((farm) => (

          <button
            key={farm.__displayId}
            type="button"
            className="farm-choice"
            onClick={() =>
              openFarm(farm)
            }
            aria-label={
              `فتح ${farm.__displayName}`
            }
          >


            {/* =============================================
                NUMBER
            ============================================= */}

            <span
              className="farm-choice-number"
            >
              {farm.__number}
            </span>


            {/* =============================================
                LABEL
            ============================================= */}

            <span
              className="farm-choice-label"
            >
              مزرعة
            </span>


            {/* =============================================
                FARM NAME
            ============================================= */}

            <span
              className="farm-choice-name"
            >
              {farm.__displayName}
            </span>


          </button>

        ))}

      </section>


    </main>

  );

}
