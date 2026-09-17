// =========================================================
// LAVENDER — FARM CONTEXT
// src/context/FarmContext.jsx
// =========================================================

import {
  createContext,
  useMemo,
  useEffect,
  useState,
} from "react";

import farmController from "../controllers/farmController.js";
import fieldController from "../controllers/fieldController.js";
import irrigationController from "../controllers/irrigationController.js";
import fertilizerController from "../controllers/fertilizerController.js";
import pesticideController from "../controllers/pesticideController.js";
import diseaseController from "../controllers/diseaseController.js";
import expenseController from "../controllers/expenseController.js";
import harvestController from "../controllers/harvestController.js";
import inventoryController from "../controllers/inventoryController.js";

import mapService from "../services/mapService.js";

export const FarmContext = createContext(null);

// =========================================================
// Generic helpers
// =========================================================

function clean(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

function normalizeFarmId(value) {
  return clean(value);
}

function getFarmId(farm) {
  if (!farm) {
    return "";
  }

  return normalizeFarmId(
    farm.id ??
      farm.farmId ??
      farm._id ??
      farm.farm_id ??
      ""
  );
}

function getFarmName(farm) {
  if (!farm) {
    return "";
  }

  return clean(
    farm.name ??
      farm.farmName ??
      farm.title ??
      ""
  );
}

// =========================================================
// Location helpers
// =========================================================

function getLocationFarmId(location) {
  if (!location) {
    return "";
  }

  return normalizeFarmId(
    location.farmId ??
      location.farmID ??
      location.farm_id ??
      location.farm?.id ??
      location.farm?._id ??
      location.farm?.farmId ??
      ""
  );
}

function getLocationFarmName(location) {
  if (!location) {
    return "";
  }

  return clean(
    location.farmName ??
      location.farm?.name ??
      location.farm?.farmName ??
      location.name ??
      ""
  );
}

function getLatitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.latitude ??
    location.lat ??
    location.center?.latitude ??
    location.center?.lat ??
    location.coordinates?.latitude ??
    location.coordinates?.lat;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function getLongitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.longitude ??
    location.lng ??
    location.lon ??
    location.center?.longitude ??
    location.center?.lng ??
    location.coordinates?.longitude ??
    location.coordinates?.lng;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function hasValidCoordinates(location) {
  const latitude =
    getLatitude(location);

  const longitude =
    getLongitude(location);

  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function getLocationDate(location) {
  if (!location) {
    return 0;
  }

  const date =
    location.updatedAt ??
    location.createdAt ??
    location.savedAt ??
    location.timestamp ??
    0;

  const parsed =
    Date.parse(date);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function normalizeLocation(location) {
  if (!location) {
    return null;
  }

  const latitude =
    getLatitude(location);

  const longitude =
    getLongitude(location);

  return {
    ...location,

    farmId:
      getLocationFarmId(location),

    farmName:
      getLocationFarmName(location),

    latitude,
    longitude,

    lat: latitude,
    lng: longitude,
  };
}

// =========================================================
// Resolve farm location
// =========================================================
//
// القاعدة:
//
// 1. farmId هو المصدر الأساسي.
// 2. إذا لم يوجد farmId مطابق:
//    نستخدم farmName فقط للسجل القديم.
// 3. إذا كان الاسم مكررًا، لا نختار موقعًا عشوائيًا.
// 4. يجب أن يحتوي الموقع على GPS صالح.
// =========================================================

function resolveFarmLocation(
  locationList,
  farmId,
  farmName
) {
  if (!Array.isArray(locationList)) {
    return null;
  }

  const wantedFarmId =
    normalizeFarmId(farmId);

  const wantedFarmName =
    clean(farmName);

  const normalized =
    locationList
      .map(normalizeLocation)
      .filter(Boolean)
      .filter(hasValidCoordinates);

  // -------------------------------------------------------
  // 1. المطابقة الأساسية بواسطة farmId
  // -------------------------------------------------------

  if (wantedFarmId) {
    const byFarmId =
      normalized
        .filter(
          (location) =>
            getLocationFarmId(
              location
            ) === wantedFarmId
        )
        .sort(
          (a, b) =>
            getLocationDate(b) -
            getLocationDate(a)
        );

    if (byFarmId.length > 0) {
      return byFarmId[0];
    }
  }

  // -------------------------------------------------------
  // 2. السجلات القديمة التي لا تحتوي farmId
  // -------------------------------------------------------

  if (wantedFarmName) {
    const legacyByName =
      normalized.filter(
        (location) =>
          !getLocationFarmId(
            location
          ) &&
          getLocationFarmName(
            location
          ) === wantedFarmName
      );

    if (legacyByName.length === 1) {
      return legacyByName[0];
    }
  }

  // -------------------------------------------------------
  // 3. توافق مع البيانات القديمة
  //
  // إذا كان farmName فريدًا تمامًا في المواقع،
  // يمكن استخدامه كحل احتياطي.
  //
  // لا نستخدمه عندما توجد عدة مواقع بنفس الاسم.
  // -------------------------------------------------------

  if (wantedFarmName) {
    const sameName =
      normalized.filter(
        (location) =>
          getLocationFarmName(
            location
          ) === wantedFarmName
      );

    if (sameName.length === 1) {
      return sameName[0];
    }
  }

  return null;
}

// =========================================================
// Generic Actions
// =========================================================

function createActions(
  setData,
  controller
) {
  return {
    load: async () => {
      const result =
        await controller.getAll();

      const safeResult =
        Array.isArray(result)
          ? result
          : [];

      setData(safeResult);

      return safeResult;
    },

    create: async (data) => {
      const result =
        await controller.create(data);

      if (result) {
        setData((prev) => [
          ...prev,
          result,
        ]);
      }

      return result;
    },

    update: async (
      id,
      data
    ) => {
      const result =
        await controller.update(
          id,
          data
        );

      if (result) {
        setData((prev) =>
          prev.map((item) =>
            String(item.id) ===
            String(id)
              ? result
              : item
          )
        );
      }

      return result;
    },

    delete: async (id) => {
      const result =
        await controller.delete(id);

      setData((prev) =>
        prev.filter(
          (item) =>
            String(item.id) !==
            String(id)
        )
      );

      return result;
    },

    count: async () => {
      if (
        typeof controller.count ===
        "function"
      ) {
        return controller.count();
      }

      const result =
        await controller.getAll();

      return Array.isArray(result)
        ? result.length
        : 0;
    },

    exists: async (id) => {
      if (
        typeof controller.exists ===
        "function"
      ) {
        return controller.exists(id);
      }

      const result =
        await controller.getById(id);

      return Boolean(result);
    },
  };
}

// =========================================================
// Provider
// =========================================================

export function FarmProvider({
  children,
}) {
  // -------------------------------------------------------
  // State
  // -------------------------------------------------------

  const [farms, setFarms] =
    useState([]);

  const [fields, setFields] =
    useState([]);

  const [locations, setLocations] =
    useState([]);

  const [irrigations, setIrrigations] =
    useState([]);

  const [fertilizers, setFertilizers] =
    useState([]);

  const [pesticides, setPesticides] =
    useState([]);

  const [diseases, setDiseases] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [harvests, setHarvests] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);

  const [consultations, setConsultations] =
    useState([]);

  const [aiQuestions, setAiQuestions] =
    useState([]);

  // =======================================================
  // Generic actions
  // =======================================================

  const farmActions = useMemo(
    () =>
      createActions(
        setFarms,
        farmController
      ),
    []
  );

  const fieldActions = useMemo(
    () =>
      createActions(
        setFields,
        fieldController
      ),
    []
  );

  const irrigationActions =
    useMemo(
      () =>
        createActions(
          setIrrigations,
          irrigationController
        ),
      []
    );

  const fertilizerActions =
    useMemo(
      () =>
        createActions(
          setFertilizers,
          fertilizerController
        ),
      []
    );

  const pesticideActions =
    useMemo(
      () =>
        createActions(
          setPesticides,
          pesticideController
        ),
      []
    );

  const diseaseActions =
    useMemo(
      () =>
        createActions(
          setDiseases,
          diseaseController
        ),
      []
    );

  const expenseActions =
    useMemo(
      () =>
        createActions(
          setExpenses,
          expenseController
        ),
      []
    );

  const harvestActions =
    useMemo(
      () =>
        createActions(
          setHarvests,
          harvestController
        ),
      []
    );

  const inventoryActions =
    useMemo(
      () =>
        createActions(
          setInventory,
          inventoryController
        ),
      []
    );

  // =======================================================
  // LOCATION ACTIONS
  // =======================================================

  const locationActions = useMemo(
    () => ({
      // ---------------------------------------------------
      // Load all locations
      // ---------------------------------------------------

      load: async () => {
        const result =
          await mapService.getAllLocations();

        const safeResult =
          Array.isArray(result)
            ? result
                .map(
                  normalizeLocation
                )
                .filter(Boolean)
            : [];

        setLocations(
          safeResult
        );

        return safeResult;
      },

      // ---------------------------------------------------
      // Get locations by farmId
      // ---------------------------------------------------

      getByFarmId:
        async (farmId) => {
          const wantedFarmId =
            normalizeFarmId(
              farmId
            );

          if (!wantedFarmId) {
            return [];
          }

          // نطلب من service البحث المباشر
          if (
            typeof mapService
              .getLocationsByFarmId ===
            "function"
          ) {
            const directResult =
              await mapService.getLocationsByFarmId(
                wantedFarmId
              );

            if (
              Array.isArray(
                directResult
              )
            ) {
              return directResult
                .map(
                  normalizeLocation
                )
                .filter(Boolean)
                .filter(
                  hasValidCoordinates
                );
            }
          }

          // fallback
          const all =
            await mapService.getAllLocations();

          return Array.isArray(all)
            ? all
                .map(
                  normalizeLocation
                )
                .filter(Boolean)
                .filter(
                  (location) =>
                    getLocationFarmId(
                      location
                    ) ===
                    wantedFarmId
                )
                .filter(
                  hasValidCoordinates
                )
            : [];
        },

      // ---------------------------------------------------
      // Get latest location for farm
      // ---------------------------------------------------

      getLatestByFarmId:
        async (
          farmId,
          farmName = ""
        ) => {
          const wantedFarmId =
            normalizeFarmId(
              farmId
            );

          const wantedFarmName =
            clean(farmName);

          if (!wantedFarmId) {
            return null;
          }

          // -----------------------------------------------
          // 1. البحث المباشر في service
          // -----------------------------------------------

          if (
            typeof mapService
              .getLocationByFarmId ===
            "function"
          ) {
            try {
              const direct =
                await mapService.getLocationByFarmId(
                  wantedFarmId
                );

              if (
                direct &&
                hasValidCoordinates(
                  direct
                )
              ) {
                return normalizeLocation(
                  direct
                );
              }
            } catch (error) {
              console.error(
                "LAVENDER direct farm location error:",
                error
              );
            }
          }

          // -----------------------------------------------
          // 2. getLocationsByFarmId
          // -----------------------------------------------

          try {
            const directList =
              await mapService.getLocationsByFarmId(
                wantedFarmId
              );

            const resolved =
              resolveFarmLocation(
                directList,
                wantedFarmId,
                wantedFarmName
              );

            if (resolved) {
              return resolved;
            }
          } catch (error) {
            console.error(
              "LAVENDER farm locations error:",
              error
            );
          }

          // -----------------------------------------------
          // 3. تحميل جميع المواقع
          // -----------------------------------------------

          let allLocations = [];

          try {
            allLocations =
              await mapService.getAllLocations();
          } catch (error) {
            console.error(
              "LAVENDER all locations error:",
              error
            );
          }

          const resolved =
            resolveFarmLocation(
              allLocations,
              wantedFarmId,
              wantedFarmName
            );

          if (resolved) {
            return resolved;
          }

          return null;
        },

      // ---------------------------------------------------
      // Create location
      // ---------------------------------------------------

      create: async (data) => {
        const result =
          await mapService.createLocation(
            data
          );

        const normalized =
          normalizeLocation(result);

        if (normalized) {
          setLocations((prev) => {
            const newFarmId =
              getLocationFarmId(
                normalized
              );

            if (!newFarmId) {
              return [
                ...prev,
                normalized,
              ];
            }

            const filtered =
              prev.filter(
                (item) =>
                  getLocationFarmId(
                    item
                  ) !== newFarmId
              );

            return [
              ...filtered,
              normalized,
            ];
          });
        }

        return normalized;
      },

      // ---------------------------------------------------
      // Update location
      // ---------------------------------------------------

      update:
        async (
          id,
          data
        ) => {
          const result =
            await mapService.updateLocation(
              id,
              data
            );

          const normalized =
            normalizeLocation(result);

          if (normalized) {
            setLocations((prev) => {
              const exists =
                prev.some(
                  (item) =>
                    String(
                      item.id
                    ) ===
                    String(
                      normalized.id
                    )
                );

              if (!exists) {
                return [
                  ...prev,
                  normalized,
                ];
              }

              return prev.map(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(
                    normalized.id
                  )
                    ? normalized
                    : item
              );
            });
          }

          return normalized;
        },

      // ---------------------------------------------------
      // Delete location
      // ---------------------------------------------------

      delete: async (id) => {
        const result =
          await mapService.deleteLocation(
            id
          );

        setLocations((prev) =>
          prev.filter(
            (item) =>
              String(
                item.id
              ) !== String(id)
          )
        );

        return result;
      },

      // ---------------------------------------------------
      // Count
      // ---------------------------------------------------

      count: async () => {
        const result =
          await mapService.getAllLocations();

        return Array.isArray(result)
          ? result.length
          : 0;
      },

      // ---------------------------------------------------
      // Exists
      // ---------------------------------------------------

      exists: async (id) => {
        if (!id) {
          return false;
        }

        const result =
          await mapService.getLocationById(
            id
          );

        return Boolean(result);
      },
    }),
    []
  );

  // =======================================================
  // Initial loading
  // =======================================================

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        const [
          farmsResult,
          fieldsResult,
          locationsResult,
          irrigationsResult,
          fertilizersResult,
          pesticidesResult,
          diseasesResult,
          expensesResult,
          harvestsResult,
          inventoryResult,
        ] = await Promise.all([
          farmController.getAll(),
          fieldController.getAll(),
          mapService.getAllLocations(),
          irrigationController.getAll(),
          fertilizerController.getAll(),
          pesticideController.getAll(),
          diseaseController.getAll(),
          expenseController.getAll(),
          harvestController.getAll(),
          inventoryController.getAll(),
        ]);

        if (!mounted) {
          return;
        }

        setFarms(
          Array.isArray(
            farmsResult
          )
            ? farmsResult
            : []
        );

        setFields(
          Array.isArray(
            fieldsResult
          )
            ? fieldsResult
            : []
        );

        setLocations(
          Array.isArray(
            locationsResult
          )
            ? locationsResult
                .map(
                  normalizeLocation
                )
                .filter(Boolean)
            : []
        );

        setIrrigations(
          Array.isArray(
            irrigationsResult
          )
            ? irrigationsResult
            : []
        );

        setFertilizers(
          Array.isArray(
            fertilizersResult
          )
            ? fertilizersResult
            : []
        );

        setPesticides(
          Array.isArray(
            pesticidesResult
          )
            ? pesticidesResult
            : []
        );

        setDiseases(
          Array.isArray(
            diseasesResult
          )
            ? diseasesResult
            : []
        );

        setExpenses(
          Array.isArray(
            expensesResult
          )
            ? expensesResult
            : []
        );

        setHarvests(
          Array.isArray(
            harvestsResult
          )
            ? harvestsResult
            : []
        );

        setInventory(
          Array.isArray(
            inventoryResult
          )
            ? inventoryResult
            : []
        );
      } catch (error) {
        console.error(
          "LAVENDER FarmContext load error:",
          error
        );
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  // =======================================================
  // Context value
  // =======================================================

  const value = useMemo(
    () => ({
      farms,
      setFarms,
      farmActions,

      fields,
      setFields,
      fieldActions,

      locations,
      setLocations,
      locationActions,

      irrigations,
      setIrrigations,
      irrigationActions,

      fertilizers,
      setFertilizers,
      fertilizerActions,

      pesticides,
      setPesticides,
      pesticideActions,

      diseases,
      setDiseases,
      diseaseActions,

      expenses,
      setExpenses,
      expenseActions,

      harvests,
      setHarvests,
      harvestActions,

      inventory,
      setInventory,
      inventoryActions,

      consultations,
      setConsultations,

      aiQuestions,
      setAiQuestions,
    }),
    [
      farms,
      farmActions,

      fields,
      fieldActions,

      locations,
      locationActions,

      irrigations,
      irrigationActions,

      fertilizers,
      fertilizerActions,

      pesticides,
      pesticideActions,

      diseases,
      diseaseActions,

      expenses,
      expenseActions,

      harvests,
      harvestActions,

      inventory,
      inventoryActions,

      consultations,
      aiQuestions,
    ]
  );

  return (
    <FarmContext.Provider
      value={value}
    >
      {children}
    </FarmContext.Provider>
  );
}

export default FarmContext;
