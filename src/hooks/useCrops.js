// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService
  from "../services/cropService.js";


export default function useCrops() {


  const [crops, setCrops] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);


  const loadCrops = useCallback(
    async () => {

      setLoading(true);
      setError(null);

      try {

        const data =
          await cropService.getAll();

        setCrops(
          Array.isArray(data)
            ? data
            : []
        );

        return data;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  useEffect(() => {

    loadCrops();

  }, [loadCrops]);


  const addCrop = useCallback(
    async (data) => {

      setLoading(true);
      setError(null);

      try {

        const crop =
          await cropService.create(data);

        setCrops(
          current => [
            ...current,
            crop,
          ]
        );

        return crop;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  const updateCrop = useCallback(
    async (id, data) => {

      setLoading(true);
      setError(null);

      try {

        const updatedCrop =
          await cropService.update(
            id,
            data
          );

        setCrops(
          current =>
            current.map(
              crop =>
                String(crop.id) === String(id)
                  ? updatedCrop
                  : crop
            )
        );

        return updatedCrop;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  const deleteCrop = useCallback(
    async (id) => {

      setLoading(true);
      setError(null);

      try {

        await cropService.delete(id);

        setCrops(
          current =>
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

    },
    []
  );


  const searchCrops = useCallback(
    (items = crops, text = "") => {

      const value =
        String(text)
          .toLowerCase()
          .trim();


      if (!value) {

        return items;

      }


      return items.filter(
        crop =>
          String(
            crop?.name ?? ""
          )
            .toLowerCase()
            .includes(value)
      );

    },
    [crops]
  );


  const getStatistics = useCallback(
    (items = crops) => {

      return {

        total:
          items.length,

        active:
          items.filter(
            crop =>
              crop?.status === "active"
          ).length,

        archived:
          items.filter(
            crop =>
              crop?.status === "archived"
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
