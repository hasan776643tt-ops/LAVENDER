// =========================================================
// LAVENDER — مشروعي الزراعي
// src/pages/Crops.jsx
// =========================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import useFarms from "../hooks/useFarms.js";
import useCrops from "../hooks/useCrops.js";

// ---------------------------------------------------------
// البيانات الافتراضية
// ---------------------------------------------------------

const EMPTY_FORM = {
  farmId: "",
  projectName: "",
  plantType: "",
  seedType: "",

  country: "",
  governorate: "",
  city: "",
  village: "",

  /*
   * التاريخ نص حر بالكامل.
   */
  plantingDate: "",

  seedQuantity: "",
  fertilizerQuantity: "",
};

// ---------------------------------------------------------
// اقتراحات زراعية أولية
// ---------------------------------------------------------

const SEED_RECOMMENDATIONS = {
  حار: {
    قمح: [
      "شام 6",
      "شام 8",
      "أصناف قمح متحملة للحرارة",
    ],
    شعير: [
      "أصناف شعير مبكرة النضج",
      "أصناف شعير متحملة للجفاف",
    ],
    قطن: [
      "أصناف قطن متحملة للحرارة",
      "أصناف قطن ملائمة للمناطق الجافة",
    ],
    ذرة: [
      "هجن ذرة متحملة للحرارة",
      "هجن مبكرة النضج",
    ],
    default: [
      "أصناف مبكرة النضج",
      "أصناف متحملة للحرارة والجفاف",
    ],
  },

  معتدل: {
    قمح: [
      "شام 6",
      "شام 8",
      "أصناف قمح متوسطة الموسم",
    ],
    شعير: [
      "أصناف شعير ملائمة للمناخ المعتدل",
    ],
    عدس: [
      "أصناف عدس ملائمة للمناطق المعتدلة",
    ],
    حمص: [
      "أصناف حمص ملائمة للمناخ المعتدل",
    ],
    default: [
      "أصناف شامية ملائمة للمناخ المعتدل",
      "أصناف هجينة مناسبة للمنطقة",
    ],
  },

  بارد: {
    قمح: [
      "أصناف قمح متحملة للبرد",
      "أصناف شتوية",
    ],
    شعير: [
      "أصناف شعير شتوية",
      "أصناف متحملة للبرد",
    ],
    عدس: [
      "أصناف عدس شتوية",
    ],
    حمص: [
      "أصناف حمص متحملة للبرودة",
    ],
    default: [
      "أصناف شتوية",
      "أصناف متحملة للبرودة",
    ],
  },
};

// ---------------------------------------------------------
// تحديد المناخ
// ---------------------------------------------------------

function detectClimate({
  country,
  governorate,
  city,
  village,
}) {
  const text = [
    country,
    governorate,
    city,
    village,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();

  if (!text) {
    return "";
  }

  const hotRegions = [
    "الرقة",
    "تل أبيض",
    "سلوك",
    "الحسكة",
    "دير الزور",
    "الرصافة",
    "الطبقة",
    "الجزيرة",
  ];

  const coldRegions = [
    "القامشلي",
    "عين العرب",
    "كوباني",
    "مرعش",
    "أرضروم",
    "قيصري",
  ];

  if (
    coldRegions.some((name) =>
      text.includes(name)
    )
  ) {
    return "بارد";
  }

  if (
    hotRegions.some((name) =>
      text.includes(name)
    )
  ) {
    return "حار";
  }

  return "معتدل";
};

// =========================================================
// التاريخ — نص حر بالكامل
// =========================================================
//
// لا يوجد أي فرض لصيغة محددة.
//
// يقبل المستخدم ما يكتبه.
//
// أمثلة:
//
// 15.5.2024
// 15-5-2024
// 15/5/2024
// 15 5 2024
// 1.1.2027
// 2 2 2024
//
// والأهم:
//
// إذا لم يستطع النظام فهم الصيغة لحساب العمر،
// فهذا لا يمنع حفظ المشروع.
//
// التاريخ نفسه يبقى محفوظاً كما كتبه المستخدم.
// =========================================================

function normalizeManualDate(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

// ---------------------------------------------------------
// تحويل أرقام عربية إلى أرقام إنجليزية
// ---------------------------------------------------------

function convertArabicDigits(value) {
  return String(value)
    .replace(/[٠-٩]/g, (digit) =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(
          digit,
        ),
      )
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(
          digit,
        ),
      )
    );
}

