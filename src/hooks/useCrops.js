// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService from "../services/cropService.js";


// =========================================================
// HELPERS
// =========================================================

function normalizeNumber(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


// =========================================================
// DATE
// =========================================================

function normalizeDate(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const date =
    String(value).trim();

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return date;
  }

  return "";
}


// =========================================================
// BOUNDARY
// =========================================================

function normalizeBoundary(value) {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(point => {

      if (Array.isArray(point)) {

        return {
          latitude:
            normalizeNumber(point[0]),

          longitude:
            normalizeNumber(point[1]),
        };
      }

      return {

        latitude:
          normalizeNumber(
            point?.latitude ??
            point?.lat
          ),

        longitude:
          normalizeNumber(
            point?.longitude ??
            point?.lng ??
            point?.lon
          ),

      };

    })
    .filter(
      point =>
        Number.isFinite(
          point.latitude
        ) &&
        Number.isFinite(
          point.longitude
        )
    );
}


// =========================================================
// CROP NORMALIZATION
// =========================================================

function normalizeCropData(
  data = {}
) {

  const points =
    normalizeBoundary(
      data.points ??
      data.boundary ??
      []
    );


  const latitude =
    normalizeNumber(
      data.latitude
    );


  const longitude =
    normalizeNumber(
      data.longitude
    );


  const productionQuantity =
    normalizeNumber(
      data.productionQuantity
    );


  const pricePerTon =
    normalizeNumber(
      data.pricePerTon
    );


  const totalExpenses =
    normalizeNumber(
      data.totalExpenses
    );


  const safeProduction =
    productionQuantity ?? 0;

  const safePrice =
    pricePerTon ?? 0;

  const safeExpenses =
    totalExpenses ?? 0;


  const revenue =
    Number.isFinite(
      Number(data.revenue)
    )
      ? Number(data.revenue)
      : safeProduction * safePrice;


  const profit =
    Number.isFinite(
      Number(data.profit)
    )
      ? Number(data.profit)
      : revenue - safeExpenses;


  return {

    ...data,

    id:
      data.id ?? null,

    farmId:
      data.farmId
        ? String(data.farmId)
        : "",

    cultivationType:
      data.cultivationType ||
      "field",

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
      normalizeNumber(
        data.seedQuantity
      ),

    treeType:
      String(
        data.treeType ?? ""
      ).trim(),

    treeVariety:
      String(
        data.treeVariety ?? ""
      ).trim(),

    plantingDate:
      normalizeDate(
        data.plantingDate
      ),

    fertilizerType:
      String(
        data.fertilizerType ?? ""
      ).trim(),

    fertilizerQuantity:
      normalizeNumber(
        data.fertilizerQuantity
      ),

    harvestDate:
      normalizeDate(
        data.harvestDate
      ),

    actualHarvestDate:
      normalizeDate(
        data.actualHarvestDate
      ),

    expectedProduction:
      normalizeNumber(
        data.expectedProduction
      ),

    // =====================================================
    // REAL PRODUCTION
    // =====================================================

    productionQuantity,

    productionUnit:
      String(
        data.productionUnit ||
        "طن"
      ).trim(),

    pricePerTon,

    // =====================================================
    // FINANCIAL
    // =====================================================

    revenue,

    totalExpenses,

    profit,

    // =====================================================
    // HARVEST STATUS
    // =====================================================

    harvestStatus:
      data.harvestStatus ||
      "pending",

    latitude,

    longitude,

    points,

    boundary:
      points,

    locationId:
      data.locationId ?? null,

    area:
      normalizeNumber(
        data.area
      ),

    perimeter:
      normalizeNumber(
        data.perimeter
      ),

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
      String(
        data.notes ?? ""
      ).trim(),

  };
}


// =========================================================
// HOOK
// =========================================================

