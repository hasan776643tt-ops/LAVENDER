// src/hooks/useFields.js

import {
  useCallback,
  useContext,
  useMemo,
} from "react";

import {
  FarmContext,
} from "../context/FarmContext.js";

export default function useFields() {
  const context =
    useContext(FarmContext);

  if (!context) {
    throw new Error(
      "useFields must be used inside FarmProvider"
    );
  }

  const {
    fields = [],
    fieldActions,
  } = context;

  const addField = useCallback(
    async (data) => {
      if (!fieldActions?.create) {
        throw new Error(
          "Field create action is not available"
        );
      }

      return fieldActions.create(data);
    },
    [fieldActions]
  );

  const updateField = useCallback(
    async (id, data) => {
      if (!fieldActions?.update) {
        throw new Error(
          "Field update action is not available"
        );
      }

      return fieldActions.update(id, data);
    },
    [fieldActions]
  );

  const deleteField = useCallback(
    async (id) => {
      if (!fieldActions?.delete) {
        throw new Error(
          "Field delete action is not available"
        );
      }

      return fieldActions.delete(id);
    },
    [fieldActions]
  );

  const loadFields = useCallback(
    async () => {
      if (!fieldActions?.load) {
        throw new Error(
          "Field load action is not available"
        );
      }

      return fieldActions.load();
    },
    [fieldActions]
  );

  const searchFields = useCallback(
    (text = "") => {
      const value =
        String(text)
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
    [fields]
  );

  const statistics = useMemo(
    () => ({
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
    [fields]
  );

  return {
    fields,

    addField,
    updateField,
    deleteField,
    loadFields,

    searchFields,
    statistics,
  };
}
