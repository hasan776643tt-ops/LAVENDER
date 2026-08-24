// src/pages/Farms.jsx

import {
  useContext,
  useState,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FarmContext,
} from "../context/FarmContext";

import Card from "../components/Card";
import Button from "../components/Button";


// =========================================================
// Farm Page
// =========================================================

export default function Farms() {

  const navigate =
    useNavigate();


  const {
    farms = [],
    farmActions,
  } =
    useContext(FarmContext);


  // =======================================================
  // Empty Form
  // =======================================================

  const emptyForm = {

    name: "",
    owner: "",
    area: "",
    location: "",
    latitude: "",
    longitude: "",
    cropType: "",
    irrigationType: "",
    plantingDate: "",
    notes: "",

  };


  // =======================================================
  // State
  // =======================================================

  const [
    form,
    setForm,
  ] = useState(
    emptyForm
  );


  const [
    editId,
    setEditId,
  ] = useState(null);


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    openedFarmId,
    setOpenedFarmId,
  ] = useState(null);


  // =======================================================
  // Change Handler
  // =======================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({

        ...previous,

        [name]:
          value,

      })
    );

  };


  // =======================================================
  // GPS
  // =======================================================

  const getCurrentLocation =
    () => {

      if (
        !navigator.geolocation
      ) {

        alert(
          "GPS غير مدعوم في هذا الجهاز."
        );

        return;

      }


      navigator.geolocation.getCurrentPosition(

        (position) => {

          const {
            latitude,
            longitude,
          } =
            position.coords;


          setForm(
            (previous) => ({

              ...previous,

              latitude:
                latitude,

              longitude:
                longitude,

              location:
                `${latitude}, ${longitude}`,

            })
          );

        },

        () => {

          alert(
            "تعذر تحديد موقع المزرعة."
          );

        },

        {

          enableHighAccuracy:
            true,

          timeout:
            15000,

          maximumAge:
            0,

        }

      );

    };


  // =======================================================
  // Reset Form
  // =======================================================

  const clearForm = () => {

    setForm(
      emptyForm
    );

    setEditId(
      null
    );

  };


  // =======================================================
  // Save Farm
  // =======================================================

  const saveFarm = () => {

    if (
      !form.name ||
      !form.owner
    ) {

      alert(
        "يرجى كتابة اسم المزرعة واسم المالك."
      );

      return;

    }


    if (editId) {

      farmActions.update(
        editId,
        form
      );

    } else {

      farmActions.create({

        ...form,

        created:
          new Date().toISOString(),

      });

    }


    clearForm();

  };


  // =======================================================
  // Edit Farm
  // =======================================================

  const editFarm = (
    farm
  ) => {

    setForm({

      name:
        farm.name || "",

      owner:
        farm.owner || "",

      area:
        farm.area || "",

      location:
        farm.location || "",

      latitude:
        farm.latitude || "",

      longitude:
        farm.longitude || "",

      cropType:
        farm.cropType || "",

      irrigationType:
        farm.irrigationType || "",

      plantingDate:
        farm.plantingDate || "",

      notes:
        farm.notes || "",

    });


    setEditId(
      farm.id
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =======================================================
  // Search
  // =======================================================

  const filteredFarms =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {

        return farms;

      }


      return farms.filter(
        (farm) => {

          const name =
            String(
              farm.name || ""
            ).toLowerCase();


          const owner =
            String(
              farm.owner || ""
            ).toLowerCase();


          return (
            name.includes(value) ||
            owner.includes(value)
          );

        }
      );

    }, [
      farms,
      search,
    ]);


  // =======================================================
  // Toggle Farm
  // =======================================================

  const toggleFarm = (
    farmId
  ) => {

    setOpenedFarmId(
      (currentId) =>
        currentId === farmId
          ? null
          : farmId
    );

  };


  // =======================================================
  // Open Farm Module
  // =======================================================

  const openFarmModule = (
    path,
    farm
  ) => {

    /*
     * نحفظ المزرعة المختارة مؤقتًا
     * حتى تعرف الصفحات الأخرى أي مزرعة اختار المستخدم.
     */

    try {

      sessionStorage.setItem(
        "lavender_selected_farm",
        JSON.stringify({
          id: farm.id,
          name: farm.name,
        })
      );

    } catch {

      // لا نوقف التطبيق إذا كان sessionStorage غير متاح.

    }


    navigate(
      path
    );

  };


  // =======================================================
  // Render Module Button
  // =======================================================

  const ModuleButton = ({
    icon,
    label,
    path,
    farm,
  }) => (

    <button

      type="button"

      className="farm-module-button"

      onClick={() =>
        openFarmModule(
          path,
          farm
        )
      }

    >

      <span
        className="farm-module-icon"
      >
        {icon}
      </span>

      <span
        className="farm-module-label"
      >
        {label}
      </span>

    </button>

  );


  // =======================================================
  // UI
  // =======================================================

  return (

    <div
      className="farms-page"
    >

      {/* ===================================================
          Page Title
      ==================================================== */}

      <div
        className="farms-page-heading"
      >

        <h1>
          🌾 إدارة المزارع
        </h1>

        <p>
          اختر المزرعة التي تريد إدارة أعمالها
        </p>

      </div>


      {/* ===================================================
          Add / Edit Farm
      ==================================================== */}

      <Card

        title={
          editId
            ? "✏️ تعديل المزرعة"
            : "➕ إضافة مزرعة جديدة"
        }

      >

        <input
          name="name"
          placeholder="اسم المزرعة"
          value={
            form.name
          }
          onChange={
            handleChange
          }
        />


        <input
          name="owner"
          placeholder="اسم المالك"
          value={
            form.owner
          }
          onChange={
            handleChange
          }
        />


        <input
          name="area"
          type="number"
          placeholder="📏 المساحة بالدونم"
          value={
            form.area
          }
          onChange={
            handleChange
          }
        />


        <input
          name="location"
          placeholder="📍 موقع المزرعة"
          value={
            form.location
          }
          readOnly
        />


        <Button
          onClick={
            getCurrentLocation
          }
        >
          📍 تحديد موقع المزرعة
        </Button>


        <input
          name="cropType"
          placeholder="🌱 نوع المحصول"
          value={
            form.cropType
          }
          onChange={
            handleChange
          }
        />


        <input
          name="irrigationType"
          placeholder="💧 نوع الري"
          value={
            form.irrigationType
          }
          onChange={
            handleChange
          }
        />


        <input
          name="plantingDate"
          type="date"
          value={
            form.plantingDate
          }
          onChange={
            handleChange
          }
        />


        <textarea
          name="notes"
          placeholder="📝 ملاحظات"
          value={
            form.notes
          }
          onChange={
            handleChange
          }
        />


        <Button
          onClick={
            saveFarm
          }
        >

          {
            editId
              ? "💾 حفظ التعديل"
              : "🌱 إضافة المزرعة"
          }

        </Button>


        {editId && (

          <Button
            onClick={
              clearForm
            }
          >
            إلغاء التعديل
          </Button>

        )}

      </Card>


      {/* ===================================================
          Search
      ==================================================== */}

      <Card
        title="🔎 البحث عن مزرعة"
      >

        <input

          type="search"

          placeholder="اكتب اسم المزرعة أو المالك"

          value={
            search
          }

          onChange={
            (event) =>
              setSearch(
                event.target.value
              )
          }

        />

      </Card>


      {/* ===================================================
          Farms Count
      ==================================================== */}

      <div
        className="farms-count"
      >

        🚜 عدد المزارع:
        {" "}
        <strong>
          {filteredFarms.length}
        </strong>

      </div>


      {/* ===================================================
          Farms
      ==================================================== */}

      <div
        className="farms-list"
      >

        {filteredFarms.length === 0 ? (

          <Card>

            <div
              className="farms-empty"
            >

              🌱 لا توجد مزارع مطابقة للبحث.

            </div>

          </Card>

        ) : (

          filteredFarms.map(
            (farm, index) => {

              const isOpen =
                openedFarmId ===
                farm.id;


              return (

                <section

                  key={
                    farm.id
                  }

                  className={
                    isOpen
                      ? "farm-card farm-card-open"
                      : "farm-card"
                  }

                >

                  {/* =======================================
                      Farm Header
                  ======================================== */}

                  <button

                    type="button"

                    className="farm-card-main"

                    onClick={() =>
                      toggleFarm(
                        farm.id
                      )
                    }

                  >

                    <div
                      className="farm-card-icon"
                    >
                      🌾
                    </div>


                    <div
                      className="farm-card-info"
                    >

                      <h2>

                        {farm.name ||
                          `المزرعة ${index + 1}`}

                      </h2>


                      <p>

                        👤{" "}
                        {farm.owner ||
                          "مالك المزرعة"}

                      </p>


                      <div
                        className="farm-card-summary"
                      >

                        {farm.area && (

                          <span>
                            📏 {farm.area} دونم
                          </span>

                        )}


                        {farm.cropType && (

                          <span>
                            🌱 {farm.cropType}
                          </span>

                        )}

                      </div>

                    </div>


                    <div
                      className="farm-card-arrow"
                    >

                      {isOpen
                        ? "⌃"
                        : "⌄"}

                    </div>

                  </button>


                  {/* =======================================
                      Farm Details
                  ======================================== */}

                  {isOpen && (

                    <div
                      className="farm-card-content"
                    >

                      <div
                        className="farm-details"
                      >

                        {farm.location && (

                          <p>
                            📍{" "}
                            <strong>
                              الموقع:
                            </strong>{" "}
                            {farm.location}
                          </p>

                        )}


                        {farm.irrigationType && (

                          <p>
                            💧{" "}
                            <strong>
                              الري:
                            </strong>{" "}
                            {farm.irrigationType}
                          </p>

                        )}


                        {farm.plantingDate && (

                          <p>
                            📅{" "}
                            <strong>
                              تاريخ الزراعة:
                            </strong>{" "}
                            {farm.plantingDate}
                          </p>

                        )}


                        {farm.notes && (

                          <p>
                            📝{" "}
                            {farm.notes}
                          </p>

                        )}

                      </div>


                      {/* =====================================
                          Farm Modules
                      ====================================== */}

                      <h3
                        className="farm-options-title"
                      >
                        🌿 ماذا تريد أن تدير؟
                      </h3>


                      <div
                        className="farm-modules-grid"
                      >

                        <ModuleButton
                          icon="🌱"
                          label="المحاصيل"
                          path="/crops"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="💧"
                          label="الري"
                          path="/irrigation"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🧪"
                          label="الأسمدة"
                          path="/fertilizers"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🛡️"
                          label="المبيدات"
                          path="/pesticides"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🦠"
                          label="الأمراض"
                          path="/diseases"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🌤️"
                          label="الطقس"
                          path="/weather"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🗺️"
                          label="الخريطة"
                          path="/map"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="💰"
                          label="المصروفات"
                          path="/expenses"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="🌽"
                          label="الحصاد"
                          path="/harvest"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="📦"
                          label="المخزون"
                          path="/inventory"
                          farm={farm}
                        />


                        <ModuleButton
                          icon="👨‍🌾"
                          label="المرشد الزراعي"
                          path="/engineer"
                          farm={farm}
                        />

                      </div>


                      {/* =====================================
                          Farm Actions
                      ====================================== */}

                      <div
                        className="farm-card-actions"
                      >

                        <Button
                          onClick={() =>
                            editFarm(
                              farm
                            )
                          }
                        >
                          ✏️ تعديل
                        </Button>


                        <Button
                          onClick={() =>
                            farmActions.delete(
                              farm.id
                            )
                          }
                        >
                          🗑️ حذف
                        </Button>

                      </div>

                    </div>

                  )}

                </section>

              );

            }
          )

        )}

      </div>

    </div>

  );

}
