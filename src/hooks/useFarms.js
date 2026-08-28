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
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const addFarm = useCallback(async data => {
    const farm = await farmService.createFarm(data);

    if (farm) {
      setFarms(current => [...current, farm]);
    }

    return farm;
  }, []);

  const updateFarm = useCallback(async (id, data) => {
    const farm = await farmService.updateFarm(id, data);

    if (farm) {
      setFarms(current =>
        current.map(item =>
          String(item.id) === String(id)
            ? farm
            : item
        )
      );
    }

    return farm;
  }, []);

  const deleteFarm = useCallback(async id => {
    const result = await farmService.deleteFarm(id);

    setFarms(current =>
      current.filter(
        item => String(item.id) !== String(id)
      )
    );

    return result;
  }, []);

  const searchFarms = useCallback(
    (items = farms, text = "") => {
      const value = String(text).trim().toLowerCase();

      if (!value) {
        return Array.isArray(items) ? items : [];
      }

      return (Array.isArray(items) ? items : []).filter(
        farm =>
          String(
            farm?.name ??
            farm?.farmName ??
            farm?.title ??
            ""
          )
            .toLowerCase()
            .includes(value)
      );
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
