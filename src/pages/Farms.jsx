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
// LAVENDER — Farms
// المزرعة الذكية
//
// 1. عرض المزارع في شبكة 3 × N
// 2. كل مزرعة لها رقم واسم المستخدم
// 3. الضغط على المزرعة يفتح خدماتها
// 4. الخدمات في شبكة 3 × N
// 5. تمرير farmId إلى الصفحة المطلوبة
// =========================================================


const FARM_SERVICES = [

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


// =========================================================
// Component
// =========================================================

export default function Farms() {

  const navigate = useNavigate();


  // =======================================================
  // Farms
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
  // Load
  // =======================================================

  useEffect(() => {

    if (
      typeof loadFarms === "function"
    ) {

      loadFarms();

    }

  }, [loadFarms]);


  // =======================================================
  // Normalize
  //
  // لا نعدل بيانات المزرعة الأصلية.
  // نضيف فقط بيانات العرض.
  // =======================================================

  const normalizedFarms = useMemo(() => {

    if (!Array.isArray(farms)) {

      return [];

    }


    return farms.map(
      (farm, index) => {

        const id =
          farm?.id ??
          farm?._id ??
          farm?.farmId ??
          `farm-${index + 1}`;


        const name =
          farm?.name ??
          farm?.farmName ??
          farm?.title ??
          `مزرعة ${index + 1}`;


        return {

          ...farm,

          __displayId:
            id,

          __displayName:
            name,

          __number:
            index + 1,

        };

      }
    );

  }, [farms]);


  // =======================================================
  // Open Farm
  // =======================================================

  const openFarm = (
    farm
  ) => {

    setSelectedFarm(
      farm
    );

  };


  // =======================================================
  // Back
  // =======================================================

  const backToFarms = () => {

    setSelectedFarm(
      null
    );

  };


  // =======================================================
  // Open Service
  // =======================================================

  const openService = (
    service
  ) => {

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

  if (
    loading &&
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

          <div className="farms-selector-symbol">
            🌱
          </div>

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <div className="farms-selector-brand">
            LAVENDER
          </div>

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

          <div className="farms-selector-symbol">
            🌾
          </div>

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <div className="farms-selector-brand">
            LAVENDER
          </div>

          <p className="farms-selector-subtitle">
            تعذر تحميل المزارع
          </p>

        </section>


        <section className="farms-empty-card">

          <div className="farms-empty-icon">
            ⚠️
          </div>

          <h2>
            حدث خطأ
          </h2>

          <p>
            تعذر تحميل بيانات المزارع حاليًا.
          </p>

          <button
            type="button"
            className="farms-retry-button"
            onClick={() =>
              loadFarms?.()
            }
          >
            إعادة المحاولة
          </button>

        </section>

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

          <div className="farms-selector-symbol">
            🌱
          </div>

          <h1 className="farms-selector-title">
            المزرعة الذكية
          </h1>

          <div className="farms-selector-brand">
            LAVENDER
          </div>

          <div className="farms-selector-section-title">
            مزارعي
          </div>

          <p className="farms-selector-subtitle">
            اختر المزرعة التي تريد الدخول إليها
          </p>

        </section>


        <section className="farms-empty-card">

          <div className="farms-empty-icon">
            🌱
          </div>

          <h2>
            لا توجد مزارع بعد
          </h2>

          <p>
            أضف مزرعتك لتظهر هنا.
          </p>

        </section>

      </main>

    );

  }


  // =========================================================
  // FARM SERVICES
  // =========================================================

  if (selectedFarm) {

    return (

      <main
        className="farm-services-page"
        dir="rtl"
      >


        {/* ===============================================
            TOP
        =============================================== */}

        <header
          className="farm-services-header"
        >

          <button
            type="button"
            className="farms-back-button"
            onClick={
              backToFarms
            }
            aria-label="العودة إلى المزارع"
          >
            ←
          </button>


          <div
            className="farm-services-number"
          >
            {selectedFarm.__number}
          </div>


          <div className="farm-services-label">
            مزرعة
          </div>


          <h1
            className="farm-services-title"
          >
            {selectedFarm.__displayName}
          </h1>


          <p
            className="farm-services-subtitle"
          >
            اختر الخدمة التي تريدها لهذه المزرعة
          </p>

        </header>


        {/* ===============================================
            SERVICES
        =============================================== */}

        <section
          className="farm-services-grid"
          aria-label="خدمات المزرعة"
        >

          {FARM_SERVICES.map(
            (service) => (

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

            )
          )}

        </section>


      </main>

    );

  }


  // =========================================================
  // FARMS SELECTOR
  // =========================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
    >


      {/* ===================================================
          BRAND / HEADER
      =================================================== */}

      <header
        className="farms-selector-header"
      >

        <div
          className="farms-selector-symbol"
          aria-hidden="true"
        >
          🌿
        </div>


        <h1
          className="farms-selector-title"
        >
          المزرعة الذكية
        </h1>


        <div
          className="farms-selector-brand"
        >
          LAVENDER
        </div>


        <div
          className="farms-selector-section-title"
        >
          مزارعي
        </div>


        <p
          className="farms-selector-subtitle"
        >
          اختر المزرعة التي تريد الدخول إليها
        </p>

      </header>


      {/* ===================================================
          FARM GRID
      =================================================== */}

      <section
        className="farms-grid"
        aria-label="قائمة المزارع"
      >

        {normalizedFarms.map(
          (farm) => (

            <button
              key={
                farm.__displayId
              }
              type="button"
              className="farm-choice"
              onClick={() =>
                openFarm(farm)
              }
              aria-label={
                `فتح ${farm.__displayName}`
              }
            >

              {/* NUMBER */}

              <span
                className="farm-choice-number"
                aria-hidden="true"
              >
                {farm.__number}
              </span>


              {/* FARM */}

              <span
                className="farm-choice-label"
              >
                مزرعة
              </span>


              {/* NAME */}

              <span
                className="farm-choice-name"
              >
                {farm.__displayName}
              </span>


            </button>

          )
        )}

      </section>


    </main>

  );

}
