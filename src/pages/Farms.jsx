// src/pages/Farms.jsx

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useFarms from "../hooks/useFarms.js";


// =========================================================
// LAVENDER — FARMS
// Mobile Full Screen Farm Selector
// =========================================================


// =========================================================
// FARM SERVICES
// =========================================================

const FARM_SERVICES = [

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
    id: "fertilizers",
    icon: "🧪",
    title: "الأسمدة",
    path: "/fertilizers",
  },

  {
    id: "diseases",
    icon: "🦠",
    title: "الأمراض",
    path: "/diseases",
  },

  {
    id: "engineer",
    icon: "👨‍🌾",
    title: "المستشار الزراعي",
    path: "/engineer",
  },

  {
    id: "map",
    icon: "🗺️",
    title: "الخريطة",
    path: "/map",
  },

  {
    id: "harvest",
    icon: "🌽",
    title: "الحصاد",
    path: "/harvest",
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
    id: "inventory",
    icon: "📦",
    title: "المخزون",
    path: "/inventory",
  },

  {
    id: "pesticides",
    icon: "🛡️",
    title: "المبيدات",
    path: "/pesticides",
  },

  {
    id: "reports",
    icon: "📊",
    title: "التقارير",
    path: "/reports",
  },

];


// =========================================================
// HELPERS
// =========================================================

function getFarmId(
  farm,
  index
) {

  return (
    farm?.id ??
    farm?._id ??
    farm?.farmId ??
    `farm-${index + 1}`
  );

}


function getFarmName(
  farm,
  index
) {

  return (
    farm?.name ??
    farm?.farmName ??
    farm?.title ??
    `مزرعة ${index + 1}`
  );

}


// =========================================================
// COMPONENT
// =========================================================

