// src/pages/Farms.jsx

import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FarmContext,
} from "../context/FarmContext";

import useFarms from "../hooks/useFarms";


// =========================================================
// Farm Services
// =========================================================

const FARM_SERVICES = [

  {
    key: "fertilizers",
    icon: "🧪",
    label: "الأسمدة",
    path: "/fertilizers",
  },

  {
    key: "expenses",
    icon: "💰",
    label: "المصروفات",
    path: "/expenses",
  },

  {
    key: "weather",
    icon: "☁️",
    label: "الطقس",
    path: "/weather",
  },

  {
    key: "map",
    icon: "🗺️",
    label: "الخريطة",
    path: "/map",
  },

  {
    key: "engineer",
    icon: "👨‍🌾",
    label: "المستشار الزراعي",
    path: "/engineer",
  },

  {
    key: "irrigation",
    icon: "💧",
    label: "الري",
    path: "/irrigation",
  },

  {
    key: "crops",
    icon: "🌱",
    label: "المحاصيل",
    path: "/crops",
  },

  {
    key: "diseases",
    icon: "🦠",
    label: "الأمراض",
    path: "/diseases",
  },

  {
    key: "harvest",
    icon: "🌽",
    label: "الحصاد",
    path: "/harvest",
  },

];


// =========================================================
// Farms Page
// =========================================================

export default function Farms() {

  const navigate = useNavigate();


  // =======================================================
  // Existing Farm Context
  // =======================================================

  const farmContext =
    useContext(FarmContext);


  const farms =
    farmContext?.farms || [];


  // =======================================================
  // Existing useFarms Hook
  // =======================================================

  const {
    loadFarms,
    addFarm,
    updateFarm,
    deleteFarm,
    searchFarms,
    getStatistics,
  } = useFarms();


  // =======================================================
  // Selected Farm
  // =======================================================

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState(null);


  // =======================================================
  // Number farms
  // =======================================================

  const numberedFarms =
    useMemo(() => {

      return farms.map(
        (farm, index) => ({

          ...farm,

          farmNumber:
            index + 1,

        })
      );

    }, [farms]);


  // =======================================================
  // Open Farm
  // =======================================================

  const openFarm = (farm) => {

    setSelectedFarm(farm);

  };


  // =======================================================
  // Back to Farms
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


    /*
      نحفظ المزرعة المختارة حتى تستطيع
      الصفحات الأخرى معرفة المزرعة الحالية.
    */

    try {

      localStorage.setItem(
        "lavender_selected_farm",
        JSON.stringify(selectedFarm)
      );

    } catch (error) {

      console.error(
        "Unable to save selected farm:",
        error
      );

    }


    navigate(service.path);

  };


  // =======================================================
  // Empty State
  // =======================================================

  if (!selectedFarm && numberedFarms.length === 0) {

    return (

      <main className="farms-selector">

        <header className="farms-selector-header">

          <h1 className="farms-selector-title">
            المزارع
          </h1>

          <p className="farms-selector-subtitle">
            لم تتم إضافة أي مزرعة بعد
          </p>

        </header>


        <section className="card card-smart">

          <div className="card-body">

            لا توجد مزارع لعرضها حاليًا.

          </div>

        </section>

      </main>

    );

  }


  // =======================================================
  // Farm Services Screen
  // =======================================================

  if (selectedFarm) {

    return (

      <main className="farm-services-page">

        <button
          type="button"
          className="farms-back-button"
          onClick={backToFarms}
        >
          ← العودة إلى المزارع
        </button>


        <header className="farm-services-header">

          <div className="farm-services-number">

            {selectedFarm.farmNumber ||
              numberedFarms.find(
                farm =>
                  farm.id === selectedFarm.id
              )?.farmNumber ||
              "•"}

          </div>


          <h1 className="farm-services-title">

            {selectedFarm.name ||
              "مزرعتي"}

          </h1>


          <p className="farm-services-subtitle">

            اختر الخدمة التي تريدها لهذه المزرعة

          </p>

        </header>


        <section
          className="farm-services-grid"
          aria-label="خدمات المزرعة"
        >

          {FARM_SERVICES.map(
            (service) => (

              <button
                key={service.key}
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


                <span className="farm-service-name">

                  {service.label}

                </span>

              </button>

            )
          )}

        </section>

      </main>

    );

  }


  // =======================================================
  // Farms Selector
  // =======================================================

  return (

    <main className="farms-selector">

      <header className="farms-selector-header">

        <h1 className="farms-selector-title">
          مزارعي
        </h1>

        <p className="farms-selector-subtitle">
          اختر المزرعة التي تريد الدخول إليها
        </p>

      </header>


      <section
        className="farms-grid"
        aria-label="المزارع"
      >

        {numberedFarms.map(
          (farm) => (

            <button
              key={
                farm.id ||
                farm._id ||
                farm.farmNumber
              }
              type="button"
              className="farm-choice"
              onClick={() =>
                openFarm(farm)
              }
              aria-label={
                `فتح ${farm.name || "المزرعة"}`
              }
            >

              <span
                className="farm-choice-number"
                aria-hidden="true"
              >

                {farm.farmNumber}

              </span>


              <span className="farm-choice-label">

                مزرعة

              </span>


              <span className="farm-choice-name">

                {farm.name ||
                  "مزرعة بدون اسم"}

              </span>

            </button>

          )
        )}

      </section>

    </main>

  );
}
