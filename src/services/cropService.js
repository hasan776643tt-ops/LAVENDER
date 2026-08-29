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
// المسؤول عن:
//
// 1. CRUD للمحاصيل.
// 2. التحقق من بيانات المحصول.
// 3. تحديد المناخ التقريبي من إحداثيات الخريطة.
// 4. التوصية بالمحاصيل.
// 5. التوصية بأصناف / هجن البذور.
// 6. ربط التوصية بالموقع الجغرافي.
// 7. عدم الاعتماد على اسم المحافظة أو البلدة المكتوب.
// 8. عدم إجبار Crops.jsx على fieldId.
//
// مبدأ مهم:
//
// الموقع الجغرافي الحقيقي يأتي من:
// latitude + longitude + boundary
//
// وليس من:
// province / city / village
//
// هذه الخدمة لا تعتبر أي صنف "الأفضل"
// إلا إذا كانت قاعدة بيانات موثوقة مرتبطة بالمنطقة
// قدّمت هذه المعلومة.
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
// قاعدة أولية منظمة للمحاصيل.
//
// لاحظ:
//
// هذه ليست قاعدة "أفضل صنف في العالم".
//
// هي قاعدة تشغيلية أولية تسمح للنظام بأن:
//
// الموقع
// ↓
// المناخ
// ↓
// المحصول
// ↓
// الأصناف
//
// ويمكن توسيعها لاحقًا ببيانات موثوقة.
//
// =========================================================

const CROP_CATALOG = Object.freeze([

  // =======================================================
  // WHEAT
  // =======================================================

  Object.freeze({

    id: "wheat",

    name: "قمح",

    category: "cereal",

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

        id: "wheat-winter",

        name: "قمح شتوي",

        type: "صنف",

        season: "شتوي",

        suitability: [
          "باردة",
          "معتدلة",
        ],

        reason:
          "خيار مناسب مبدئيًا للمناطق الباردة والمعتدلة عند توافق موعد الزراعة وطول الموسم.",

        confidence: "متوسطة",

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
          "خيار مبدئي للمناطق المعتدلة، ويحتاج القرار النهائي إلى بيانات التربة والمياه والصنف المحلي.",

        confidence: "متوسطة",

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
          "يمكن استخدامه في المناطق التي يتوافق فيها الموسم الربيعي مع الصنف وطول الموسم.",

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // BARLEY
  // =======================================================

  Object.freeze({

    id: "barley",

    name: "شعير",

    category: "cereal",

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
          "خيار مبدئي للمناطق الباردة والمعتدلة.",

        confidence: "متوسطة",

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
          "خيار للمناطق التي يتوافق فيها الموسم الربيعي مع الصنف.",

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // MAIZE
  // =======================================================

  Object.freeze({

    id: "maize",

    name: "ذرة",

    category: "cereal",

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
          "الهجن قد تكون مناسبة للمناطق الدافئة، ويجب اختيار الهجين وفق المنطقة واحتياج المياه وطول الموسم.",

        confidence: "متوسطة",

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
          "قد تكون مناسبة عندما يكون طول الموسم الزراعي محدودًا.",

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // COTTON
  // =======================================================

  Object.freeze({

    id: "cotton",

    name: "قطن",

    category: "fiber",

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

        id: "cotton-upland",

        name: "قطن Upland",

        type: "مجموعة أصناف",

        season: "ربيعي / صيفي",

        suitability: [
          "معتدلة",
          "حارة",
        ],

        reason:
          "مجموعة واسعة الانتشار، لكن لا تعني أن كل صنف منها مناسب للموقع المحدد.",

        confidence: "منخفضة",

      }),

      Object.freeze({

        id: "cotton-early",

        name: "قطن مبكر النضج",

        type: "صنف",

        season: "ربيعي",

        suitability: [
          "معتدلة",
          "حارة",
        ],

        reason:
          "قد يناسب المناطق التي تحتاج إلى فترة نمو أقصر.",

        confidence: "منخفضة",

      }),

    ],

  }),


  // =======================================================
  // SUNFLOWER
  // =======================================================

  Object.freeze({

    id: "sunflower",

    name: "عباد الشمس",

    category: "oilseed",

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
          "خيار مبدئي للمناطق الدافئة عند توفر الظروف الزراعية المناسبة.",

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // SORGHUM
  // =======================================================

  Object.freeze({

    id: "sorghum",

    name: "سورغم",

    category: "cereal",

    climates: [
      "moderate",
      "hot",
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
          "معتدلة",
          "حارة",
        ],

        reason:
          "يتحمل الحرارة نسبيًا ويمكن أن يكون خيارًا للمناطق الدافئة.",

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // MILLET
  // =======================================================

  Object.freeze({

    id: "millet",

    name: "دخن",

    category: "cereal",

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

        confidence: "متوسطة",

      }),

    ],

  }),


  // =======================================================
  // SESAME
  // =======================================================

  Object.freeze({

    id: "sesame",

    name: "سمسم",

    category: "oilseed",

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

        confidence: "متوسطة",

      }),

    ],

  }),

]);


// =========================================================
// LEGACY SEEDS
// =========================================================
//
// الحفاظ على API القديم حتى لا تنكسر Crops.jsx
// التي تستعمل getRecommendation().
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
// NUMBER
// =========================================================

function getNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;

}


