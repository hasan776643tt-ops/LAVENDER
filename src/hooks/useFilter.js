// src/hooks/useFilter.js

import {
  useCallback,
  useMemo,
  useState,
} from "react";

export default function useFilter(data = []) {
  const [filters, setFilters] = useState({});

  const sourceData = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    return sourceData.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      return Object.entries(filters).every(
        ([key, value]) => {
          if (
            value === "" ||
            value === null ||
            value === undefined
          ) {
            return true;
          }

          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }

          return String(item[key] ?? "")
            .toLowerCase()
            .includes(String(value).toLowerCase());
        }
      );
    });
  }, [sourceData, filters]);

  const updateFilter = useCallback(
    (key, value) => {
      if (!key) {
        return;
      }

      setFilters((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const setFilterValues = useCallback((values) => {
    if (
      !values ||
      typeof values !== "object" ||
      Array.isArray(values)
    ) {
      setFilters({});
      return;
    }

    setFilters(values);
  }, []);

  return {
    filters,
    filteredData,
    updateFilter,
    setFilters: setFilterValues,
    clearFilters,
  };
}
