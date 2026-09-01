// =========================================================
// LAVENDER — CROP MODEL
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

      // يبقى داخليًا للتوافق
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

      // =====================================================
      // REAL FARM LOCATION
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

      // =====================================================
      // LOCATION METADATA
      // =====================================================

      locationId:
        data.locationId ?? null,

      area:
        Number.isFinite(
          Number(data.area)
        )
          ? Number(data.area)
          : null,

      // =====================================================
      // CLIMATE / RECOMMENDATION
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