// ---------------------------------------------------------
// تحليل التاريخ فقط لحساب العمر
// ---------------------------------------------------------
//
// هذا التحليل لا يقرر هل التاريخ مقبول أم لا.
//
// الحفظ مستقل تماماً عنه.
//
// يدعم:
//
// 15/5/2024
// 15-5-2024
// 15.5.2024
// 15 5 2024
// 15 / 5 / 2024
// 15 - 5 - 2024
// 15 . 5 . 2024
//
// كما يدعم الأرقام العربية.
// ---------------------------------------------------------

function parseManualDate(value) {
  let text =
    normalizeManualDate(value);

  if (!text) {
    return null;
  }

  text =
    convertArabicDigits(text);

  /*
   * تحويل جميع الفواصل المحتملة
   * إلى مسافة واحدة.
   */
  text = text.replace(
    /[\/\-.]+/g,
    " ",
  );

  /*
   * إزالة المسافات الزائدة.
   */
  text =
    text.trim().replace(
      /\s+/g,
      " ",
    );

  /*
   * نبحث عن ثلاثة أرقام:
   *
   * اليوم
   * الشهر
   * السنة
   *
   * ولا نفرض أن تكون الفواصل
   * بشكل معين.
   */
  const match =
    text.match(
      /^(\d{1,2})\s+(\d{1,2})\s+(\d{1,4})$/,
    );

  if (!match) {
    return null;
  }

  const day =
    Number(match[1]);

  const month =
    Number(match[2]);

  const year =
    Number(match[3]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return null;
  }

  /*
   * حساب العمر يحتاج سنة كاملة
   * قابلة للفهم.
   */
  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day,
    );

  /*
   * التأكد من صحة التاريخ
   * فقط لأجل حساب العمر.
   */
  if (
    date.getFullYear() !== year ||
    date.getMonth() !==
      month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    day,
    month,
    year,
    date,
  };
}

// ---------------------------------------------------------
// حساب عمر النبات
// ---------------------------------------------------------

function calculatePlantAge(
  plantingDate,
) {
  const parsed =
    parseManualDate(
      plantingDate,
    );

  /*
   * إذا كانت الصيغة غير مفهومة،
   * لا نرفض المشروع.
   *
   * فقط لا نحسب العمر.
   */
  if (!parsed) {
    return "";
  }

  const today =
    new Date();

  const start =
    new Date(
      parsed.year,
      parsed.month - 1,
      parsed.day,
    );

  const current =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

  if (start > current) {
    return "لم تبدأ الزراعة بعد";
  }

  let years =
    current.getFullYear() -
    start.getFullYear();

  let months =
    current.getMonth() -
    start.getMonth();

  let days =
    current.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth =
      new Date(
        current.getFullYear(),
        current.getMonth(),
        0,
      );

    days +=
      previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];

  if (years > 0) {
    parts.push(
      `${years} سنة`,
    );
  }

  if (months > 0) {
    parts.push(
      `${months} شهر`,
    );
  }

  if (days > 0) {
    parts.push(
      `${days} يوم`,
    );
  }

  if (parts.length === 0) {
    return "0 يوم";
  }

  return parts.join(" و ");
}

// ---------------------------------------------------------
// استخراج اسم المزرعة
// ---------------------------------------------------------

function getFarmName(farm) {
  if (!farm) {
    return "";
  }

  return (
    farm.name ||
    farm.farmName ||
    farm.title ||
    ""
  );
}

// =========================================================
// الصفحة
// =========================================================

