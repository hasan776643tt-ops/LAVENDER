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
// الوضع الأول:
// اختيار المزرعة
//
// الوضع الثاني:
// خدمات المزرعة
//
// إضافة:
// إدارة وحذف المزارع من زر جانبي مستقل
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
    deleteFarm,
  } = useFarms();


  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState(null);


  const [
    showDeletePanel,
    setShowDeletePanel,
  ] = useState(false);


  const [
    farmToDelete,
    setFarmToDelete,
  ] = useState(null);


  const [
    deletingFarm,
    setDeletingFarm,
  ] = useState(false);


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
  // OPEN DELETE PANEL
  // =======================================================

  const openDeletePanel = () => {

    setFarmToDelete(
      null
    );

    setShowDeletePanel(
      true
    );

  };


  // =======================================================
  // CLOSE DELETE PANEL
  // =======================================================

  const closeDeletePanel = () => {

    if (
      deletingFarm
    ) {

      return;

    }


    setFarmToDelete(
      null
    );

    setShowDeletePanel(
      false
    );

  };


  // =======================================================
  // SELECT FARM FOR DELETE
  // =======================================================

  const selectFarmForDelete = (
    farm
  ) => {

    setFarmToDelete(
      farm
    );

  };


  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const confirmDeleteFarm = async () => {

    if (
      !farmToDelete
    ) {

      return;

    }


    if (
      typeof deleteFarm !==
      "function"
    ) {

      return;

    }


    const farmId =
      farmToDelete.__displayId;


    if (
      !farmId
    ) {

      return;

    }


    setDeletingFarm(
      true
    );


    try {

      const deleted =
        await deleteFarm(
          farmId
        );


      if (
        !deleted
      ) {

        throw new Error(
          "FARM_DELETE_FAILED"
        );

      }


      if (
        selectedFarm &&
        String(
          selectedFarm.__displayId
        ) ===
        String(
          farmId
        )
      ) {

        setSelectedFarm(
          null
        );

      }


      setFarmToDelete(
        null
      );

      setShowDeletePanel(
        false
      );


    } catch (
      err
    ) {

      console.error(
        "Failed to delete farm:",
        err
      );

      alert(
        "تعذر حذف المزرعة. حاول مرة أخرى."
      );

    } finally {

      setDeletingFarm(
        false
      );

    }

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
            DELETE MANAGER
        ================================================= */}

        <button
          type="button"
          className="farms-delete-manager-button"
          onClick={
            openDeletePanel
          }
        >
          🗑️ إدارة حذف المزارع
        </button>


        {/* =================================================
            DELETE PANEL
        ================================================= */}

        {
          showDeletePanel && (

            <section
              className="farms-delete-panel"
              aria-label="إدارة حذف المزارع"
            >

              <div
                className="farms-delete-panel-header"
              >

                <h2>
                  حذف مزرعة
                </h2>


                <button
                  type="button"
                  className="farms-delete-close-button"
                  onClick={
                    closeDeletePanel
                  }
                  disabled={
                    deletingFarm
                  }
                  aria-label="إغلاق"
                >
                  ✕
                </button>

              </div>


              <p
                className="farms-delete-panel-description"
              >
                اختر المزرعة التي تريد حذفها:
              </p>


              {
                normalizedFarms.length === 0 ? (

                  <p>
                    لا توجد مزارع مسجلة.
                  </p>

                ) : (

                  <div
                    className="farms-delete-list"
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
                            className={
                              `farms-delete-item ${
                                farmToDelete &&
                                String(
                                  farmToDelete.__displayId
                                ) ===
                                String(
                                  farm.__displayId
                                )
                                  ? "selected"
                                  : ""
                              }`
                            }
                            onClick={() =>
                              selectFarmForDelete(
                                farm
                              )
                            }
                            disabled={
                              deletingFarm
                            }
                          >

                            <span>
                              {
                                farm.__number
                              }
                            </span>


                            <strong>
                              {
                                farm.__displayName
                              }
                            </strong>


                            <span>
                              🗑️
                            </span>

                          </button>

                        )
                      )
                    }

                  </div>

                )
              }


              {
                farmToDelete && (

                  <div
                    className="farms-delete-confirm"
                  >

                    <p>
                      هل تريد حذف المزرعة:
                    </p>


                    <strong>
                      {
                        farmToDelete.__displayName
                      }
                    </strong>


                    <div
                      className="farms-delete-confirm-actions"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setFarmToDelete(
                            null
                          )
                        }
                        disabled={
                          deletingFarm
                        }
                      >
                        إلغاء
                      </button>


                      <button
                        type="button"
                        onClick={
                          confirmDeleteFarm
                        }
                        disabled={
                          deletingFarm
                        }
                      >
                        {
                          deletingFarm
                            ? "جاري الحذف..."
                            : "تأكيد الحذف"
                        }
                      </button>

                    </div>

                  </div>

                )
              }

            </section>

          )
        }


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
