// =========================================================
// LAVENDER — CROP MODEL
// src/models/CropModel.js
// =========================================================

export const CropModel = Object.freeze({

  create(data = {}) {

    const latitude =
      Number(data.latitude);

    const longitude =
      Number(data.longitude);

    const boundary =
      Array.isArray(data.boundary)
        ? data.boundary
        : Array.isArray(data.points)
          ? data.points
          : [];

    const productionQuantity =
      Number(data.productionQuantity);

    const pricePerTon =
      Number(data.pricePerTon);

    const totalExpenses =
      Number(data.totalExpenses);

    const safeProduction =
      Number.isFinite(productionQuantity)
        ? productionQuantity
        : 0;

    const safePrice =
      Number.isFinite(pricePerTon)
        ? pricePerTon
        : 0;

    const safeExpenses =
      Number.isFinite(totalExpenses)
        ? totalExpenses
        : 0;

    const revenue =
      safeProduction * safePrice;

    const profit =
      revenue - safeExpenses;

    return {

      id:
        data.id ?? null,

      // =====================================================
      // FARM
      // =====================================================

      farmId:
        data.farmId
          ? String(data.farmId)
          : "",

      cultivationType:
        data.cultivationType ||
        "field",

      // =====================================================
      // CROP
      // =====================================================

      name:
        String(
          data.name ?? ""
        ).trim(),

      seedType:
        String(
          data.seedType ?? ""
        ).trim(),

      seedVariety:
        String(
          data.seedVariety ?? ""
        ).trim(),

      seedQuality:
        String(
          data.seedQuality ?? ""
        ).trim(),

      seedQuantity:
        Number(
          data.seedQuantity || 0
        ),

      treeType:
        String(
          data.treeType ?? ""
        ).trim(),

      treeVariety:
        String(
          data.treeVariety ?? ""
        ).trim(),

      // =====================================================
      // DATES
      // =====================================================

      plantingDate:
        data.plantingDate || "",

      harvestDate:
        data.harvestDate || "",

      actualHarvestDate:
        data.actualHarvestDate || "",

      // =====================================================
      // FERTILIZER
      // =====================================================

      fertilizerType:
        String(
          data.fertilizerType ?? ""
        ).trim(),

      fertilizerQuantity:
        Number(
          data.fertilizerQuantity || 0
        ),

      // =====================================================
      // PRODUCTION
      // =====================================================

      expectedProduction:
        Number(
          data.expectedProduction || 0
        ),

      productionQuantity:
        safeProduction,

      productionUnit:
        String(
          data.productionUnit ||
          "طن"
        ).trim(),

      pricePerTon:
        safePrice,

      // =====================================================
      // FINANCIAL
      // =====================================================

      revenue,

      totalExpenses:
        safeExpenses,

      profit,

      // =====================================================
      // HARVEST STATUS
      // =====================================================

      harvestStatus:
        data.harvestStatus ||
        "pending",

      // =====================================================
      // LOCATION
      // =====================================================

      latitude:
        Number.isFinite(latitude)
          ? latitude
          : null,

      longitude:
        Number.isFinite(longitude)
          ? longitude
          : null,

      boundary,

      locationId:
        data.locationId ?? null,

      area:
        Number.isFinite(
          Number(data.area)
        )
          ? Number(data.area)
          : null,

      perimeter:
        Number.isFinite(
          Number(data.perimeter)
        )
          ? Number(data.perimeter)
          : null,

      // =====================================================
      // LOCATION METADATA
      // =====================================================

      country:
        String(
          data.country ?? ""
        ).trim(),

      governorate:
        String(
          data.governorate ?? ""
        ).trim(),

      region:
        String(
          data.region ?? ""
        ).trim(),

      district:
        String(
          data.district ?? ""
        ).trim(),

      municipality:
        String(
          data.municipality ?? ""
        ).trim(),

      province:
        String(
          data.province ?? ""
        ).trim(),

      state:
        String(
          data.state ?? ""
        ).trim(),

      city:
        String(
          data.city ?? ""
        ).trim(),

      town:
        String(
          data.town ?? ""
        ).trim(),

      village:
        String(
          data.village ?? ""
        ).trim(),

      hamlet:
        String(
          data.hamlet ?? ""
        ).trim(),

      locationName:
        String(
          data.locationName ?? ""
        ).trim(),

      placeName:
        String(
          data.placeName ?? ""
        ).trim(),

      locationDescription:
        String(
          data.locationDescription ?? ""
        ).trim(),

      // =====================================================
      // CLIMATE
      // =====================================================

      climate:
        String(
          data.climate ?? ""
        ).trim(),

      recommendedSeeds:
        Array.isArray(
          data.recommendedSeeds
        )
          ? data.recommendedSeeds
          : [],

      recommendedSeedVarieties:
        Array.isArray(
          data.recommendedSeedVarieties
        )
          ? data.recommendedSeedVarieties
          : [],

      // =====================================================
      // NOTES
      // =====================================================

      notes:
        String(
          data.notes ?? ""
        ).trim(),

      status:
        data.status ||
        "active",

      createdAt:
        data.createdAt ||
        null,

      updatedAt:
        data.updatedAt ||
        null,
    };
  },

});
