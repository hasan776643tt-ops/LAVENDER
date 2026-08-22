import {
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";

import farmController
  from "../controllers/farmController.js";

import fieldController
  from "../controllers/fieldController.js";

import cropController
  from "../controllers/cropController.js";

import irrigationController
  from "../controllers/irrigationController.js";

import fertilizerController
  from "../controllers/fertilizerController.js";

import pesticideController
  from "../controllers/pesticideController.js";

import diseaseController
  from "../controllers/diseaseController.js";

import expenseController
  from "../controllers/expenseController.js";

import harvestController
  from "../controllers/harvestController.js";

import inventoryController
  from "../controllers/inventoryController.js";

export const FarmContext =
  createContext(null);

export function FarmProvider({
  children
}) {

  const [farms, setFarms] =
    useState([]);

  const [fields, setFields] =
    useState([]);

  const [crops, setCrops] =
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

  const createActions =
    (
      setData,
      controller
    ) => ({

      load: async () => {

        const result =
          await controller.getAll();

        const data =
          Array.isArray(result)
            ? result
            : [];

        setData(data);

        return data;
      },

      create: async (data) => {

        const result =
          await controller.create(data);

        setData(prev => [
          ...prev,
          result
        ]);

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

        setData(prev =>
          prev.map(item =>
            String(item.id) ===
            String(id)
              ? result
              : item
          )
        );

        return result;
      },

      delete: async (id) => {

        const result =
          await controller.delete(id);

        setData(prev =>
          prev.filter(item =>
            String(item.id) !==
            String(id)
          )
        );

        return result;
      },

      count: async () => {

        return controller.count();

      },

      exists: async (id) => {

        return controller.exists(id);

      }

    });

  const farmActions =
    useMemo(
      () =>
        createActions(
          setFarms,
          farmController
        ),
      []
    );

  const fieldActions =
    useMemo(
      () =>
        createActions(
          setFields,
          fieldController
        ),
      []
    );

  const cropActions =
    useMemo(
      () =>
        createActions(
          setCrops,
          cropController
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

  useEffect(() => {

    const loadData =
      async () => {

        try {

          await Promise.all([
            farmActions.load(),
            fieldActions.load(),
            cropActions.load(),
            irrigationActions.load(),
            fertilizerActions.load(),
            pesticideActions.load(),
            diseaseActions.load(),
            expenseActions.load(),
            harvestActions.load(),
            inventoryActions.load()
          ]);

        } catch (error) {

          console.error(
            "FarmContext load error:",
            error
          );

        }

      };

    loadData();

  }, [
    farmActions,
    fieldActions,
    cropActions,
    irrigationActions,
    fertilizerActions,
    pesticideActions,
    diseaseActions,
    expenseActions,
    harvestActions,
    inventoryActions
  ]);

  const value =
    useMemo(
      () => ({

        farms,
        fields,
        crops,

        irrigations,
        fertilizers,
        pesticides,

        diseases,

        expenses,
        harvests,

        inventory,

        consultations,
        aiQuestions,

        farmActions,
        fieldActions,
        cropActions,

        irrigationActions,
        fertilizerActions,

        pesticideActions,
        diseaseActions,

        expenseActions,
        harvestActions,

        inventoryActions,

        setFarms,
        setFields,
        setCrops,

        setIrrigations,
        setFertilizers,

        setPesticides,
        setDiseases,

        setExpenses,
        setHarvests,

        setInventory,

        setConsultations,
        setAiQuestions

      }),
      [
        farms,
        fields,
        crops,

        irrigations,
        fertilizers,
        pesticides,

        diseases,

        expenses,
        harvests,

        inventory,

        consultations,
        aiQuestions,

        farmActions,
        fieldActions,
        cropActions,

        irrigationActions,
        fertilizerActions,

        pesticideActions,
        diseaseActions,

        expenseActions,
        harvestActions,

        inventoryActions
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
