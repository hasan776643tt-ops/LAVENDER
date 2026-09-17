// =========================================================
// LAVENDER — FARM CONTEXT
// src/context/FarmContext.jsx
// =========================================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
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
// Generic actions
// =========================================================

function createActions(setData, controller) {
  return {
    load: async () => {
      const result = await controller.getAll();
      const safeResult = Array.isArray(result)
        ? result
        : [];

      setData(safeResult);
      return safeResult;
    },

    create: async (data) => {
      const result = await controller.create(data);

      if (result) {
        setData((prev) => [...prev, result]);
      }

      return result;
    },

    update: async (id, data) => {
      const result =
        await controller.update(id, data);

      if (result) {
        setData((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
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
            String(item.id) !== String(id)
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
// LOCATION HELPERS
// =========================================================

function normalizeFarmId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

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

  return String(
    location.farmName ??
      location.farm?.name ??
      location.farm?.farmName ??
      ""
  ).trim();
}

function getLatitude(location) {
  if (!location) {
    return null;
  }

  const value =
    location.latitude ??
    location.lat ??
    location.center?.latitude ??
    location.center?.lat;

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
    location.center?.lng;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function normalizeLocation(location) {
  if (!location) {
    return null;
  }

  const latitude =
    getLatitude(location);

  const longitude =
    getLongitude(location);

  const farmId =
    getLocationFarmId(location);

  return {
    ...location,

    farmId,

    latitude,
    longitude,

    lat: latitude,
    lng: longitude,
  };
}

// =========================================================
// Provider
// =========================================================

export function FarmProvider({ children }) {
  // -------------------------------------------------------
  // Data
  // -------------------------------------------------------

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [locations, setLocations] = useState([]);

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

  // -------------------------------------------------------
  // Generic actions
  // -------------------------------------------------------

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

  const irrigationActions = useMemo(
    () =>
      createActions(
        setIrrigations,
        irrigationController
      ),
    []
  );

  const fertilizerActions = useMemo(
    () =>
      createActions(
        setFertilizers,
        fertilizerController
      ),
    []
  );

  const pesticideActions = useMemo(
    () =>
      createActions(
        setPesticides,
        pesticideController
      ),
    []
  );

  const diseaseActions = useMemo(
    () =>
      createActions(
        setDiseases,
        diseaseController
      ),
    []
  );

  const expenseActions = useMemo(
    () =>
      createActions(
        setExpenses,
        expenseController
      ),
    []
  );

  const harvestActions = useMemo(
    () =>
      createActions(
        setHarvests,
        harvestController
      ),
    []
  );

  const inventoryActions = useMemo(
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
                .map(normalizeLocation)
                .filter(Boolean)
            : [];

        setLocations(safeResult);

        return safeResult;
      },

      // ---------------------------------------------------
      // Get locations by farm ID
      // ---------------------------------------------------

      getByFarmId: async (farmId) => {
        const wantedFarmId =
          normalizeFarmId(farmId);

        if (!wantedFarmId) {
          return [];
        }

        const allLocations =
          await mapService.getAllLocations();

        if (
          !Array.isArray(
            allLocations
          )
        ) {
          return [];
        }

        return allLocations
          .map(normalizeLocation)
          .filter(Boolean)
          .filter(
            (location) =>
              getLocationFarmId(
                location
              ) === wantedFarmId
          );
      },

      // ---------------------------------------------------
      // Get latest location
      //
      // farmName is optional and is used only
      // to recover old location records whose
      // farmId is missing/different.
      // ---------------------------------------------------

      getLatestByFarmId: async (
        farmId,
        farmName = ""
      ) => {
        const wantedFarmId =
          normalizeFarmId(farmId);

        const wantedFarmName =
          String(
            farmName ?? ""
          ).trim();

        if (!wantedFarmId) {
          return null;
        }

        // -----------------------------------------------
        // اقرأ التخزين مباشرة عبر service
        // -----------------------------------------------

        const allLocations =
          await mapService.getAllLocations();

        if (
          !Array.isArray(
            allLocations
          )
        ) {
          return null;
        }

        const normalizedLocations =
          allLocations
            .map(normalizeLocation)
            .filter(Boolean);

        // -----------------------------------------------
        // البحث الأساسي بواسطة farmId
        // -----------------------------------------------

        const byFarmId =
          normalizedLocations.filter(
            (location) =>
              getLocationFarmId(
                location
              ) === wantedFarmId
          );

        if (byFarmId.length > 0) {
          return byFarmId
            .sort(
              (a, b) =>
                new Date(
                  b.updatedAt ||
                    b.createdAt ||
                    0
                ).getTime() -
                new Date(
                  a.updatedAt ||
                    a.createdAt ||
                    0
                ).getTime()
            )[0];
        }

        // -----------------------------------------------
        // بحث احتياطي للمواقع القديمة
        // بواسطة اسم المزرعة
        // -----------------------------------------------

        if (wantedFarmName) {
          const byFarmName =
            normalizedLocations.filter(
              (location) =>
                getLocationFarmName(
                  location
                ) === wantedFarmName
            );

          if (
            byFarmName.length > 0
          ) {
            return byFarmName
              .sort(
                (a, b) =>
                  new Date(
                    b.updatedAt ||
                      b.createdAt ||
                      0
                  ).getTime() -
                  new Date(
                    a.updatedAt ||
                      a.createdAt ||
                      0
                  ).getTime()
              )[0];
          }
        }

        return null;
      },

      // ---------------------------------------------------
      // Create
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
            const farmId =
              getLocationFarmId(
                normalized
              );

            const filtered =
              prev.filter(
                (item) =>
                  getLocationFarmId(
                    item
                  ) !== farmId
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
      // Update
      // ---------------------------------------------------

      update: async (id, data) => {
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
                  String(item.id) ===
                  String(normalized.id)
              );

            if (!exists) {
              return [
                ...prev,
                normalized,
              ];
            }

            return prev.map((item) =>
              String(item.id) ===
              String(normalized.id)
                ? normalized
                : item
            );
          });
        }

        return normalized;
      },

      // ---------------------------------------------------
      // Delete
      // ---------------------------------------------------

      delete: async (id) => {
        const result =
          await mapService.deleteLocation(
            id
          );

        setLocations((prev) =>
          prev.filter(
            (item) =>
              String(item.id) !==
              String(id)
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
          Array.isArray(farmsResult)
            ? farmsResult
            : []
        );

        setFields(
          Array.isArray(fieldsResult)
            ? fieldsResult
            : []
        );

        setLocations(
          Array.isArray(
            locationsResult
          )
            ? locationsResult
                .map(normalizeLocation)
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
    <FarmContext.Provider value={value}>
      {children}
    </FarmContext.Provider>
  );
}

export default FarmContext;
