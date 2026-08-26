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
// =========================================================
// الصفحة الأولى للتطبيق
//
// /
// ↓
// Farms.jsx
//
// الوضع الأول:
// اختيار المزرعة
//
// الوضع الثاني:
// بعد الضغط على المزرعة → خدمات المزرعة
//
// التصميم:
// 3 أعمدة دائمًا
// 9 خانات على الأقل
// + إضافة مزارع بلا حد عملي
// =========================================================


// =========================================================
// FARM SERVICES
// =========================================================

const FARM_SERVICES = [

  {
    id: "crops",
    icon: "🌱",
    title: "المحاصيل",
    path: "/crops",
  },

  {
    id: "irrigation",
    icon: "💧",
    title: "الري",
    path: "/irrigation",
  },

  {
    id: "fertilizers",
    icon: "🧪",
    title: "الأسمدة",
    path: "/fertilizers",
  },

  {
    id: "diseases",
    icon: "🐛",
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
  // GRID SIZE
  // =======================================================
  //
  // نحافظ على 9 خانات على الأقل.
  //
  // إذا كان عدد المزارع أقل من 9:
  //
  // 1  2  3
  // 4  5  6
  // 7  8  9
  //       +
  //
  // إذا تجاوز المستخدم 9 مزارع:
  //
  // 1   2   3
  // 4   5   6
  // 7   8   9
  // 10  11  12
  // ...
  //       +
  //
  // الزر + يبقى دائمًا بعد آخر مزرعة.
  // =======================================================

  const farmSlotCount =
    Math.max(
      9,
      normalizedFarms.length
    );


  const farmSlots =
    Array.from(
      {
        length:
          farmSlotCount,
      },
      (
        _,
        index
      ) => {

        return (
          normalizedFarms[index]
          ?? null
        );

      }
    );


  // =======================================================
  // OPEN FARM
  // =======================================================

  const openFarm = (
    farm
  ) => {

    if (!farm) {

      navigate(
        "/farms/new"
      );

      return;

    }


    setSelectedFarm(
      farm
    );

  };


  // =======================================================
  // BACK TO FARMS
  // =======================================================

  const backToFarms = () => {

    setSelectedFarm(
      null
    );

  };


  // =======================================================
  // OPEN FARM SERVICE
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


            <p
              className="farms-selector-subtitle"
            >
              جاري تحميل مزارعك...
            </p>

          </header>


          <section
            className="farms-grid"
          >

            {
              Array.from(
                {
                  length: 9,
                },
                (
                  _,
                  index
                ) => (

                  <div
                    key={
                      `loading-${index + 1}`
                    }
                    className="farm-choice farm-choice-loading"
                  >

                    <span
                      className="farm-choice-number"
                    >
                      {index + 1}
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
              )
            }

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
              onClick={
                retryLoad
              }
            >
              إعادة المحاولة
            </button>

          </section>

        </div>

      </main>

    );

  }


  // =======================================================
  // SELECTED FARM
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
              خدمات وإدارة المزرعة
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
                  >

                    <span
                      className="farm-service-icon"
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
  // MAIN FARM SELECTOR
  // =======================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
    >

      <div
        className="farms-page-content"
      >

        {/* =================================================
            HEADER
        ================================================= */}

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


          <p
            className="farms-selector-subtitle"
          >
            اختر مزرعتك لإدارة جميع خدماتها
          </p>

        </header>


        {/* =================================================
            FARM SECTION
        ================================================= */}

        <section
          className="farms-selector-section"
        >

          <div
            className="farms-selector-section-heading"
          >

            <h2
              className="farms-selector-section-title"
            >
              مزارعي
            </h2>


            <span
              className="farms-count"
            >
              {
                normalizedFarms.length
              }
            </span>

          </div>


          {/* =================================================
              FARM GRID
              3 COLUMNS
              UNLIMITED PRACTICAL FARMS
          ================================================= */}

          <section
            className="farms-grid"
            aria-label="مزارع المستخدم"
          >

            {
              farmSlots.map(
                (
                  farm,
                  index
                ) => {

                  const number =
                    index + 1;


                  // =========================================
                  // EXISTING FARM
                  // =========================================

                  if (
                    farm
                  ) {

                    const farmId =
                      farm.__displayId;


                    return (

                      <button
                        key={
                          String(
                            farmId
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
                        >
                          {number}
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

                    );

                  }


                  // =========================================
                  // EMPTY SLOT
                  // =========================================

                  return (

                    <button
                      key={
                        `empty-${number}`
                      }
                      type="button"
                      className="farm-choice farm-choice-add"
                      onClick={() =>
                        navigate(
                          "/farms/new"
                        )
                      }
                      aria-label={
                        `إضافة مزرعة رقم ${number}`
                      }
                    >

                      <span
                        className="farm-choice-number"
                      >
                        {number}
                      </span>


                      <span
                        className="farm-choice-label"
                      >
                        مزرعة رقم
                      </span>


                      <span
                        className="farm-choice-name"
                      >
                        + أضف مزرعة
                      </span>

                    </button>

                  );

                }
              )
            }


            {/* =================================================
                ADD FARM BUTTON
                =================================================
                هذا الزر لا يدخل ضمن الحد 9.
                يبقى دائمًا بعد آخر خانة.
            ================================================= */}

            <button
              type="button"
              className="farm-choice farm-choice-add farm-choice-add-new"
              onClick={() =>
                navigate(
                  "/farms/new"
                )
              }
              aria-label="إضافة مزرعة جديدة"
            >

              <span
                className="farm-choice-number"
              >
                +
              </span>


              <span
                className="farm-choice-label"
              >
                مزرعة جديدة
              </span>


              <span
                className="farm-choice-name"
              >
                إضافة مزرعة
              </span>

            </button>

          </section>

        </section>

      </div>

    </main>

  );

}
