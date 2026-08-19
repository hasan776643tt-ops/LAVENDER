// src/hooks/useCrops.js

import {
  useCallback,
} from "react";

import cropService
  from "../services/cropService.js";


export default function useCrops() {


  const loadCrops = useCallback(
    async () => {
      return cropService.getAll();
    },
    []
  );


  const addCrop = useCallback(
    async (data) => {
      return cropService.create(data);
    },
    []
  );


  const updateCrop = useCallback(
    async (id, data) => {
      return cropService.update(
        id,
        data
      );
    },
    []
  );


  const deleteCrop = useCallback(
    async (id) => {
      return cropService.delete(id);
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
    (crops = []) => {

      return {
        total: crops.length,

        active: crops.filter(
          (crop) =>
            crop?.status === "active"
        ).length,

        archived: crops.filter(
          (crop) =>
            crop?.status === "archived"
        ).length,
      };
    },
    []
  );


  return {
    loadCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
    getStatistics,
  };
}
