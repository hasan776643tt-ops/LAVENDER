// src/hooks/useFarm.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import farmService from "../services/farmService.js";

export default function useFarm(id = null) {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFarm = useCallback(
    async (farmId = id) => {
      if (!farmId) {
        setFarm(null);
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
          await farmService.getFarmById(farmId);

        setFarm(data);

        return data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const createFarm = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        const created =
          await farmService.createFarm(data);

        setFarm(created);

        return created;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateFarm = useCallback(
    async (farmId, data) => {
      try {
        setLoading(true);
        setError(null);

        const updated =
          await farmService.updateFarm(
            farmId,
            data
          );

        setFarm(updated);

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

  const deleteFarm = useCallback(
    async (farmId) => {
      try {
        setLoading(true);
        setError(null);

        const deleted =
          await farmService.deleteFarm(farmId);

        if (
          String(farmId) === String(id)
        ) {
          setFarm(null);
        }

        return deleted;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const refreshFarm = useCallback(
    async () => {
      return await loadFarm(id);
    },
    [id, loadFarm]
  );

  const clearFarm = useCallback(() => {
    setFarm(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!id) {
      setFarm(null);
      return;
    }

    loadFarm(id);
  }, [id, loadFarm]);

  return {
    farm,
    loading,
    error,
    loadFarm,
    createFarm,
    updateFarm,
    deleteFarm,
    refreshFarm,
    clearFarm,
  };
}
