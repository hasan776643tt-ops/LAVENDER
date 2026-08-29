// src/services/cropService.js

import cropRepository from "../repositories/cropRepository.js";
import { createError } from "../utils/errorHandler.js";

const CLIMATE = Object.freeze({
  cold: "باردة",
  moderate: "معتدلة",
  hot: "حارة",
});

const CROP_CATALOG = Object.freeze([
  {
    id: "wheat",
    name: "قمح",
    category: "cereal",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      {
        id: "wheat-winter",
        name: "قمح شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: ["باردة", "معتدلة"],
        reason: "مناسب مبدئيًا للمناطق الباردة والمعتدلة.",
        confidence: "متوسطة",
      },
      {
        id: "wheat-durum",
        name: "قمح قاسي",
        type: "صنف",
        season: "شتوي",
        suitability: ["معتدلة"],
        reason: "خيار مبدئي للمناطق المعتدلة.",
        confidence: "متوسطة",
      },
      {
        id: "wheat-spring",
        name: "قمح ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: ["باردة", "معتدلة"],
        reason: "خيار مبدئي عندما يتوافق الموسم وطول فترة النمو.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "barley",
    name: "شعير",
    category: "cereal",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      {
        id: "barley-winter",
        name: "شعير شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: ["باردة", "معتدلة"],
        reason: "خيار مبدئي للمناطق الباردة والمعتدلة.",
        confidence: "متوسطة",
      },
      {
        id: "barley-spring",
        name: "شعير ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: ["باردة", "معتدلة"],
        reason: "خيار مبدئي حسب الموسم.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "maize",
    name: "ذرة",
    category: "cereal",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      {
        id: "maize-hybrid",
        name: "ذرة هجينة",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        reason: "الهجن قد تناسب المناطق الدافئة حسب طول الموسم والمياه.",
        confidence: "متوسطة",
      },
      {
        id: "maize-early",
        name: "ذرة مبكرة النضج",
        type: "صنف",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        reason: "قد تناسب المناطق ذات الموسم المحدود.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "cotton",
    name: "قطن",
    category: "fiber",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      {
        id: "cotton-upland",
        name: "قطن Upland",
        type: "مجموعة أصناف",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        reason: "مجموعة أصناف واسعة الانتشار وليست توصية لصنف محلي محدد.",
        confidence: "منخفضة",
      },
      {
        id: "cotton-early",
        name: "قطن مبكر النضج",
        type: "صنف",
        season: "ربيعي",
        suitability: ["معتدلة", "حارة"],
        reason: "قد يناسب المناطق التي تحتاج فترة نمو أقصر.",
        confidence: "منخفضة",
      },
    ],
  },

  {
    id: "sunflower",
    name: "عباد الشمس",
    category: "oilseed",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      {
        id: "sunflower-hybrid",
        name: "عباد الشمس الهجين",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        reason: "خيار مبدئي للمناطق الدافئة.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "sorghum",
    name: "سورغم",
    category: "cereal",
    climates: ["moderate", "hot"],
    seasons: ["صيفي"],
    varieties: [
      {
        id: "sorghum-grain",
        name: "سورغم حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: ["معتدلة", "حارة"],
        reason: "يتحمل الحرارة نسبيًا.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "millet",
    name: "دخن",
    category: "cereal",
    climates: ["hot"],
    seasons: ["صيفي"],
    varieties: [
      {
        id: "millet-grain",
        name: "دخن حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: ["حارة"],
        reason: "يتحمل الحرارة والجفاف نسبيًا.",
        confidence: "متوسطة",
      },
    ],
  },

  {
    id: "sesame",
    name: "سمسم",
    category: "oilseed",
    climates: ["hot"],
    seasons: ["صيفي"],
    varieties: [
      {
        id: "sesame-standard",
        name: "سمسم",
        type: "صنف",
        season: "صيفي",
        suitability: ["حارة"],
        reason: "خيار مبدئي للمناطق الدافئة.",
        confidence: "متوسطة",
      },
    ],
  },
]);

const SEEDS = Object.freeze({
  cold: ["قمح", "شعير"],
  moderate: ["قمح", "شعير", "ذرة", "عباد الشمس"],
  hot: ["ذرة", "قطن", "دخن", "سورغم", "سمسم"],
});

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function hasCoordinates(location = {}) {
  const latitude = number(
    location.latitude ?? location.lat
  );

  const longitude = number(
    location.longitude ?? location.lng
  );

  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function getClimate(latitude) {
  const value = number(latitude);

  if (value === null) {
    return null;
  }

  const absolute = Math.abs(value);

  if (absolute >= 50) {
    return CLIMATE.cold;
  }

  if (absolute >= 25) {
    return CLIMATE.moderate;
  }

  return CLIMATE.hot;
}

function getClimateKey(latitude) {
  const climate = getClimate(latitude);

  if (climate === CLIMATE.cold) {
    return "cold";
  }

  if (climate === CLIMATE.moderate) {
    return "moderate";
  }

  if (climate === CLIMATE.hot) {
    return "hot";
  }

  return null;
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function findCrop(value) {
  const key = normalizeText(value);

  if (!key) {
    return null;
  }

  return (
    CROP_CATALOG.find(
      crop =>
        normalizeText(crop.id) === key ||
        normalizeText(crop.name) === key
    ) || null
  );
}

function normalizeLocation(location = {}) {
  const points = Array.isArray(location.points)
    ? location.points
    : [];

  const boundary = Array.isArray(location.boundary)
    ? location.boundary
    : points;

  const latitude =
    location.latitude ??
    location.lat ??
    points[0]?.latitude ??
    points[0]?.lat ??
    "";

  const longitude =
    location.longitude ??
    location.lng ??
    points[0]?.longitude ??
    points[0]?.lng ??
    "";

  return {
    ...location,
    latitude,
    longitude,
    boundary,
    points,
    source: location.source || "map",
  };
}

function getLocationConfidence(location) {
  const normalized = normalizeLocation(location);

  if (!hasCoordinates(normalized)) {
    return {
      score: 0,
      level: "منخفضة",
    };
  }

  if (normalized.boundary.length >= 3) {
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

class CropService {
  async getAll() {
    return cropRepository.getAll();
  }

  async getById(id) {
    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    const crop = await cropRepository.getById(id);

    if (!crop) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return crop;
  }

  async create(data) {
    this.validate(data);

    return cropRepository.create({
      ...data,
      status: data.status || "active",
    });
  }

  async update(id, data) {
    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    this.validate(data);

    const updated = await cropRepository.update(
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

  async delete(id) {
    if (!id) {
      throw createError(
        "Crop id is required",
        "CROP_ID_REQUIRED"
      );
    }

    const deleted = await cropRepository.delete(id);

    if (!deleted) {
      throw createError(
        "Crop not found",
        "CROP_NOT_FOUND"
      );
    }

    return true;
  }

  getRecommendation(latitude) {
    const climate = getClimate(latitude);
    const key = getClimateKey(latitude);

    if (!climate || !key) {
      return null;
    }

    return {
      climate,
      seeds: SEEDS[key] || [],
      message:
        `المناخ ${climate}، وهذه محاصيل مناسبة مبدئيًا للموقع الجغرافي.`,
    };
  }

  getSmartRecommendations(
    locationOrLatitude,
    longitude = null
  ) {
    const location =
      locationOrLatitude &&
      typeof locationOrLatitude === "object"
        ? normalizeLocation(locationOrLatitude)
        : normalizeLocation({
            latitude: locationOrLatitude,
            longitude,
          });

    if (!hasCoordinates(location)) {
      return null;
    }

    const climate = getClimate(location.latitude);
    const climateKey = getClimateKey(location.latitude);

    if (!climate || !climateKey) {
      return null;
    }

    const confidence =
      getLocationConfidence(location);

    const crops = CROP_CATALOG
      .filter(crop =>
        crop.climates.includes(climateKey)
      )
      .map(crop => {
        const varieties =
          crop.varieties.filter(variety =>
            variety.suitability.includes(climate)
          );

        return {
          id: crop.id,
          name: crop.name,
          category: crop.category,
          seasons: crop.seasons,
          varietyCount: varieties.length,
          varieties,
          locationConfidence: confidence.level,
          locationScore: confidence.score,
        };
      });

    return {
      climate,
      climateKey,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      boundary: location.boundary,
      locationSource: location.source,
      locationConfidence: confidence.level,
      crops,
      count: crops.length,
      message:
        `تم تحليل الموقع المحدد على الخريطة، ووجد النظام ${crops.length} محاصيل مناسبة مبدئيًا للمناخ ${climate}.`,
      warning:
        "التوصية الأولية لا تعني أن الصنف هو الأفضل للموقع.",
    };
  }

  getCropOptions(
    cropIdOrName,
    latitudeOrLocation,
    longitude = null
  ) {
    const crop = findCrop(cropIdOrName);

    if (!crop) {
      return null;
    }

    const location =
      latitudeOrLocation &&
      typeof latitudeOrLocation === "object"
        ? normalizeLocation(latitudeOrLocation)
        : normalizeLocation({
            latitude: latitudeOrLocation,
            longitude,
          });

    const climate = getClimate(location.latitude);
    const climateKey = getClimateKey(location.latitude);

    const suitable =
      climateKey !== null &&
      crop.climates.includes(climateKey);

    const varieties = crop.varieties.filter(variety => {
      if (!climate) {
        return true;
      }

      return variety.suitability.includes(climate);
    });

    const confidence =
      getLocationConfidence(location);

    return {
      id: crop.id,
      name: crop.name,
      category: crop.category,
      climate,
      climateKey,
      latitude: location.latitude,
      longitude: location.longitude,
      boundary: location.boundary,
      suitable,
      seasons: crop.seasons,
      varieties,
      varietyCount: varieties.length,
      locationConfidence: confidence.level,
      message: suitable
        ? `أصناف ${crop.name} المناسبة مبدئيًا للمناخ ${climate}.`
        : `المناخ ${climate || "غير محدد"} ليس مناخًا رئيسيًا لهذا المحصول حسب قاعدة التوصية الحالية.`,
      warning:
        "لا يتم اعتبار أي صنف الأفضل للموقع دون مصدر زراعي موثوق.",
    };
  }

  getSeedRecommendations(
    cropIdOrName,
    latitudeOrLocation,
    longitude = null
  ) {
    const result = this.getCropOptions(
      cropIdOrName,
      latitudeOrLocation,
      longitude
    );

    if (!result) {
      return null;
    }

    return {
      cropId: result.id,
      cropName: result.name,
      category: result.category,
      climate: result.climate,
      climateKey: result.climateKey,
      latitude: result.latitude,
      longitude: result.longitude,
      boundary: result.boundary,
      locationConfidence: result.locationConfidence,
      suitable: result.suitable,
      seasons: result.seasons,
      varieties: result.varieties,
      varietyCount: result.varietyCount,
      message: result.message,
      warning: result.warning,
    };
  }

  getCropCatalog() {
    return CROP_CATALOG.map(crop => ({
      id: crop.id,
      name: crop.name,
      category: crop.category,
      climates: crop.climates,
      seasons: crop.seasons,
      varietyCount: crop.varieties.length,
    }));
  }

  validate(data) {
    if (!data || typeof data !== "object") {
      throw createError(
        "Crop data is required",
        "CROP_DATA_REQUIRED"
      );
    }

    if (!data.farmId) {
      throw createError(
        "Farm is required",
        "CROP_FARM_REQUIRED"
      );
    }

    const type = data.cultivationType || "field";

    if (type === "trees") {
      if (!String(data.treeType ?? "").trim()) {
        throw createError(
          "Tree type is required",
          "CROP_TREE_TYPE_REQUIRED"
        );
      }
    } else {
      if (!String(data.name ?? "").trim()) {
        throw createError(
          "Crop name is required",
          "CROP_NAME_REQUIRED"
        );
      }
    }

    return true;
  }
}

export default Object.freeze(
  new CropService()
);
