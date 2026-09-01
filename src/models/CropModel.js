// =========================================================
// LAVENDER — CROP MODEL
// =========================================================

export const CropModel = Object.freeze({

  create(data = {}) {
    return {
      id: data.id ?? null,

      farmId:
        data.farmId
          ? String(data.farmId)
          : "",

      cultivationType:
        data.cultivationType || "field",

      name:
        String(data.name ?? "").trim(),

      seedType:
        String(data.seedType ?? "").trim(),

      seedVariety:
        String(data.seedVariety ?? "").trim(),

      seedQuality:
        String(data.seedQuality ?? "").trim(),

      seedQuantity:
        Number(data.seedQuantity || 0),

      treeType:
        String(data.treeType ?? "").trim(),

      treeVariety:
        String(data.treeVariety ?? "").trim(),

      plantingDate:
        data.plantingDate || "",

      fertilizerType:
        String(
          data.fertilizerType ?? ""
        ).trim(),

      fertilizerQuantity:
        Number(
          data.fertilizerQuantity || 0
        ),

      harvestDate:
        data.harvestDate || "",

      expectedProduction:
        Number(
          data.expectedProduction || 0
        ),

      // الموقع الجغرافي الحقيقي
      latitude:
        Number.isFinite(
          Number(data.latitude)
        )
          ? Number(data.latitude)
          : null,

      longitude:
        Number.isFinite(
          Number(data.longitude)
        )
          ? Number(data.longitude)
          : null,

      boundary:
        Array.isArray(data.boundary)
          ? data.boundary
          : [],

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

      notes:
        String(data.notes ?? "").trim(),

      status:
        data.status || "active",

      createdAt:
        data.createdAt || null,

      updatedAt:
        data.updatedAt || null,
    };
  },

});
