// src/hooks/useFarms.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import farmService from "../services/farmService.js";


// =========================================================
// LAVENDER — useFarms
//
// مسؤول عن:
// 1. تحميل قائمة المزارع
// 2. إضافة مزرعة
// 3. تعديل مزرعة
// 4. حذف مزرعة
// 5. البحث في المزارع
// 6. إحصائيات المزارع
//
// المسار:
// Farms.jsx
//    ↓
// useFarms.js
//    ↓
// farmService.js
// =========================================================


export default function useFarms() {


  // =======================================================
  // Farms State
  // =======================================================

  const [
    farms,
    setFarms,
  ] = useState([]);


  // =======================================================
  // Loading State
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =======================================================
  // Error State
  // =======================================================

  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // Load Farms
  // =======================================================

  const loadFarms = useCallback(
    async () => {

      try {

        setLoading(true);
        setError(null);


        const data =
          await farmService.getAllFarms();


        const farmsData =
          Array.isArray(data)
            ? data
            : [];


        setFarms(farmsData);


        return farmsData;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Add Farm
  // =======================================================

  const addFarm = useCallback(
    async (data) => {

      try {

        setLoading(true);
        setError(null);


        const created =
          await farmService.createFarm(data);


        if (created) {

          setFarms((currentFarms) => [
            ...currentFarms,
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

    },
    []
  );


  // =======================================================
  // Update Farm
  // =======================================================

  const updateFarm = useCallback(
    async (id, data) => {

      try {

        setLoading(true);
        setError(null);


        const updated =
          await farmService.updateFarm(
            id,
            data
          );


        if (updated) {

          setFarms((currentFarms) =>
            currentFarms.map((farm) => {

              const farmId =
                farm?.id ??
                farm?._id ??
                farm?.farmId;


              if (
                String(farmId) ===
                String(id)
              ) {

                return updated;

              }


              return farm;

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


  // =======================================================
  // Delete Farm
  // =======================================================

  const deleteFarm = useCallback(
    async (id) => {

      try {

        setLoading(true);
        setError(null);


        const deleted =
          await farmService.deleteFarm(id);


        setFarms((currentFarms) =>
          currentFarms.filter((farm) => {

            const farmId =
              farm?.id ??
              farm?._id ??
              farm?.farmId;


            return (
              String(farmId) !==
              String(id)
            );

          })
        );


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


  // =======================================================
  // Search Farms
  // =======================================================

  const searchFarms = useCallback(
    (items = farms, text = "") => {

      const value =
        String(text)
          .toLowerCase()
          .trim();


      if (!value) {

        return items;

      }


      return items.filter(
        (farm) => {

          const name =
            farm?.name ??
            farm?.farmName ??
            farm?.title ??
            "";


          return String(name)
            .toLowerCase()
            .includes(value);

        }
      );

    },
    [farms]
  );


  // =======================================================
  // Statistics
  // =======================================================

  const getStatistics = useCallback(
    (items = farms) => {

      return {

        total:
          items.length,

        active:
          items.filter(
            (farm) =>
              farm?.status === "active"
          ).length,

        inactive:
          items.filter(
            (farm) =>
              farm?.status === "inactive"
          ).length,

      };

    },
    [farms]
  );


  // =======================================================
  // Statistics
  // =======================================================

  const statistics = getStatistics(
    farms
  );


  // =======================================================
  // Initial Load
  // =======================================================

  useEffect(() => {

    loadFarms();

  }, [loadFarms]);


  // =======================================================
  // Return
  // =======================================================

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
