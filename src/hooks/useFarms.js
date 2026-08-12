// src/hooks/useFarms.js

import {
  useCallback,
  useMemo,
} from "react";

import farmService from "../services/farmService.js";

export default function useFarms() {
  const loadFarms = useCallback(
    async () => {
      return await farmService.getAllFarms();
    },
    []
  );

  const addFarm = useCallback(
    async (data) => {
      return await farmService.createFarm(data);
    },
    []
  );

  const updateFarm = useCallback(
    async (id, data) => {
      return await farmService.updateFarm(
        id,
        data
      );
    },
    []
  );

  const deleteFarm = useCallback(
    async (id) => {
      return await farmService.deleteFarm(id);
    },
    []
  );

  const searchFarms = useCallback(
    (farms = [], text = "") => {
      const value = String(text)
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
    []
  );

  const getStatistics = useCallback(
    (farms = []) => ({
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
    []
  );

  const statistics = useMemo(
    () => ({
      total: 0,
      active: 0,
      inactive: 0,
    }),
    []
  );

  return {
    loadFarms,
    addFarm,
    updateFarm,
    deleteFarm,
    searchFarms,
    getStatistics,
    statistics,
  };
}