export default function Crops() {
  const [searchParams] =
    useSearchParams();

  const farmIdFromUrl =
    searchParams.get(
      "farmId",
    ) || "";

  const {
    farms = [],
    loading: farmsLoading,
  } = useFarms();

  const {
    crops = [],
    loading: cropsLoading,
    addCrop,
    deleteCrop,
  } = useCrops();

  const [form, setForm] =
    useState({
      ...EMPTY_FORM,
      farmId:
        farmIdFromUrl,
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // -------------------------------------------------------
  // إذا جاء farmId من الرابط
  // -------------------------------------------------------

  useEffect(() => {
    if (!farmIdFromUrl) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      farmId:
        farmIdFromUrl,
    }));
  }, [
    farmIdFromUrl,
  ]);

  // -------------------------------------------------------
  // المزرعة المختارة
  // -------------------------------------------------------

  const selectedFarm =
    useMemo(() => {
      return farms.find(
        (farm) =>
          String(
            farm.id ??
              farm._id ??
              farm.farmId,
          ) ===
          String(
            form.farmId,
          ),
      );
    }, [
      farms,
      form.farmId,
    ]);

  // -------------------------------------------------------
  // المناخ
  // -------------------------------------------------------

  const climate =
    useMemo(() => {
      return detectClimate({
        country:
          form.country,
        governorate:
          form.governorate,
        city:
          form.city,
        village:
          form.village,
      });
    }, [
      form.country,
      form.governorate,
      form.city,
      form.village,
    ]);

  // -------------------------------------------------------
  // التوصيات
  // -------------------------------------------------------

  const recommendations =
    useMemo(() => {
      if (
        !climate ||
        !form.plantType
      ) {
        return [];
      }

      const climateRecommendations =
        SEED_RECOMMENDATIONS[
          climate
        ];

      if (
        !climateRecommendations
      ) {
        return [];
      }

      return (
        climateRecommendations[
          form.plantType
        ] ||
        climateRecommendations.default ||
        []
      );
    }, [
      climate,
      form.plantType,
    ]);

  // -------------------------------------------------------
  // عمر النبات
  // -------------------------------------------------------

  const plantAge =
    useMemo(() => {
      return calculatePlantAge(
        form.plantingDate,
      );
    }, [
      form.plantingDate,
    ]);

  // -------------------------------------------------------
  // تغيير الحقول
  // -------------------------------------------------------

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name ===
        "plantingDate"
          ? normalizeManualDate(
              value,
            )
          : value,
    }));

    setMessage("");
    setError("");
  }

  // -------------------------------------------------------
  // اختيار توصية
  // -------------------------------------------------------

  function chooseRecommendation(
    seed,
  ) {
    setForm((previous) => ({
      ...previous,
      seedType: seed,
    }));

    setMessage(
      `تم اختيار البذار المقترح: ${seed}`,
    );
  }

  // =======================================================
  // حفظ المشروع الزراعي
  // =======================================================

  async function handleSubmit(
    event,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.farmId) {
      setError(
        "يرجى اختيار المزرعة.",
      );
      return;
    }

    if (
      !form.projectName.trim()
    ) {
      setError(
        "يرجى كتابة اسم المشروع الزراعي.",
      );
      return;
    }

    if (
      !form.plantType.trim()
    ) {
      setError(
        "يرجى كتابة نوع النبات المزروع.",
      );
      return;
    }

    if (
      !form.seedType.trim()
    ) {
      setError(
        "يرجى كتابة أو اختيار نوع البذار.",
      );
      return;
    }

    if (!form.country.trim()) {
      setError(
        "يرجى كتابة الدولة.",
      );
      return;
    }

    if (
      !form.governorate.trim()
    ) {
      setError(
        "يرجى كتابة المحافظة.",
      );
      return;
    }

    if (!form.city.trim()) {
      setError(
        "يرجى كتابة المدينة.",
      );
      return;
    }

    if (
      !form.village.trim()
    ) {
      setError(
        "يرجى كتابة القرية أو البلدة.",
      );
      return;
    }

    /*
     * =====================================================
     * لا يوجد أي تحقق من شكل التاريخ.
     *
     * هذا هو التغيير الأساسي.
     *
     * إذا كتب المستخدم:
     *
     * 15.5.2024
     * 15-5-2024
     * 15/5/2024
     * 15 5 2024
     * 1.1.2027
     * 2 2 2024
     *
     * كلها نصوص مقبولة.
     *
     * لا يوجد:
     *
     * parseManualDate() لمنع الحفظ
     *
     * ولا رسالة:
     *
     * "اكتب بهذا الشكل..."
     *
     * =====================================================
     */

    if (
      !form.plantingDate.trim()
    ) {
      setError(
        "يرجى إدخال تاريخ الزراعة.",
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * نحفظ النص كما كتبه المستخدم
       * تماماً.
       */
      const savedPlantingDate =
        form.plantingDate.trim();

      const payload = {
        farmId:
          form.farmId,

        projectName:
          form.projectName.trim(),

        name:
          form.projectName.trim(),

        plantType:
          form.plantType.trim(),

        seedType:
          form.seedType.trim(),

        country:
          form.country.trim(),

        governorate:
          form.governorate.trim(),

        city:
          form.city.trim(),

        village:
          form.village.trim(),

        /*
         * التاريخ الأصلي للمستخدم.
         *
         * لا تحويل.
         */
        plantingDate:
          savedPlantingDate,

        seedQuantity:
          form.seedQuantity === ""
            ? ""
            : Number(
                form.seedQuantity,
              ),

        fertilizerQuantity:
          form.fertilizerQuantity === ""
            ? ""
            : Number(
                form.fertilizerQuantity,
              ),

        climate,

        recommendations,
      };

      await addCrop(
        payload,
      );

      setMessage(
        "تم حفظ المشروع الزراعي بنجاح.",
      );

      setForm({
        ...EMPTY_FORM,
        farmId:
          form.farmId,
      });
    } catch (
      saveError
    ) {
      console.error(
        "LAVENDER — save crop error:",
        saveError,
      );

      setError(
        saveError?.message ||
          "حدث خطأ أثناء حفظ المشروع الزراعي.",
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------
  // حذف المشروع
  // -------------------------------------------------------

  async function handleDelete(
    crop,
  ) {
    const id =
      crop?.id ??
      crop?._id ??
      crop?.cropId;

    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        "هل تريد حذف هذا المشروع الزراعي؟",
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCrop(id);

      setMessage(
        "تم حذف المشروع الزراعي.",
      );
    } catch (
      deleteError
    ) {
      console.error(
        "LAVENDER — delete crop error:",
        deleteError,
      );

      setError(
        deleteError?.message ||
          "تعذر حذف المشروع الزراعي.",
      );
    }
  }

  // =======================================================
  // عرض الصفحة
  // =======================================================

  return (
    <main
      dir="rtl"
      className="lavender-crops-page"
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "16px",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            fontSize: "34px",
            marginBottom: "6px",
          }}
        >
          🌱
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "26px",
          }}
        >
          مشروعي الزراعي
        </h1>

        <p
          style={{
            marginTop: "7px",
            color: "#666",
          }}
        >
          تسجيل وإدارة المشروع الزراعي
        </p>
      </header>

      {message && (
        <div
          role="status"
          style={{
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "10px",
            background:
              "#e8f5e9",
            color:
              "#1b5e20",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "10px",
            background:
              "#ffebee",
            color:
              "#b71c1c",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
      >
        {/* =================================================
            1 — المزرعة والمشروع
        ================================================= */}

        <section
          style={cardStyle}
        >
          <SectionTitle>
            🏡 معلومات المشروع
          </SectionTitle>

          <Field label="المزرعة">
            <select
              name="farmId"
              value={
                form.farmId
              }
              onChange={
                handleChange
              }
              style={
                inputStyle
              }
              disabled={
                farmsLoading
              }
            >
              <option value="">
                اختر المزرعة
              </option>

              {farms.map(
                (farm) => {
                  const id =
                    farm.id ??
                    farm._id ??
                    farm.farmId;

                  return (
                    <option
                      key={id}
                      value={id}
                    >
                      {getFarmName(
                        farm,
                      )}
                    </option>
                  );
                },
              )}
            </select>

            {selectedFarm && (
              <small
                style={{
                  display:
                    "block",
                  marginTop:
                    "6px",
                  color:
                    "#555",
                }}
              >
                🏡 المزرعة
                المختارة:
                {" "}
                <strong>
                  {getFarmName(
                    selectedFarm,
                  )}
                </strong>
              </small>
            )}
          </Field>

          <Field label="🌱 اسم المشروع الزراعي">
            <input
              type="text"
              name="projectName"
              value={
                form.projectName
              }
              onChange={
                handleChange
              }
              placeholder="مثال: قمح الحقل الشرقي"
              style={
                inputStyle
              }
            />
          </Field>

          <Field label="🌾 نوع النبات المزروع">
            <input
              type="text"
              name="plantType"
              value={
                form.plantType
              }
              onChange={
                handleChange
              }
              placeholder="مثال: قمح، شعير، قطن، عدس"
              style={
                inputStyle
              }
            />
          </Field>

          <Field label="🌱 نوع البذار المختار">
            <input
              type="text"
              name="seedType"
              value={
                form.seedType
              }
              onChange={
                handleChange
              }
              placeholder="اكتب نوع أو صنف البذار"
              style={
                inputStyle
              }
            />
          </Field>
        </section>

        {/* =================================================
            2 — الموقع الكتابي
        ================================================= */}

        <section
          style={cardStyle}
        >
          <SectionTitle>
            🌍 موقع الحقل
          </SectionTitle>

          <Field label="الدولة">
            <input
              type="text"
              name="country"
              value={
                form.country
              }
              onChange={
                handleChange
              }
              placeholder="مثال: سوريا"
              style={
                inputStyle
              }
            />
          </Field>

          <Field label="المحافظة">
            <input
              type="text"
              name="governorate"
              value={
                form.governorate
              }
              onChange={
                handleChange
              }
              placeholder="مثال: الرقة"
              style={
                inputStyle
              }
            />
          </Field>

          <Field label="المدينة">
            <input
              type="text"
              name="city"
              value={
                form.city
              }
              onChange={
                handleChange
              }
              placeholder="مثال: تل أبيض"
              style={
                inputStyle
              }
            />
          </Field>

          <Field label="القرية / البلدة">
            <input
              type="text"
              name="village"
              value={
                form.village
              }
              onChange={
                handleChange
              }
              placeholder="مثال: سلوك"
              style={
                inputStyle
              }
            />
          </Field>
        </section>

        {/* =================================================
            3 — المناخ والتوصيات
        ================================================= */}

        <section
          style={cardStyle}
        >
          <SectionTitle>
            🌤️ المناخ والتوصيات
          </SectionTitle>

          <div
            style={{
              padding:
                "14px",
              borderRadius:
                "10px",
              background:
                "#f5f8f4",
              marginBottom:
                "12px",
            }}
          >
            <div
              style={{
                fontWeight:
                  "700",
                marginBottom:
                  "5px",
              }}
            >
              🌤️ المناخ
            </div>

            {climate ? (
              <div>
                {climate}

                <small
                  style={{
                    display:
                      "block",
                    marginTop:
                      "5px",
                    color:
                      "#666",
                  }}
                >
                  يعتمد التقدير على
                  المنطقة التي
                  كتبها المستخدم.
                </small>
              </div>
            ) : (
              <div
                style={{
                  color:
                    "#777",
                }}
              >
                اكتب الدولة
                والمحافظة
                والمدينة
                والقرية لعرض
                التقدير.
              </div>
            )}
          </div>

          {recommendations.length >
            0 && (
            <div>
              <div
                style={{
                  fontWeight:
                    "700",
                  marginBottom:
                    "8px",
                }}
              >
                💡 اقتراحات البذار
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "8px",
                }}
              >
                {recommendations.map(
                  (seed) => (
                    <button
                      key={
                        seed
                      }
                      type="button"
                      onClick={() =>
                        chooseRecommendation(
                          seed,
                        )
                      }
                      style={{
                        ...suggestionStyle,
                        textAlign:
                          "right",
                      }}
                    >
                      🌱{" "}
                      {seed}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </section>

        {/* =================================================
            4 — تاريخ الزراعة وعمر النبات
        ================================================= */}

        <section
          style={cardStyle}
        >
          <SectionTitle>
            📅 الزراعة وعمر النبات
          </SectionTitle>

          <Field label="📅 تاريخ الزراعة">
            <input
              type="text"
              name="plantingDate"
              value={
                form.plantingDate
              }
              onChange={
                handleChange
              }

              /*
               * لوحة أرقام في الهاتف
               * لكن لا يوجد type=date.
               */
              inputMode="numeric"

              autoComplete="off"

              /*
               * لا نضع pattern.
               * لا نضع min.
               * لا نضع max.
               * لا نضع أي قيد على الصيغة.
               */
              placeholder="اكتب تاريخ الزراعة بأي صيغة تريدها"

              style={
                inputStyle
              }
            />

            <small
              style={{
                display:
                  "block",
                marginTop:
                  "6px",
                color:
                  "#666",
              }}
            >
              اكتب تاريخ الزراعة
              بالطريقة التي تناسبك.
              مثال: 15.5.2024 أو
              15-5-2024 أو
              15/5/2024 أو
              15 5 2024.
            </small>
          </Field>

          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "10px",
              background:
                "#eef7ee",
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize:
                  "14px",
                color:
                  "#555",
                marginBottom:
                  "5px",
              }}
            >
              ⏳ عمر النبات
            </div>

            <strong
              style={{
                fontSize:
                  "22px",
              }}
            >
              {plantAge ||
                "سيظهر تلقائياً عند إمكانية قراءة التاريخ"}
            </strong>
          </div>
        </section>

        {/* =================================================
            5 — الكميات
        ================================================= */}

        <section
          style={cardStyle}
        >
          <SectionTitle>
            🌱 الكميات المستخدمة
          </SectionTitle>

          <Field label="🌱 كمية البذار">
            <input
              type="number"
              name="seedQuantity"
              value={
                form.seedQuantity
              }
              onChange={
                handleChange
              }
              min="0"
              step="0.01"
              placeholder="مثال: 150"
              style={
                inputStyle
              }
            />

            <small
              style={{
                display:
                  "block",
                marginTop:
                  "5px",
                color:
                  "#777",
              }}
            >
              الكمية المستخدمة
              في الحقل.
            </small>
          </Field>

          <Field label="🧪 كمية السماد">
            <input
              type="number"
              name="fertilizerQuantity"
              value={
                form.fertilizerQuantity
              }
              onChange={
                handleChange
              }
              min="0"
              step="0.01"
              placeholder="مثال: 300"
              style={
                inputStyle
              }
            />

            <small
              style={{
                display:
                  "block",
                marginTop:
                  "5px",
                color:
                  "#777",
              }}
            >
              الكمية المستخدمة
              في الحقل.
            </small>
          </Field>
        </section>

        {/* =================================================
            حفظ
        ================================================= */}

        <button
          type="submit"
          disabled={
            saving
          }
          style={{
            width:
              "100%",
            border:
              0,
            borderRadius:
              "12px",
            padding:
              "15px",
            fontSize:
              "17px",
            fontWeight:
              "700",
            cursor:
              saving
                ? "not-allowed"
                : "pointer",
            opacity:
              saving
                ? 0.7
                : 1,
            marginBottom:
              "20px",
          }}
        >
          {saving
            ? "جاري الحفظ..."
            : "💾 حفظ المشروع الزراعي"}
        </button>
      </form>

      {/* =================================================
          المشاريع المسجلة
      ================================================= */}

      <section
        style={cardStyle}
      >
        <SectionTitle>
          🌱 مشاريعي الزراعية
        </SectionTitle>

        {cropsLoading ? (
          <p>
            جاري تحميل المشاريع...
          </p>
        ) : crops.length ===
          0 ? (
          <p
            style={{
              textAlign:
                "center",
              color:
                "#777",
            }}
          >
            لا توجد مشاريع
            زراعية مسجلة.
          </p>
        ) : (
          <div
            style={{
              display:
                "grid",
              gap:
                "12px",
            }}
          >
            {crops.map(
              (crop) => {
                const id =
                  crop.id ??
                  crop._id ??
                  crop.cropId;

                /*
                 * نعرض النص المحفوظ
                 * كما هو.
                 */
                const date =
                  crop.plantingDate ||
                  "";

                return (
                  <article
                    key={id}
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "12px",
                      padding:
                        "14px",
                    }}
                  >
                    <h3
                      style={{
                        marginTop:
                          0,
                      }}
                    >
                      🌱{" "}
                      {crop.projectName ||
                        crop.name ||
                        "مشروع زراعي"}
                    </h3>

                    <InfoRow
                      label="🏡 المزرعة"
                      value={
                        getFarmName(
                          farms.find(
                            (
                              farm,
                            ) =>
                              String(
                                farm.id ??
                                  farm._id ??
                                  farm.farmId,
                              ) ===
                              String(
                                crop.farmId,
                              ),
                          ),
                        ) ||
                        crop.farmName ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="🌾 النبات"
                      value={
                        crop.plantType ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="🌱 البذار"
                      value={
                        crop.seedType ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="🌍 الموقع"
                      value={[
                        crop.country,
                        crop.governorate,
                        crop.city,
                        crop.village,
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(
                          " - ",
                        ) ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="🌤️ المناخ"
                      value={
                        crop.climate ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="📅 تاريخ الزراعة"
                      value={
                        date || "-"
                      }
                    />

                    <InfoRow
                      label="⏳ العمر"
                      value={
                        calculatePlantAge(
                          date,
                        ) ||
                        "-"
                      }
                    />

                    <InfoRow
                      label="🌱 كمية البذار"
                      value={
                        crop.seedQuantity ===
                          "" ||
                        crop.seedQuantity ==
                          null
                          ? "-"
                          : `${crop.seedQuantity}`
                      }
                    />

                    <InfoRow
                      label="🧪 كمية السماد"
                      value={
                        crop.fertilizerQuantity ===
                          "" ||
                        crop.fertilizerQuantity ==
                          null
                          ? "-"
                          : `${crop.fertilizerQuantity}`
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          crop,
                        )
                      }
                      style={{
                        width:
                          "100%",
                        marginTop:
                          "12px",
                        padding:
                          "10px",
                        borderRadius:
                          "9px",
                        border:
                          "1px solid #e0a0a0",
                        background:
                          "#fff5f5",
                        cursor:
                          "pointer",
                      }}
                    >
                      🗑️ حذف المشروع
                    </button>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </main>
  );
}

// =========================================================
// Components
// =========================================================

function SectionTitle({
  children,
}) {
  return (
    <h2
      style={{
        fontSize:
          "19px",
        marginTop:
          0,
        marginBottom:
          "15px",
      }}
    >
      {children}
    </h2>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div
      style={{
        marginBottom:
          "14px",
      }}
    >
      <label
        style={{
          display:
            "block",
          fontWeight:
            "700",
          marginBottom:
            "7px",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div
      style={{
        display:
          "flex",
        justifyContent:
          "space-between",
        gap:
          "12px",
        padding:
          "8px 0",
        borderBottom:
          "1px solid #eee",
      }}
    >
      <span
        style={{
          fontWeight:
            "600",
        }}
      >
        {label}
      </span>

      <span
        style={{
          textAlign:
            "left",
          color:
            "#555",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// =========================================================
// Styles
// =========================================================

const cardStyle = {
  background:
    "#fff",
  border:
    "1px solid #e5e5e5",
  borderRadius:
    "14px",
  padding:
    "16px",
  marginBottom:
    "16px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    "1px solid #ccc",
  borderRadius:
    "10px",
  padding:
    "12px",
  fontSize:
    "16px",
  background:
    "#fff",
};

const suggestionStyle = {
  width:
    "100%",
  padding:
    "11px 12px",
  borderRadius:
    "10px",
  border:
    "1px solid #d5e4d5",
  background:
    "#f7fbf7",
  cursor:
    "pointer",
  fontSize:
    "15px",
};
