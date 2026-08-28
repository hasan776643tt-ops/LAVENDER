// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService from "../services/cropService.js";

export default function useCrops() {

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCrops = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {

      const data = await cropService.getAll();

      const result = Array.isArray(data) ? data : [];

      setCrops(result);

      return result;

    } catch (err) {

      setError(err);
      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    loadCrops();

  }, [loadCrops]);

  const addCrop = useCallback(async (data) => {

    setLoading(true);
    setError(null);

    try {

      const crop = await cropService.create(data);

      setCrops(current => [
        ...current,
        crop,
      ]);

      return crop;

    } catch (err) {

      setError(err);
      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

  const updateCrop = useCallback(
    async (id, data) => {

      setLoading(true);
      setError(null);

      try {

        const updated =
          await cropService.update(id, data);

        setCrops(current =>
          current.map(crop =>
            String(crop.id) === String(id)
              ? updated
              : crop
          )
        );

        return updated;

      } catch (err) {

        setError(err);
        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );

  const deleteCrop = useCallback(async (id) => {

    setLoading(true);
    setError(null);

    try {

      await cropService.delete(id);

      setCrops(current =>
        current.filter(
          crop =>
            String(crop.id) !== String(id)
        )
      );

      return true;

    } catch (err) {

      setError(err);
      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

  const searchCrops = useCallback(
    (items = crops, text = "") => {

      const source =
        Array.isArray(items) ? items : [];

      const value =
        String(text)
          .toLowerCase()
          .trim();

      if (!value) return source;

      return source.filter(crop => {

        const searchable = [
          crop?.name,
          crop?.seedType,
          crop?.seed_type,
          crop?.seedVariety,
          crop?.seed_variety,
          crop?.fertilizerType,
          crop?.fertilizer_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(value);

      });

    },
    [crops]
  );

  const getStatistics = useCallback(
    (items = crops) => {

      const source =
        Array.isArray(items) ? items : [];

      return {
        total: source.length,

        active: source.filter(
          crop => crop?.status === "active"
        ).length,

        archived: source.filter(
          crop => crop?.status === "archived"
        ).length,
      };

    },
    [crops]
  );

  return {
    crops,
    loading,
    error,
    loadCrops,
    addCrop,
    updateCrop,
    deleteCrop,
    searchCrops,
    getStatistics,
  };

}
