// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";

import {
  createError,
} from "../utils/errorHandler.js";


// =========================================================
// LAVENDER — CROP SERVICE
// =========================================================
//
// مسؤول عن:
//
// 1. CRUD للمحاصيل.
// 2. التحقق من بيانات المحصول.
// 3. تحديد المناخ التقريبي.
// 4. تقديم توصية أولية بالمحاصيل.
// 5. تقديم توصيات أصناف البذور.
// 6. ربط التوصية بالموقع الجغرافي.
// 7. عدم إجبار Crops.jsx على fieldId.
//
// ملاحظة مهمة:
//
// التوصيات الزراعية هنا طبقة بيانات أولية.
// لا يتم اعتبار أي صنف "الأفضل" بشكل مطلق
// إلا بعد توفر قاعدة أصناف موثوقة مرتبطة بالمنطقة.
//
// =========================================================


// =========================================================
// CLIMATE
// =========================================================

const CLIMATE = Object.freeze({

  cold: "باردة",

  moderate: "معتدلة",

  hot: "حارة",

});


// =========================================================
// CROP CATALOG
// =========================================================
//
// هذه القائمة هي طبقة التوصية الأساسية.
//
// crop:
// الاسم الداخلي للمحصول.
//
// name:
// الاسم الظاهر للمستخدم.
//
// climates:
// المناخات المناسبة مبدئيًا.
//
// varieties:
// الأصناف / الهجن المرتبطة بالمحصول.
//
// مهم:
// لا نضع وصف "الأفضل" إلا عندما توجد بيانات موثوقة
// للمنطقة المحددة.
//
// =========================================================

