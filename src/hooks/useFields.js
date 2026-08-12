// src/hooks/useFields.js

import {
  useCallback,
  useMemo,
} from "react";

import fieldService from "../services/fieldService.js";

export default function useFields() {
  const loadFields = useCallback(
    async () => {
      return await fieldService.getAll();
    },
    []
  );

  const addField = useCallback(
    async (data) => {
      return await fieldService.create(data);
    },
    []
  );

  const updateField = useCallback(
    async (id, data) => {
      return await fieldService.update(
        id,
        data
      );
    },
    []
  );

  const deleteField = useCallback(
    async (id) => {
      return await fieldService.delete(id);
    },
    []
  );

  const searchFields = useCallback(
    (fields = [], text = "") => {
      const value = String(text)
        .toLowerCase()
        .trim();

      if (!value) {
        return fields;
      }

      return fields.filter(
        (field) =>
          String(field?.name ?? "")
            .toLowerCase()
            .includes(value)
      );
    },
    []
  );

  const getStatistics = useCallback(
    (fields = []) => ({
      total: fields.length,

      totalArea: fields.reduce(
        (sum, field) =>
          sum +
          Number(field?.area || 0),
        0
      ),

      active: fields.filter(
        (field) =>
          field?.status === "active"
      ).length,
    }),
    []
  );

  const statistics = useMemo(
    () => ({
      total: 0,
      totalArea: 0,
      active: 0,
    }),
    []
  );

  return {
    loadFields,
    addField,
    updateField,
    deleteField,
    searchFields,
    getStatistics,
    statistics,
  };
}
