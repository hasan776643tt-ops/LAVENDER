// src/services/cropService.js

import cropRepository from "../repositories/cropRepository.js";
import { createError } from "../utils/errorHandler.js";

const CLIMATE = Object.freeze({
  cold: "باردة",
  moderate: "معتدلة",
  hot: "حارة",
});

const CROP_CATALOG = Object.freeze([
  Object.freeze({
    id: "wheat",
    name: "قمح",
    category: "cereal",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      Object.freeze({
        id: "wheat-winter",
        name: "قمح شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: ["باردة", "معتدلة"],
        confidence: "متوسطة",
      }),
      Object.freeze({
        id: "wheat-durum",
        name: "قمح قاسي",
        type: "صنف",
        season: "شتوي",
        suitability: ["معتدلة"],
        confidence: "متوسطة",
      }),
      Object.freeze({
        id: "wheat-spring",
        name: "قمح ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: ["باردة", "معتدلة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "barley",
    name: "شعير",
    category: "cereal",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      Object.freeze({
        id: "barley-winter",
        name: "شعير شتوي",
        type: "صنف",
        season: "شتوي",
        suitability: ["باردة", "معتدلة"],
        confidence: "متوسطة",
      }),
      Object.freeze({
        id: "barley-spring",
        name: "شعير ربيعي",
        type: "صنف",
        season: "ربيعي",
        suitability: ["باردة", "معتدلة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "maize",
    name: "ذرة",
    category: "cereal",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      Object.freeze({
        id: "maize-hybrid",
        name: "ذرة هجينة",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        confidence: "متوسطة",
      }),
      Object.freeze({
        id: "maize-early",
        name: "ذرة مبكرة النضج",
        type: "صنف",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "cotton",
    name: "قطن",
    category: "fiber",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      Object.freeze({
        id: "cotton-upland",
        name: "قطن Upland",
        type: "مجموعة أصناف",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        confidence: "منخفضة",
      }),
      Object.freeze({
        id: "cotton-early",
        name: "قطن مبكر النضج",
        type: "صنف",
        season: "ربيعي",
        suitability: ["معتدلة", "حارة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "sunflower",
    name: "عباد الشمس",
    category: "oilseed",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي", "صيفي"],
    varieties: [
      Object.freeze({
        id: "sunflower-hybrid",
        name: "عباد الشمس الهجين",
        type: "هجين",
        season: "ربيعي / صيفي",
        suitability: ["معتدلة", "حارة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "sorghum",
    name: "سورغم",
    category: "cereal",
    climates: ["moderate", "hot"],
    seasons: ["صيفي"],
    varieties: [
      Object.freeze({
        id: "sorghum-grain",
        name: "سورغم حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: ["معتدلة", "حارة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "millet",
    name: "دخن",
    category: "cereal",
    climates: ["hot"],
    seasons: ["صيفي"],
    varieties: [
      Object.freeze({
        id: "millet-grain",
        name: "دخن حبوب",
        type: "صنف",
        season: "صيفي",
        suitability: ["حارة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "sesame",
    name: "سمسم",
    category: "oilseed",
    climates: ["hot"],
    seasons: ["صيفي"],
    varieties: [
      Object.freeze({
        id: "sesame-standard",
        name: "سمسم",
        type: "صنف",
        season: "صيفي",
        suitability: ["حارة"],
        confidence: "متوسطة",
      }),
    ],
  }),

  Object.freeze({
    id: "apple",
    name: "تفاح",
    category: "trees",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      Object.freeze({
        id: "apple-general",
        name: "تفاح",
        type: "صنف",
        season: "شتوي / ربيعي",
        suitability: ["باردة", "معتدلة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "pear",
    name: "كمثرى",
    category: "trees",
    climates: ["cold", "moderate"],
    seasons: ["شتوي", "ربيعي"],
    varieties: [
      Object.freeze({
        id: "pear-general",
        name: "كمثرى",
        type: "صنف",
        season: "شتوي / ربيعي",
        suitability: ["باردة", "معتدلة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "olive",
    name: "زيتون",
    category: "trees",
    climates: ["moderate", "hot"],
    seasons: ["خريفي", "ربيعي"],
    varieties: [
      Object.freeze({
        id: "olive-general",
        name: "زيتون",
        type: "صنف",
        season: "خريفي / ربيعي",
        suitability: ["معتدلة", "حارة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "pomegranate",
    name: "رمان",
    category: "trees",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي"],
    varieties: [
      Object.freeze({
        id: "pomegranate-general",
        name: "رمان",
        type: "صنف",
        season: "ربيعي",
        suitability: ["معتدلة", "حارة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "citrus",
    name: "حمضيات",
    category: "trees",
    climates: ["moderate", "hot"],
    seasons: ["ربيعي"],
    varieties: [
      Object.freeze({
        id: "citrus-general",
        name: "حمضيات",
        type: "صنف",
        season: "ربيعي",
        suitability: ["معتدلة", "حارة"],
        confidence: "منخفضة",
      }),
    ],
  }),

  Object.freeze({
    id: "date-palm",
    name: "نخيل",
    category: "trees",
    climates: ["hot"],
    seasons: ["ربيعي"],
    varieties: [
      Object.freeze({
        id: "date-palm-general",
        name: "نخيل",
        type: "صنف",
        season: "ربيعي",
        suitability: ["حارة"],
        confidence: "منخفضة",
      }),
    ],
  }),
]);

const SEEDS = Object.freeze({
  cold: ["قمح", "شعير"],
  moderate: ["قمح", "شعير", "ذرة", "عباد الشمس"],
  hot: ["ذرة", "قطن", "دخن", "سورغم", "سمسم"],
});

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hasCoordinates(latitude, longitude) {
  const lat = getNumber(latitude);
  const lng = getNumber(longitude);

  return (
    lat !== null &&
    lng !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function normalizeLocation(location = {}) {
  const latitude =
    location.latitude ??
    location.lat ??
    "";

  const longitude =
    location.longitude ??
    location.lng ??
    "";

  const boundary =
    Array.isArray(location.boundary)
      ? location.boundary
      : Array.isArray(location.points)
        ? location.points
        : [];

  return {
    latitude,
    longitude,
    boundary,
    source: location.source || "map",
  };
}

function getClimate(latitude) {
  const value = getNumber(latitude);

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

  if (climate === CLIMATE.cold) return "cold";
  if (climate === CLIMATE.moderate) return "moderate";
  if (climate === CLIMATE.hot) return "hot";

  return null;
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function findCrop(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return (
    CROP_CATALOG.find(
      crop =>
        normalizeText(crop.id) === normalized ||
        normalizeText(crop.name) === normalized
    ) || null
  );
}

function getLocationConfidence(location) {
  if (
    !hasCoordinates(
      location.latitude,
      location.longitude
    )
  ) {
    return {
      score: 0,
      level: "منخفضة",
    };
  }

  if (location.boundary.length >= 3) {
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

    const updated =
      await cropRepository.update(id, data);

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

    const deleted =
      await cropRepository.delete(id);

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

    if (!climate) {
      return null;
    }

    const key = getClimateKey(latitude);

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

    if (
      !hasCoordinates(
        location.latitude,
        location.longitude
      )
    ) {
      return null;
    }

    const climate =
      getClimate(location.latitude);

    const climateKey =
      getClimateKey(location.latitude);

    if (!climate || !climateKey) {
      return null;
    }

    const confidence =
      getLocationConfidence(location);

    const crops =
      CROP_CATALOG
        .filter(crop =>
          crop.climates.includes(climateKey)
        )
        .map(crop => {
          const varieties =
            crop.varieties.filter(
              variety =>
                variety.suitability.includes(
                  climate
                )
            );

          return {
            id: crop.id,
            name: crop.name,
            category: crop.category,
            seasons: crop.seasons,
            varietyCount: varieties.length,
            varieties,
            locationConfidence:
              confidence.level,
            locationScore:
              confidence.score,
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
        `تم تحليل موقع الأرض المحدد على الخريطة، ووجد النظام ${crops.length} محاصيل مناسبة مبدئيًا للمناخ ${climate}.`,
      warning:
        "التوصية أولية ولا تعني أن الصنف هو الأفضل. القرار النهائي يحتاج بيانات التربة والمياه والصنف المحلي وموعد الزراعة.",
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

    const climate =
      getClimate(location.latitude);

    const climateKey =
      getClimateKey(location.latitude);

    const suitable =
      Boolean(
        climateKey &&
        crop.climates.includes(climateKey)
      );

    const varieties =
      crop.varieties.filter(variety => {
        if (!climate) {
          return true;
        }

        return variety.suitability.includes(
          climate
        );
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
      locationSource: location.source,
      suitable,
      seasons: crop.seasons,
      varieties,
      varietyCount: varieties.length,
      locationConfidence: confidence.level,
      message: suitable
        ? `أصناف ${crop.name} المناسبة مبدئيًا لموقع الأرض ومناخه ${climate}.`
        : `المناخ ${climate || "غير محدد"} ليس مناخًا رئيسيًا لهذا المحصول حسب قاعدة التوصية الحالية.`,
      warning:
        "لا يتم اعتبار أي صنف الأفضل للموقع دون مصدر زراعي موثوق مرتبط بالموقع.",
    };
  }

  getSeedRecommendations(
    cropIdOrName,
    latitudeOrLocation,
    longitude = null
  ) {
    const location =
      latitudeOrLocation &&
      typeof latitudeOrLocation === "object"
        ? normalizeLocation(latitudeOrLocation)
        : normalizeLocation({
            latitude: latitudeOrLocation,
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

    return this.getCropOptions(
      cropIdOrName,
      location
    );
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

    const type =
      data.cultivationType || "field";

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