const CROP_CATALOG = Object.freeze([

  // -------------------------------------------------------
  // WHEAT
  // -------------------------------------------------------

  Object.freeze({

    id: "wheat",

    name: "قمح",

    climates: [
      "cold",
      "moderate",
    ],

    seasons: [
      "شتوي",
      "ربيعي",
    ],

    varieties: [

      Object.freeze({
        id: "wheat-winter-local",
        name: "قمح شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: [
          "باردة",
          "معتدلة",
        ],
        reason:
          "مناسب مبدئيًا للمناطق ذات الشتاء البارد أو المعتدل.",
      }),

      Object.freeze({
        id: "wheat-durum",
        name: "قمح قاسي",
        type: "صنف",
        season: "شتوي",
        suitability: [
          "معتدلة",
        ],
        reason:
          "خيار مبدئي للمناطق المعتدلة والجافة نسبيًا.",
      }),

      Object.freeze({
        id: "wheat-spring",
        name: "قمح ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: [
          "باردة",
          "معتدلة",
        ],
        reason:
          "يمكن أن يكون مناسبًا في المناطق التي تعتمد زراعة الربيع.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // BARLEY
  // -------------------------------------------------------

  Object.freeze({

    id: "barley",

    name: "شعير",

    climates: [
      "cold",
      "moderate",
    ],

    seasons: [
      "شتوي",
      "ربيعي",
    ],

    varieties: [

      Object.freeze({
        id: "barley-winter",
        name: "شعير شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: [
          "باردة",
          "معتدلة",
        ],
        reason:
          "مناسب مبدئيًا للمناطق الباردة والمعتدلة.",
      }),

      Object.freeze({
        id: "barley-spring",
        name: "شعير ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: [
          "باردة",
          "معتدلة",
        ],
        reason:
          "خيار للمناطق التي تناسبها زراعة الشعير الربيعي.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // MAIZE
  // -------------------------------------------------------

  Object.freeze({

    id: "maize",

    name: "ذرة",

    climates: [
      "moderate",
      "hot",
    ],

    seasons: [
      "ربيعي",
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "maize-hybrid",
        name: "ذرة هجينة",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: [
          "معتدلة",
          "حارة",
        ],
        reason:
          "الهجن قد تكون مناسبة للمناطق الدافئة عند توفر المياه والإدارة المناسبة.",
      }),

      Object.freeze({
        id: "maize-early",
        name: "ذرة مبكرة النضج",
        type: "صنف",
        season: "ربيعي / صيفي",
        suitability: [
          "معتدلة",
          "حارة",
        ],
        reason:
          "قد تكون مفيدة في المناطق التي تحتاج إلى فترة نمو أقصر.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // COTTON
  // -------------------------------------------------------

  Object.freeze({

    id: "cotton",

    name: "قطن",

    climates: [
      "hot",
      "moderate",
    ],

    seasons: [
      "ربيعي",
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "cotton-upland",
        name: "قطن Upland",
        type: "مجموعة أصناف",
        season: "ربيعي / صيفي",
        suitability: [
          "حارة",
          "معتدلة",
        ],
        reason:
          "مجموعة قطن واسعة الانتشار، لكن اختيار الصنف النهائي يجب أن يعتمد على المنطقة ومصدر البذور.",
      }),

      Object.freeze({
        id: "cotton-early",
        name: "قطن مبكر النضج",
        type: "صنف",
        season: "ربيعي",
        suitability: [
          "حارة",
          "معتدلة",
        ],
        reason:
          "قد يناسب المناطق التي يكون فيها طول الموسم الزراعي محدودًا.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // SUNFLOWER
  // -------------------------------------------------------

  Object.freeze({

    id: "sunflower",

    name: "عباد الشمس",

    climates: [
      "moderate",
      "hot",
    ],

    seasons: [
      "ربيعي",
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "sunflower-hybrid",
        name: "عباد الشمس الهجين",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: [
          "معتدلة",
          "حارة",
        ],
        reason:
          "خيار مبدئي للمناطق الدافئة مع توفر الظروف المناسبة.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // SORGHUM
  // -------------------------------------------------------

  Object.freeze({

    id: "sorghum",

    name: "سورغم",

    climates: [
      "hot",
      "moderate",
    ],

    seasons: [
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "sorghum-grain",
        name: "سورغم حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: [
          "حارة",
          "معتدلة",
        ],
        reason:
          "يتحمل الحرارة نسبيًا ويمكن أن يكون خيارًا للمناطق الدافئة.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // MILLET
  // -------------------------------------------------------

  Object.freeze({

    id: "millet",

    name: "دخن",

    climates: [
      "hot",
    ],

    seasons: [
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "millet-grain",
        name: "دخن حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: [
          "حارة",
        ],
        reason:
          "يتحمل الحرارة والجفاف نسبيًا.",
      }),

    ],

  }),


  // -------------------------------------------------------
  // SESAME
  // -------------------------------------------------------

  Object.freeze({

    id: "sesame",

    name: "سمسم",

    climates: [
      "hot",
    ],

    seasons: [
      "صيفي",
    ],

    varieties: [

      Object.freeze({
        id: "sesame-standard",
        name: "سمسم",
        type: "صنف",
        season: "صيفي",
        suitability: [
          "حارة",
        ],
        reason:
          "خيار مبدئي للمناطق الدافئة ذات الموسم المناسب.",
      }),

    ],

  }),

]);


// =========================================================
// LEGACY SEEDS
// =========================================================
//
// نحافظ على الشكل القديم حتى لا تنكسر Crops.jsx الحالية.
//
// =========================================================

const SEEDS = Object.freeze({

  cold: [
    "قمح",
    "شعير",
  ],

  moderate: [
    "قمح",
    "شعير",
    "ذرة",
    "عباد الشمس",
  ],

  hot: [
    "ذرة",
    "قطن",
    "دخن",
    "سورغم",
    "سمسم",
  ],

});


// =========================================================
// CLIMATE
// =========================================================

function getClimate(latitude) {

  const value =
    Number(latitude);


  if (
    !Number.isFinite(value)
  ) {

    return null;

  }


  const n =
    Math.abs(value);


  if (
    n >= 50
  ) {

    return "باردة";

  }


  if (
    n >= 25
  ) {

    return "معتدلة";

  }


  return "حارة";

}


// =========================================================
// CLIMATE KEY
// =========================================================

function getClimateKey(latitude) {

  const climate =
    getClimate(latitude);


  if (!climate) {

    return null;

  }


  if (
    climate === CLIMATE.cold
  ) {

    return "cold";

  }


  if (
    climate === CLIMATE.moderate
  ) {

    return "moderate";

  }


  return "hot";

}


// =========================================================
// NORMALIZE TEXT
// =========================================================

function normalizeText(value) {

  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

}


// =========================================================
// FIND CROP
// =========================================================

function findCrop(
  cropIdOrName
) {

  const value =
    normalizeText(
      cropIdOrName
    );


  if (!value) {

    return null;

  }


  return (
    CROP_CATALOG.find(
      crop =>

        normalizeText(
          crop.id
        ) === value ||

        normalizeText(
          crop.name
        ) === value
    ) || null
  );

}


// =========================================================
// CROP SERVICE
// =========================================================

class CropService {


  // =======================================================
  // GET ALL
  // =======================================================

  async getAll() {

    return cropRepository.getAll();

  }


  // =======================================================
  // GET BY ID
  // =======================================================

  async getById(
    id
  ) {

    if (!id) {

      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );

    }


    const crop =
      await cropRepository.getById(
        id
      );


    if (!crop) {

      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );

    }


    return crop;

  }


  // =======================================================
  // CREATE
  // =======================================================

  async create(
    data
  ) {

    this.validate(
      data
    );


    return cropRepository.create({

      ...data,

      status:
        data.status ||
        "active",

    });

  }


  // =======================================================
  // UPDATE
  // =======================================================

  async update(
    id,
    data
  ) {

    if (!id) {

      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );

    }


    this.validate(
      data
    );


    const updated =
      await cropRepository.update(
        id,
        data
      );


    if (!updated) {

      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );

    }


    return updated;

  }


  // =======================================================
  // DELETE
  // =======================================================

  async delete(
    id
  ) {

    if (!id) {

      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );

    }


    const deleted =
      await cropRepository.delete(
        id
      );


    if (!deleted) {

      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );

    }


    return true;

  }


  // =======================================================
  // BASIC RECOMMENDATION
  // =======================================================
  //
  // هذه الدالة تحافظ على التوافق مع Crops.jsx الحالية.
  //
  // النتيجة:
  //
  // {
  //   climate: "معتدلة",
  //   seeds: [...]
  // }
  //
  // =======================================================

  getRecommendation(
    latitude
  ) {

    const climate =
      getClimate(
        latitude
      );


    if (!climate) {

      return null;

    }


    const key =
      getClimateKey(
        latitude
      );


    return {

      climate,

      seeds:
        SEEDS[key] || [],

      message:
        `المناخ ${climate}، وهذه محاصيل مناسبة مبدئيًا لهذه المنطقة.`,

    };

  }


  // =======================================================
  // SMART CROP RECOMMENDATION
  // =======================================================
  //
  // هذه هي الطبقة الجديدة.
  //
  // بدل:
  //
  // قمح
  // شعير
  // ذرة
  //
  // نحصل على بيانات منظمة يمكن لـ Crops.jsx
  // عرضها على شكل بطاقات أو جدول.
  //
  // =======================================================

  getSmartRecommendations(
    latitude
  ) {

    const climateKey =
      getClimateKey(
        latitude
      );


    const climate =
      getClimate(
        latitude
      );


    if (
      !climateKey ||
      !climate
    ) {

      return null;

    }


    const crops =
      CROP_CATALOG
        .filter(
          crop =>
            crop.climates.includes(
              climateKey
            )
        )
        .map(
          crop => ({

            id:
              crop.id,

            name:
              crop.name,

            seasons:
              crop.seasons,

            varietyCount:
              crop.varieties.length,

            varieties:
              crop.varieties,

          })
        );


    return {

      climate,

      climateKey,

      crops,

      count:
        crops.length,

      message:
        `تم العثور على ${crops.length} محاصيل مناسبة مبدئيًا للمناخ ${climate}.`,

    };

  }


  // =======================================================
  // GET CROP OPTIONS
  // =======================================================
  //
  // عند اختيار المستخدم:
  //
  // "قمح"
  //
  // يمكن استدعاء:
  //
  // getCropOptions("wheat", latitude)
  //
  // =======================================================

  getCropOptions(
    cropIdOrName,
    latitude
  ) {

    const crop =
      findCrop(
        cropIdOrName
      );


    if (!crop) {

      return null;

    }


    const climateKey =
      getClimateKey(
        latitude
      );


    const climate =
      getClimate(
        latitude
      );


    const suitable =
      climateKey
        ? crop.climates.includes(
            climateKey
          )
        : false;


    const varieties =
      crop.varieties
        .filter(
          variety => {

            if (!climate) {

              return true;

            }


            return variety.suitability.includes(
              climate
            );

          }
        );


    return {

      id:
        crop.id,

      name:
        crop.name,

      climate,

      suitable,

      seasons:
        crop.seasons,

      varieties,

      varietyCount:
        varieties.length,

      message:
        suitable

          ? `أصناف ${crop.name} المناسبة مبدئيًا للمناخ ${climate}.`

          : `المناخ ${climate} ليس مناخًا رئيسيًا لهذا المحصول حسب قاعدة التوصية الحالية.`,

    };

  }


  // =======================================================
  // GET VARIETY RECOMMENDATIONS
  // =======================================================
  //
  // هذه الدالة هي الأساس لما طلبته تحديدًا:
  //
  // المستخدم يختار:
  //
  // قمح
  //
  // ثم يحصل على:
  //
  // جدول الأصناف.
  //
  // =======================================================

  getSeedRecommendations(
    cropIdOrName,
    latitude
  ) {

    const result =
      this.getCropOptions(
        cropIdOrName,
        latitude
      );


    if (!result) {

      return null;

    }


    return {

      cropId:
        result.id,

      cropName:
        result.name,

      climate:
        result.climate,

      suitable:
        result.suitable,

      varieties:
        result.varieties,

      message:
        result.message,

    };

  }


  // =======================================================
  // GET CATALOG
  // =======================================================

  getCropCatalog() {

    return CROP_CATALOG.map(
      crop => ({

        id:
          crop.id,

        name:
          crop.name,

        climates:
          crop.climates,

        seasons:
          crop.seasons,

        varietyCount:
          crop.varieties.length,

      })
    );

  }


  // =======================================================
  // VALIDATE
  // =======================================================

  validate(
    data
  ) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw createError(
        "Crop data is required",
        "CROP_DATA_REQUIRED"
      );

    }


    // -----------------------------------------------------
    // المزرعة مطلوبة لجميع أنواع المحاصيل
    // -----------------------------------------------------

    if (
      !data.farmId
    ) {

      throw createError(
        "Farm is required",
        "CROP_FARM_REQUIRED"
      );

    }


    // -----------------------------------------------------
    // تحديد نوع الزراعة
    // -----------------------------------------------------

    const type =
      data.cultivationType ||
      "field";


    // -----------------------------------------------------
    // الأشجار / البستان
    // -----------------------------------------------------

    if (
      type === "trees"
    ) {

      if (
        !String(
          data.treeType ?? ""
        ).trim()
      ) {

        throw createError(
          "Tree type is required",
          "CROP_TREE_TYPE_REQUIRED"
        );

      }

    }


    // -----------------------------------------------------
    // الحقول والخضروات وغيرها
    // -----------------------------------------------------

    else {

      if (
        !String(
          data.name ?? ""
        ).trim()
      ) {

        throw createError(
          "Crop name is required",
          "CROP_NAME_REQUIRED"
        );

      }

    }


    return true;

  }

}


// =========================================================
// EXPORT
// =========================================================

export default Object.freeze(
  new CropService()
);