export default function Farms() {

  const navigate =
    useNavigate();


  const {
    farms = [],
    loading,
    error,
    loadFarms,
  } = useFarms();


  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState(null);


  // =======================================================
  // NORMALIZE FARMS
  // =======================================================

  const normalizedFarms =
    useMemo(
      () => {

        if (
          !Array.isArray(farms)
        ) {

          return [];

        }

        return farms.map(
          (
            farm,
            index
          ) => ({

            ...farm,

            __displayId:
              getFarmId(
                farm,
                index
              ),

            __displayName:
              getFarmName(
                farm,
                index
              ),

            __number:
              index + 1,

          })
        );

      },
      [farms]
    );


  // =======================================================
  // SELECT FARM
  // =======================================================

  const openFarm = (
    farm
  ) => {

    setSelectedFarm(
      farm
    );

  };


  // =======================================================
  // BACK
  // =======================================================

  const backToFarms = () => {

    setSelectedFarm(
      null
    );

  };


  // =======================================================
  // OPEN SERVICE
  // =======================================================

  const openService = (
    service
  ) => {

    if (
      !selectedFarm
    ) {

      return;

    }


    const farmId =
      selectedFarm.__displayId;


    if (
      !farmId
    ) {

      return;

    }


    const separator =
      service.path.includes("?")
        ? "&"
        : "?";


    navigate(
      `${service.path}${separator}farmId=${encodeURIComponent(
        String(farmId)
      )}`
    );

  };


  // =======================================================
  // RETRY
  // =======================================================

  const retryLoad =
    async () => {

      if (
        typeof loadFarms !==
        "function"
      ) {

        return;

      }

      try {

        await loadFarms();

      } catch (
        err
      ) {

        console.error(
          "Failed to reload farms:",
          err
        );

      }

    };


  // =======================================================
  // LOADING
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

        <div
          className="farms-page-content"
        >

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
              مزارعي
            </h1>

            <div
              className="farms-selector-brand"
            >
              LAVENDER
            </div>

            <p
              className="farms-selector-subtitle"
            >
              جاري تحميل مزارعك...
            </p>

          </header>


          <section
            className="farms-grid"
            aria-label="تحميل المزارع"
          >

            {[1, 2, 3].map(
              (
                item
              ) => (

                <div
                  key={item}
                  className="farm-choice farm-choice-loading"
                >

                  <span
                    className="farm-choice-number"
                  >
                    …
                  </span>

                  <span
                    className="farm-choice-label"
                  >
                    مزرعة
                  </span>

                  <span
                    className="farm-choice-name"
                  >
                    جاري التحميل
                  </span>

                </div>

              )
            )}

          </section>

        </div>

      </main>

    );

  }


  // =======================================================
  // ERROR
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

        <div
          className="farms-page-content"
        >

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
              مزارعي
            </h1>

            <div
              className="farms-selector-brand"
            >
              LAVENDER
            </div>

            <p
              className="farms-selector-subtitle"
            >
              تعذر تحميل المزارع
            </p>

          </header>


          <section
            className="farms-empty-card"
          >

            <div
              className="farms-empty-icon"
              aria-hidden="true"
            >
              ⚠️
            </div>

            <h2>
              حدث خطأ أثناء تحميل المزارع
            </h2>

            <p>
              حاول تحميل البيانات مرة أخرى.
            </p>

            <button
              type="button"
              className="farms-retry-button"
              onClick={retryLoad}
            >
              إعادة المحاولة
            </button>

          </section>

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

        <div
          className="farms-page-content"
        >

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
              مزارعي
            </h1>

            <div
              className="farms-selector-brand"
            >
              LAVENDER
            </div>

            <p
              className="farms-selector-subtitle"
            >
              لا توجد مزارع مضافة حاليًا
            </p>

          </header>


          <section
            className="farms-empty-card"
          >

            <div
              className="farms-empty-icon"
              aria-hidden="true"
            >
              🌱
            </div>

            <h2>
              لا توجد مزارع بعد
            </h2>

            <p>
              أضف مزرعتك لتظهر هنا.
            </p>

          </section>

        </div>

      </main>

    );

  }


  // =======================================================
  // SELECTED FARM — SERVICES
  // =======================================================

  if (
    selectedFarm
  ) {

    return (

      <main
        className="farm-services-page"
        dir="rtl"
      >

        <div
          className="farms-page-content"
        >

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
              {
                selectedFarm.__number
              }
            </div>


            <div
              className="farm-services-label"
            >
              مزرعة
            </div>


            <h1
              className="farm-services-title"
            >
              {
                selectedFarm.__displayName
              }
            </h1>


            <p
              className="farm-services-subtitle"
            >
              مركز خدمات المزرعة
            </p>

          </header>


          <section
            className="farm-services-grid"
            aria-label="خدمات المزرعة"
          >

            {
              FARM_SERVICES.map(
                (
                  service
                ) => (

                  <button
                    key={
                      service.id
                    }
                    type="button"
                    className="farm-service-choice"
                    onClick={() =>
                      openService(
                        service
                      )
                    }
                    aria-label={
                      `فتح ${service.title}`
                    }
                  >

                    <span
                      className="farm-service-icon"
                      aria-hidden="true"
                    >
                      {
                        service.icon
                      }
                    </span>


                    <span
                      className="farm-service-name"
                    >
                      {
                        service.title
                      }
                    </span>

                  </button>

                )
              )
            }

          </section>

        </div>

      </main>

    );

  }


  // =======================================================
  // FARMS SELECTOR
  // =======================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
    >

      <div
        className="farms-page-content"
      >

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
            مزارعي
          </h1>


          <div
            className="farms-selector-brand"
          >
            LAVENDER
          </div>


          <p
            className="farms-selector-subtitle"
          >
            اختر المزرعة التي تريد الدخول إليها
          </p>

        </header>


        <section
          className="farms-selector-section"
        >

          <div
            className="farms-selector-section-heading"
          >

            <h2
              className="farms-selector-section-title"
            >
              مزارعك
            </h2>

            <span
              className="farms-count"
            >
              {normalizedFarms.length}
            </span>

          </div>


          <section
            className="farms-grid"
            aria-label="قائمة المزارع"
          >

            {
              normalizedFarms.map(
                (
                  farm
                ) => (

                  <button
                    key={
                      String(
                        farm.__displayId
                      )
                    }
                    type="button"
                    className="farm-choice"
                    onClick={() =>
                      openFarm(
                        farm
                      )
                    }
                    aria-label={
                      `فتح ${farm.__displayName}`
                    }
                  >

                    <span
                      className="farm-choice-number"
                      aria-hidden="true"
                    >
                      {
                        farm.__number
                      }
                    </span>


                    <span
                      className="farm-choice-label"
                    >
                      مزرعة
                    </span>


                    <span
                      className="farm-choice-name"
                    >
                      {
                        farm.__displayName
                      }
                    </span>


                    <span
                      className="farm-choice-arrow"
                      aria-hidden="true"
                    >
                      ←
                    </span>

                  </button>

                )
              )
            }


            <button
              type="button"
              className="farm-choice farm-choice-add"
              onClick={() =>
                navigate("/farms/new")
              }
              aria-label="إضافة مزرعة جديدة"
            >

              <span
                className="farm-choice-number"
                aria-hidden="true"
              >
                +
              </span>


              <span
                className="farm-choice-label"
              >
                إضافة
              </span>


              <span
                className="farm-choice-name"
              >
                مزرعة جديدة
              </span>

            </button>

          </section>

        </section>

      </div>

    </main>

  );

}
