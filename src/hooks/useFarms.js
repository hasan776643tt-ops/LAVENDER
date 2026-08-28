// src/hooks/useFarms.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import farmService from "../services/farmService.js";

export default function useFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFarms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        await farmService.getAllFarms();

      const result =
        Array.isArray(data)
          ? data
          : [];

      setFarms(result);

      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms().catch(() => {});
  }, [loadFarms]);

  const addFarm = useCallback(async data => {
    setLoading(true);
    setError(null);

    try {
      const created =
        await farmService.createFarm(data);

      if (created) {
        setFarms(current => [
          ...current,
          created,
        ]);
      }

      return created;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFarm = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);

      try {
        const updated =
          await farmService.updateFarm(
            id,
            data
          );

        if (updated) {
          setFarms(current =>
            current.map(farm => {
              const farmId =
                farm?.id ??
                farm?._id ??
                farm?.farmId;

              return String(farmId) === String(id)
                ? updated
                : farm;
            })
          );
        }

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
    async id => {
      setLoading(true);
      setError(null);

      try {
        const deleted =
          await farmService.deleteFarm(id);

        if (deleted) {
          setFarms(current =>
            current.filter(farm => {
              const farmId =
                farm?.id ??
                farm?._id ??
                farm?.farmId;

              return String(farmId) !== String(id);
            })
          );
        }

        return deleted;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchFarms = useCallback(
    (items = farms, text = "") => {
      const source =
        Array.isArray(items)
          ? items
          : [];

      const value =
        String(text)
          .trim()
          .toLowerCase();

      if (!value) return source;

      return source.filter(farm => {
        const name =
          farm?.name ??
          farm?.farmName ??
          farm?.title ??
          "";

        return String(name)
          .toLowerCase()
          .includes(value);
      });
    },
    [farms]
  );

  return {
    farms,
    loading,
    error,
    loadFarms,
    addFarm,
    updateFarm,
    deleteFarm,
    searchFarms,
  };
}
