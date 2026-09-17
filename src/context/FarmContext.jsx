// =========================================================
// LAVENDER — FARM CONTEXT
// src/context/FarmContext.jsx
// =========================================================

import {
  createContext,
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
      const safeResult = Array.isArray(result) ? result : [];
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
      const result = await controller.update(id, data);

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
      const result = await controller.delete(id);

      setData((prev) =>
        prev.filter(
          (item) =>
            String(item.id) !== String(id)
        )
      );

      return result;
    },

    count: async () => {
      if (typeof controller.count === "function") {
        return controller.count();
      }

      const result = await controller.getAll();
      return Array.isArray(result) ? result.length : 0;
    },

    exists: async (id) => {
      if (typeof controller.exists === "function") {
        return controller.exists(id);
      }

      const result = await controller.getById(id);
      return Boolean(result);
    },
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

  const [irrigations, setIrrigations] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [pesticides, setPesticides] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [consultations, setConsultations] = useState([]);
  const [aiQuestions, setAiQuestions] = useState([]);

  // -------------------------------------------------------
  // Actions
  // -------------------------------------------------------

  const farmActions = createActions(
    setFarms,
    farmController
  );

  const fieldActions = createActions(
    setFields,
    fieldController
  );

  const irrigationActions = createActions(
    setIrrigations,
    irrigationController
  );

  const fertilizerActions = createActions(
    setFertilizers,
    fertilizerController
  );

  const pesticideActions = createActions(
    setPesticides,
    pesticideController
  );

  const diseaseActions = createActions(
    setDiseases,
    diseaseController
  );

  const expenseActions = createActions(
    setExpenses,
    expenseController
  );

  const harvestActions = createActions(
    setHarvests,
    harvestController
  );

  const inventoryActions = createActions(
    setInventory,
    inventoryController
  );

  // =======================================================
  // LOCATION ACTIONS
  // Page → Context → Service → Repository → Storage
  // =======================================================

  const locationActions = {
    load: async () => {
      const result = await mapService.getAllLocations();

      const safeResult = Array.isArray(result)
        ? result
        : [];

      setLocations(safeResult);

      return safeResult;
    },

    getByFarmId: async (farmId) => {
      if (!farmId) {
        return [];
      }

      const result =
        await mapService.getLocationsByFarmId(
          farmId
        );

      return Array.isArray(result)
        ? result
        : [];
    },

    getLatestByFarmId: async (farmId) => {
      if (!farmId) {
        return null;
      }

      return mapService.getLocationByFarmId(
        farmId
      );
    },

    create: async (data) => {
      const result =
        await mapService.createLocation(data);

      if (result) {
        setLocations((prev) => {
          const filtered = prev.filter(
            (item) =>
              String(item.farmId) !==
              String(result.farmId)
          );

          return [...filtered, result];
        });
      }

      return result;
    },

    update: async (id, data) => {
      const result =
        await mapService.updateLocation(
          id,
          data
        );

      if (result) {
        setLocations((prev) => {
          const exists = prev.some(
            (item) =>
              String(item.id) === String(id)
          );

          if (!exists) {
            return [...prev, result];
          }

          return prev.map((item) =>
            String(item.id) === String(id)
              ? result
              : item
          );
        });
      }

      return result;
    },

    delete: async (id) => {
      const result =
        await mapService.deleteLocation(id);

      setLocations((prev) =>
        prev.filter(
          (item) =>
            String(item.id) !== String(id)
        )
      );

      return result;
    },

    count: async () => {
      const result =
        await mapService.getAllLocations();

      return Array.isArray(result)
        ? result.length
        : 0;
    },

    exists: async (id) => {
      if (!id) {
        return false;
      }

      const result =
        await mapService.getLocationById(id);

      return Boolean(result);
    },
  };

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
          Array.isArray(locationsResult)
            ? locationsResult
            : []
        );

        setIrrigations(
          Array.isArray(irrigationsResult)
            ? irrigationsResult
            : []
        );

        setFertilizers(
          Array.isArray(fertilizersResult)
            ? fertilizersResult
            : []
        );

        setPesticides(
          Array.isArray(pesticidesResult)
            ? pesticidesResult
            : []
        );

        setDiseases(
          Array.isArray(diseasesResult)
            ? diseasesResult
            : []
        );

        setExpenses(
          Array.isArray(expensesResult)
            ? expensesResult
            : []
        );

        setHarvests(
          Array.isArray(harvestsResult)
            ? harvestsResult
            : []
        );

        setInventory(
          Array.isArray(inventoryResult)
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
      fields,
      locations,
      irrigations,
      fertilizers,
      pesticides,
      diseases,
      expenses,
      harvests,
      inventory,
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