// =========================================================
// VALID COORDINATES
// =========================================================

function hasCoordinates(
  latitude,
  longitude
) {

  const lat =
    getNumber(latitude);

  const lng =
    getNumber(longitude);

  if (
    lat === null ||
    lng === null
  ) {

    return false;

  }

  return (
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );

}


// =========================================================
// CLIMATE
// =========================================================
//
// ملاحظة:
//
// هذا تصنيف مناخي تقريبي جدًا.
// لا يمكن اعتبار خط العرض وحده بديلاً عن:
//
// الحرارة
// الأمطار
// الارتفاع
// التربة
// الري
// طول الموسم
//
// لكنه يبقى fallback أوليًا.
//
// =========================================================

function getClimate(
  latitude
) {

  const value =
    getNumber(latitude);

  if (
    value === null
  ) {

    return null;

  }

  const n =
    Math.abs(value);

  if (
    n >= 50
  ) {

    return CLIMATE.cold;

  }

  if (
    n >= 25
  ) {

    return CLIMATE.moderate;

  }

  return CLIMATE.hot;

}


// =========================================================
// CLIMATE KEY
// =========================================================

function getClimateKey(
  latitude
) {

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

function normalizeText(
  value
) {

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
// LOCATION CONTEXT
// =========================================================
//
// الموقع هنا يأتي من الخريطة:
//
// latitude
// longitude
// boundary
//
// وليس من اسم المحافظة أو البلدة.
//
// =========================================================

function normalizeLocation(
  location = {}
) {

  const latitude =
    location.latitude ??
    location.lat ??
    "";

  const longitude =
    location.longitude ??
    location.lng ??
    "";

  const boundary =
    Array.isArray(
      location.boundary
    )
      ? location.boundary
      : Array.isArray(
          location.points
        )
        ? location.points
        : [];

  return {

    latitude,

    longitude,

    boundary,

    source:
      location.source ||
      "map",

  };

}


// =========================================================
// LOCATION SCORE
// =========================================================
//
// يعطي ثقة إضافية عندما تتوفر إحداثيات صحيحة.
// لا يستخدم اسم المنطقة.
//
// =========================================================

function getLocationConfidence(
  location
) {

  const normalized =
    normalizeLocation(
      location
    );

  if (
    !hasCoordinates(
      normalized.latitude,
      normalized.longitude
    )
  ) {

    return {

      score: 0,

      level: "منخفضة",

    };

  }

  if (
    normalized.boundary.length >= 3
  ) {

    return {

      score: 100,

      level: "مرتفعة",

    };

  }

  return {

    score: 80,

    level: "متوسطة",

  };

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
  // الحفاظ على الدالة القديمة.
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
        `المناخ ${climate}، وهذه محاصيل مناسبة مبدئيًا للموقع الجغرافي.`,

    };

  }


  // =======================================================
  // SMART CROP RECOMMENDATIONS
  // =======================================================
  //
  // الاستخدام:
  //
  // getSmartRecommendations({
  //   latitude,
  //   longitude,
  //   boundary
  // })
  //
  // أو التوافق القديم:
  //
  // getSmartRecommendations(latitude)
  //
  // =======================================================

  getSmartRecommendations(
    locationOrLatitude,
    longitude = null
  ) {

    const location =
      typeof locationOrLatitude === "object"

        ? normalizeLocation(
            locationOrLatitude
          )

        : normalizeLocation({

            latitude:
              locationOrLatitude,

            longitude,

          });


    if (
      !hasCoordinates(
        location.latitude,
        location.longitude
      )
    ) {

      return null;

    }


    const climate =
      getClimate(
        location.latitude
      );


    const climateKey =
      getClimateKey(
        location.latitude
      );


    if (
      !climate ||
      !climateKey
    ) {

      return null;

    }


    const locationConfidence =
      getLocationConfidence(
        location
      );


    const crops =
      CROP_CATALOG
        .filter(
          crop =>
            crop.climates.includes(
              climateKey
            )
        )
        .map(
          crop => {

            const varieties =
              crop.varieties.filter(
                variety =>
                  variety.suitability.includes(
                    climate
                  )
              );


            return {

              id:
                crop.id,

              name:
                crop.name,

              category:
                crop.category,

              seasons:
                crop.seasons,

              varietyCount:
                varieties.length,

              varieties,

              locationConfidence:
                locationConfidence.level,

              locationScore:
                locationConfidence.score,

            };

          }
        );


    return {

      climate,

      climateKey,

      latitude:
        Number(
          location.latitude
        ),

      longitude:
        Number(
          location.longitude
        ),

      boundary:
        location.boundary,

      locationSource:
        location.source,

      locationConfidence:
        locationConfidence.level,

      crops,

      count:
        crops.length,

      message:
        `تم تحليل الموقع الجغرافي المحدد على الخريطة، ووجد النظام ${crops.length} محاصيل مناسبة مبدئيًا للمناخ ${climate}.`,

      warning:
        "التوصية الأولية لا تعني أن الصنف هو الأفضل للموقع. الاختيار النهائي يحتاج بيانات الصنف المحلي والتربة والمياه وموعد الزراعة.",

    };

  }


  // =======================================================
  // GET CROP OPTIONS
  // =======================================================
  //
  // عند اختيار المستخدم محصولًا:
  //
  // قمح
  //
  // تظهر الأصناف المرتبطة به.
  //
  // =======================================================

  getCropOptions(
    cropIdOrName,
    latitude,
    longitude = null
  ) {

    const crop =
      findCrop(
        cropIdOrName
      );


    if (!crop) {

      return null;

    }


    const location =
      normalizeLocation({

        latitude,

        longitude,

      });


    const climate =
      getClimate(
        location.latitude
      );


    const climateKey =
      getClimateKey(
        location.latitude
      );


    const suitable =
      climateKey
        ? crop.climates.includes(
            climateKey
          )
        : false;


    const varieties =
      crop.varieties.filter(
        variety => {

          if (!climate) {

            return true;

          }

          return variety.suitability.includes(
            climate
          );

        }
      );


    const locationConfidence =
      getLocationConfidence(
        location
      );


    return {

      id:
        crop.id,

      name:
        crop.name,

      category:
        crop.category,

      climate,

      climateKey,

      latitude:
        location.latitude,

      longitude:
        location.longitude,

      suitable,

      seasons:
        crop.seasons,

      varieties,

      varietyCount:
        varieties.length,

      locationConfidence:
        locationConfidence.level,

      message:

        suitable

          ? `أصناف ${crop.name} المناسبة مبدئيًا للمناخ ${climate}.`

          : `المناخ ${climate || "غير محدد"} ليس مناخًا رئيسيًا لهذا المحصول حسب قاعدة التوصية الحالية.`,

      warning:
        "لا يتم اعتبار أي صنف هنا الأفضل للموقع دون مصدر زراعي موثوق مرتبط بالموقع.",

    };

  }


  // =======================================================
  // GET SEED RECOMMENDATIONS
  // =======================================================
  //
  // هذه الدالة هي الواجهة الأساسية للمرحلة القادمة.
  //
  // مثال:
  //
  // getSeedRecommendations(
  //   "wheat",
  //   {
  //     latitude: 36.6929,
  //     longitude: 38.7089,
  //     boundary: [...]
  //   }
  // )
  //
  // =======================================================

  getSeedRecommendations(
    cropIdOrName,
    latitudeOrLocation,
    longitude = null
  ) {

    let location;


    if (
      latitudeOrLocation &&
      typeof latitudeOrLocation === "object"
    ) {

      location =
        normalizeLocation(
          latitudeOrLocation
        );

    } else {

      location =
        normalizeLocation({

          latitude:
            latitudeOrLocation,

          longitude,

        });

    }


    const result =
      this.getCropOptions(
        cropIdOrName,
        location.latitude,
        location.longitude
      );


    if (!result) {

      return null;

    }


    const locationConfidence =
      getLocationConfidence(
        location
      );


    return {

      cropId:
        result.id,

      cropName:
        result.name,

      category:
        result.category,

      climate:
        result.climate,

      climateKey:
        result.climateKey,

      latitude:
        location.latitude,

      longitude:
        location.longitude,

      boundary:
        location.boundary,

      locationSource:
        location.source,

      locationConfidence:
        locationConfidence.level,

      suitable:
        result.suitable,

      seasons:
        result.seasons,

      varieties:
        result.varieties,

      varietyCount:
        result.varietyCount,

      message:
        result.message,

      warning:
        result.warning,

    };

  }


  // =======================================================
  // GET CROP CATALOG
  // =======================================================

  getCropCatalog() {

    return CROP_CATALOG.map(
      crop => ({

        id:
          crop.id,

        name:
          crop.name,

        category:
          crop.category,

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
  //
  // لا يوجد fieldId إجباري.
  //
  // الأشجار:
  // treeType مطلوب.
  //
  // الحقول والخضروات وغيرها:
  // name مطلوب.
  //
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
    // المزرعة مطلوبة
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
    // نوع الزراعة
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
    // الحقل / الخضروات / أخرى
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


    // -----------------------------------------------------
    // الموقع ليس إلزاميًا هنا
    //
    // لأن التحقق من وجود الموقع يتم في Crops.jsx
    // قبل الحفظ.
    //
    // -----------------------------------------------------

    return true;

  }

}


// =========================================================
// EXPORT
// =========================================================

export default Object.freeze(
  new CropService()
);
