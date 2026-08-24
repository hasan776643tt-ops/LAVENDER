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
// LAVENDER — Farms Page
// المزرعة الذكية
//
// Architecture:
//
// Farms.jsx
//    ↓
// useFarms.js
//    ↓
// farmService.js
//
// مسؤولية الصفحة:
// 1. عرض المزارع
// 2. اختيار مزرعة
// 3. عرض خدمات المزرعة المختارة
// 4. تمرير farmId للخدمة
//
// لا تستخدم FarmContext مباشرة.
// لا تستخدم farmService مباشرة.
// =========================================================


// =========================================================
// Farm Services
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
// Helpers
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
// Component
// =========================================================

export default function Farms() {

  const navigate =
    useNavigate();


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
  // Normalize Farms
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
          ) => {

            return {

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

            };

          }
        );

      },
      [farms]
    );


  // =======================================================
  // Select Farm
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
  // Retry
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

        <header
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
            جاري تحميل مزارعك...
          </p>

        </header>


        <section
          className="farms-grid"
          aria-label="تحميل المزارع"
        >

          {[1, 2, 3].map(
            (item) => (

              <div
                key={item}
                className="farm-choice"
                aria-hidden="true"
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

        <header
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
            تعذر تحميل المزارع
          </p>

        </header>


        <section
          className="card card-smart"
        >

          <div
            className="card-body"
            style={{
              textAlign: "center",
              padding: "25px 15px",
            }}
          >

            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
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
              className="farms-back-button"
              onClick={retryLoad}
            >
              إعادة المحاولة
            </button>

          </div>

        </section>

      </main>

    );

  }


  // =======================================================
  // Empty
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

        <header
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
          >
            لا توجد مزارع مضافة حاليًا
          </p>

        </header>


        <section
          className="card card-smart"
        >

          <div
            className="card-body"
            style={{
              textAlign: "center",
              padding: "30px 15px",
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

        </section>

      </main>

    );

  }


  // =======================================================
  // Selected Farm — Services
  // =======================================================

  if (
    selectedFarm
  ) {

    return (

      <main
        className="farm-services-page"
        dir="rtl"
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="farm-services-header"
        >

          <button
            type="button"
            className="farms-back-button"
            onClick={backToFarms}
            aria-label="العودة إلى المزارع"
          >
            ← العودة إلى المزارع
          </button>


          <div
            className="farm-services-number"
          >
            {
              selectedFarm.__number
            }
          </div>


          {/* تم تصحيح اسم الـ class هنا */}
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
            اختر الخدمة التي تريدها لهذه المزرعة
          </p>

        </header>


        {/* =================================================
            SERVICES
        ================================================= */}

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
                    `فتح ${service.title} لمزرعة ${selectedFarm.__displayName}`
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

      </main>

    );

  }


  // =======================================================
  // Farms Selector
  // =======================================================

  return (

    <main
      className="farms-selector"
      dir="rtl"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
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
        >
          اختر المزرعة التي تريد الدخول إليها
        </p>

      </header>


      {/* =================================================
          FARMS
      ================================================= */}

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

              </button>

            )
          )
        }

      </section>

    </main>

  );

}