export default function useCrops() {

  const [
    crops,
    setCrops,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const loadCrops =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await cropService.getAll();

          const normalized =
            Array.isArray(data)
              ? data.map(
                  normalizeCropData
                )
              : [];

          setCrops(
            normalized
          );

          return normalized;

        } catch (loadError) {

          console.error(
            "Crops loading failed:",
            loadError
          );

          setCrops([]);

          setError(
            loadError?.message ||
            "تعذر تحميل المحاصيل"
          );

          return [];

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(() => {

    loadCrops();

  }, [loadCrops]);


  // =======================================================
  // ADD
  // =======================================================

  const addCrop =
    useCallback(
      async data => {

        const normalized =
          normalizeCropData(
            data
          );

        if (
          !normalized.farmId
        ) {

          throw new Error(
            "CROP_FARM_REQUIRED"
          );

        }

        if (
          !normalized.name &&
          !normalized.treeType
        ) {

          throw new Error(
            "CROP_NAME_REQUIRED"
          );

        }

        if (
          !Number.isFinite(
            normalized.latitude
          ) ||
          !Number.isFinite(
            normalized.longitude
          )
        ) {

          throw new Error(
            "CROP_LOCATION_REQUIRED"
          );

        }

        const created =
          await cropService.create(
            normalized
          );

        const result =
          normalizeCropData(
            created
          );

        setCrops(
          current => [
            ...current,
            result,
          ]
        );

        return result;

      },
      []
    );


  // =======================================================
  // UPDATE
  // =======================================================

  const updateCrop =
    useCallback(
      async (
        id,
        data
      ) => {

        const normalized =
          normalizeCropData(
            data
          );

        const updated =
          await cropService.update(
            id,
            normalized
          );

        if (!updated) {
          return null;
        }

        const result =
          normalizeCropData(
            updated
          );

        setCrops(
          current =>
            current.map(
              crop =>
                String(crop.id) ===
                String(id)
                  ? result
                  : crop
            )
        );

        return result;

      },
      []
    );


  // =======================================================
  // DELETE
  // =======================================================

  const deleteCrop =
    useCallback(
      async id => {

        if (!id) {
          return false;
        }

        const deleted =
          await cropService.delete(
            id
          );

        if (!deleted) {
          return false;
        }

        setCrops(
          current =>
            current.filter(
              crop =>
                String(crop.id) !==
                String(id)
            )
        );

        return true;

      },
      []
    );


  // =======================================================
  // SEARCH
  // =======================================================

  const searchCrops =
    useCallback(
      query => {

        const value =
          String(
            query ?? ""
          )
            .trim()
            .toLowerCase();

        if (!value) {
          return crops;
        }

        return crops.filter(
          crop => {

            const searchable = [

              crop.name,
              crop.treeType,
              crop.seedType,
              crop.seedVariety,
              crop.fertilizerType,

              crop.locationName,
              crop.placeName,

              crop.country,
              crop.governorate,
              crop.region,
              crop.district,
              crop.municipality,
              crop.province,
              crop.state,
              crop.city,
              crop.town,
              crop.village,
              crop.hamlet,

              crop.climate,
              crop.notes,

            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchable.includes(
              value
            );

          }
        );

      },
      [crops]
    );


  // =======================================================
  // STATISTICS
  // =======================================================

  const getStatistics =
    useCallback(
      () => {

        return {

          total:
            crops.length,

          withLocation:
            crops.filter(
              crop =>
                Number.isFinite(
                  crop.latitude
                ) &&
                Number.isFinite(
                  crop.longitude
                )
            ).length,

          withBoundary:
            crops.filter(
              crop =>
                Array.isArray(
                  crop.boundary
                ) &&
                crop.boundary.length >= 3
            ).length,

          totalProduction:
            crops.reduce(
              (sum, crop) =>
                sum +
                (Number(crop.productionQuantity) || 0),
              0
            ),

          totalRevenue:
            crops.reduce(
              (sum, crop) =>
                sum +
                (Number(crop.revenue) || 0),
              0
            ),

          totalExpenses:
            crops.reduce(
              (sum, crop) =>
                sum +
                (Number(crop.totalExpenses) || 0),
              0
            ),

          totalProfit:
            crops.reduce(
              (sum, crop) =>
                sum +
                (Number(crop.profit) || 0),
              0
            ),

        };

      },
      [crops]
    );


  return {

    crops,

    loading,

    error,

    loadCrops,

    addCrop,

    updateCrop,

    deleteCrop,

    searchCrops,

    getStatistics,

  };

}
