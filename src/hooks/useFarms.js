// src/hooks/useFarms.js

import {
  useCallback,
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext.js";

export default function useFarms() {
  const context =
    useContext(FarmContext);

  if (!context) {
    throw new Error(
      "useFarms must be used inside FarmProvider"
    );
  }

  const {
    farms = [],
    farmActions,
  } = context;

  const addFarm = useCallback(
    async (data) => {
      if (!farmActions?.create) {
        throw new Error(
          "Farm create action is not available"
        );
      }

      return farmActions.create(data);
    },
    [farmActions]
  );

  const updateFarm = useCallback(
    async (id, data) => {
      if (!farmActions?.update) {
        throw new Error(
          "Farm update action is not available"
        );
      }

      return farmActions.update(id, data);
    },
    [farmActions]
  );

  const deleteFarm = useCallback(
    async (id) => {
      if (!farmActions?.delete) {
        throw new Error(
          "Farm delete action is not available"
        );
      }

      return farmActions.delete(id);
    },
    [farmActions]
  );

  const loadFarms = useCallback(
    async () => {
      if (!farmActions?.load) {
        throw new Error(
          "Farm load action is not available"
        );
      }

      return farmActions.load();
    },
    [farmActions]
  );

  const searchFarms = useCallback(
    (text = "") => {
      const value =
        String(text)
          .toLowerCase()
          .trim();

      if (!value) {
        return farms;
      }

      return farms.filter(
        (farm) =>
          String(farm?.name ?? "")
            .toLowerCase()
            .includes(value)
      );
    },
    [farms]
  );

  const statistics = useMemo(
    () => ({
      total: farms.length,

      active: farms.filter(
        (farm) =>
          farm?.status === "active"
      ).length,

      inactive: farms.filter(
        (farm) =>
          farm?.status === "inactive"
      ).length,
    }),
    [farms]
  );

  return {
    farms,

    addFarm,
    updateFarm,
    deleteFarm,
    loadFarms,

    searchFarms,
    statistics,
  };
}
