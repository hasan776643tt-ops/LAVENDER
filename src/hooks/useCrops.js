// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService
  from "../services/cropService.js";

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
      setCrops((current) => [...current, crop]);
      return crop;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCrop = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const crop = await cropService.update(id, data);

      setCrops((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? crop
            : item
        )
      );

      return crop;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCrop = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await cropService.delete(id);

      setCrops((current) =>
        current.filter(
          (item) =>
            String(item.id) !== String(id)
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
      const value = String(text)
        .trim()
        .toLowerCase();

      if (!value) return items;

      return items.filter((crop) =>
        String(crop?.name ?? "")
          .toLowerCase()
          .includes(value)
      );
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
  };
}
