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
//
// Farms.jsx
//    ↓
// useFarms.js
//    ↓
// farmService.js
//
// ملاحظة:
// هذا الـ Hook هو المصدر الوحيد لقائمة المزارع داخل Farms.jsx.
// لا يستخدم FarmContext.
// لا يصل مباشرة إلى DataModel.
// =========================================================


export default function useFarms() {


  // =======================================================
  // Farms
  // =======================================================

  const [
    farms,
    setFarms,
  ] = useState([]);


  // =======================================================
  // Loading
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =======================================================
  // Error
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


        setFarms(
          farmsData
        );


        return farmsData;

      } catch (err) {

        setError(err);

        return [];

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
          await farmService.createFarm(
            data
          );


        if (created) {

          setFarms(
            (currentFarms) => [
              ...currentFarms,
              created,
            ]
          );

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
    async (
      id,
      data
    ) => {

      try {

        setLoading(true);

        setError(null);


        const updated =
          await farmService.updateFarm(
            id,
            data
          );


        if (updated) {

          setFarms(
            (currentFarms) =>

              currentFarms.map(
                (farm) => {

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

                }
              )
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
          await farmService.deleteFarm(
            id
          );


        setFarms(
          (currentFarms) =>

            currentFarms.filter(
              (farm) => {

                const farmId =
                  farm?.id ??
                  farm?._id ??
                  farm?.farmId;


                return (
                  String(farmId) !==
                  String(id)
                );

              }
            )
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
    (
      items,
      text = ""
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : farms;


      const value =
        String(text)
          .toLowerCase()
          .trim();


      if (!value) {

        return source;

      }


      return source.filter(
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
    (
      items
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : farms;


      return {

        total:
          source.length,


        active:
          source.filter(
            (farm) =>
              farm?.status ===
              "active"
          ).length,


        inactive:
          source.filter(
            (farm) =>
              farm?.status ===
              "inactive"
          ).length,

      };

    },
    [farms]
  );


  // =======================================================
  // Current Statistics
  // =======================================================

  const statistics =
    getStatistics(
      farms
    );


  // =======================================================
  // Initial Load
  //
  // التحميل يتم هنا فقط.
  // لذلك Farms.jsx لا يحتاج إلى useEffect
  // لتحميل المزارع مرة ثانية.
  // =======================================================

  useEffect(() => {

    let mounted = true;


    const loadInitialFarms =
      async () => {

        try {

          setLoading(true);

          setError(null);


          const data =
            await farmService.getAllFarms();


          if (!mounted) {
            return;
          }


          const farmsData =
            Array.isArray(data)
              ? data
              : [];


          setFarms(
            farmsData
          );

        } catch (err) {

          if (!mounted) {
            return;
          }


          setError(err);

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadInitialFarms();


    return () => {

      mounted = false;

    };

  }, []);


  // =======================================================
  // Return
  // =======================================================

  return {

    // البيانات
    farms,

    // الحالة
    loading,
    error,

    // العمليات
    loadFarms,
    addFarm,
    updateFarm,
    deleteFarm,

    // البحث
    searchFarms,

    // الإحصائيات
    getStatistics,
    statistics,

  };

}
