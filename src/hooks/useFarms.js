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
      const data = await farmService.getAllFarms();
      const result = Array.isArray(data) ? data : [];

      setFarms(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFarm = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const created = await farmService.createFarm(data);

      if (created) {
        setFarms(current => [...current, created]);
      }

      return created;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFarm = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await farmService.updateFarm(id, data);

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
  }, []);

  const deleteFarm = useCallback(async id => {
    setLoading(true);
    setError(null);

    try {
      const deleted = await farmService.deleteFarm(id);

      setFarms(current =>
        current.filter(farm => {
          const farmId =
            farm?.id ??
            farm?._id ??
            farm?.farmId;

          return String(farmId) !== String(id);
        })
      );

      return deleted;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFarms = useCallback(
    (items, text = "") => {
      const source = Array.isArray(items) ? items : farms;
      const value = String(text).trim().toLowerCase();

      if (!value) return source;

      return source.filter(farm => {
        const name =
          farm?.name ??
          farm?.farmName ??
          farm?.title ??
          "";

        return String(name).toLowerCase().includes(value);
      });
    },
    [farms]
  );

  const getStatistics = useCallback(
    items => {
      const source = Array.isArray(items) ? items : farms;

      return {
        total: source.length,
        active: source.filter(
          farm => farm?.status === "active"
        ).length,
        inactive: source.filter(
          farm => farm?.status === "inactive"
        ).length,
      };
    },
    [farms]
  );

  const statistics = getStatistics(farms);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await farmService.getAllFarms();

        if (!active) return;

        setFarms(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return {
    farms,
    loading,
    error,
    loadFarms,
    addFarm,
    updateFarm,
    deleteFarm,
    searchFarms,
    getStatistics,
    statistics,
  };
}
