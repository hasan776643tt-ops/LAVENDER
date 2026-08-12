// src/hooks/useCrops.js

import {
  useCallback,
  useMemo,
} from "react";

import cropService from "../services/cropService.js";

export default function useCrops() {
  const loadCrops = useCallback(
    async () => {
      return await cropService.getAll();
    },
    []
  );

  const addCrop = useCallback(
    async (data) => {
      return await cropService.create(data);
    },
    []
  );

  const updateCrop = useCallback(
    async (id, data) => {
      return await cropService.update(
        id,
        data
      );
    },
    []
  );

  const deleteCrop = useCallback(
    async (id) => {
      return await cropService.delete(id);
    },
    []
  );

  const searchCrops = useCallback(
    (crops = [], text = "") => {
      const value = String(text)
        .toLowerCase()
        .trim();

      if (!value) {
        return crops;
      }

      return crops.filter(
        (crop) =>
          String(crop?.name ?? "")
            .toLowerCase()
            .includes(value)
      );
    },
    []
  );

  const getStatistics = useCallback(
    (crops = []) => ({
      total: crops.length,

      active: crops.filter(
        (crop) =>
          crop?.status === "active"
      ).length,

      archived: crops.filter(
        (crop) =>
          crop?.status === "archived"
      ).length,
    }),
    []
  );

  const statistics = useMemo(
    () => ({
      total: 0,
      active: 0,
      archived: 0,
    }),
    []
  );

  return {
    loadCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
    getStatistics,
    statistics,
  };
}
