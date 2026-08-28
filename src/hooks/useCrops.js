// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService
  from "../services/cropService.js";

import cropRecommendationService
  from "../services/cropRecommendationService.js";


export default function useCrops() {


  const [crops, setCrops] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);


  // =====================================================
  // تحميل المحاصيل
  // =====================================================

  const loadCrops = useCallback(
    async () => {

      setLoading(true);
      setError(null);


      try {

        const data =
          await cropService.getAll();


        const result =
          Array.isArray(data)
            ? data
            : [];


        setCrops(result);


        return result;

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


  // =====================================================
  // إضافة محصول
  // =====================================================

  const addCrop = useCallback(
    async (data) => {

      setLoading(true);
      setError(null);


      try {

        const crop =
          await cropService.create(data);


        if (crop) {

          setCrops(
            current => [
              ...current,
              crop,
            ]
          );

        }


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


  // =====================================================
  // تعديل محصول
  // =====================================================

  const updateCrop = useCallback(
    async (
      id,
      data
    ) => {

      setLoading(true);
      setError(null);


      try {

        const updatedCrop =
          await cropService.update(
            id,
            data
          );


        if (updatedCrop) {

          setCrops(
            current =>
              current.map(
                crop => {

                  const cropId =
                    crop?.id ??
                    crop?._id ??
                    crop?.cropId;


                  return (
                    String(cropId) ===
                    String(id)
                  )
                    ? updatedCrop
                    : crop;

                }
              )
          );

        }


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


  // =====================================================
  // حذف محصول
  // =====================================================

  const deleteCrop = useCallback(
    async (id) => {

      setLoading(true);
      setError(null);


      try {

        await cropService.delete(id);


        setCrops(
          current =>
            current.filter(
              crop => {

                const cropId =
                  crop?.id ??
                  crop?._id ??
                  crop?.cropId;


                return (
                  String(cropId) !==
                  String(id)
                );

              }
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


  // =====================================================
  // البحث
  // =====================================================

  const searchCrops = useCallback(
    (
      items = crops,
      text = ""
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : [];


      const value =
        String(text)
          .trim()
          .toLowerCase();


      if (!value) {

        return source;

      }


      return source.filter(
        crop => {

          const searchableText = [

            crop?.name,

            crop?.seedType,

            crop?.seed_type,

            crop?.seedVariety,

            crop?.seed_variety,

            crop?.seedQuality,

            crop?.seed_quality,

            crop?.fertilizerType,

            crop?.fertilizer_type,

            crop?.notes,

          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return searchableText.includes(
            value
          );

        }
      );

    },
    [crops]
  );


  // =====================================================
  // الإحصائيات
  // =====================================================

  const getStatistics = useCallback(
    (
      items = crops
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : [];


      return {

        total:
          source.length,

        active:
          source.filter(
            crop =>
              crop?.status === "active"
          ).length,

        archived:
          source.filter(
            crop =>
              crop?.status === "archived"
          ).length,

      };

    },
    [crops]
  );


  // =====================================================
  // توصية البذور
  // =====================================================

  const getRecommendation = useCallback(
    (location) => {

      if (
        !location ||
        typeof location !== "object"
      ) {

        return null;

      }


      try {

        return cropRecommendationService.recommend(
          location
        );

      } catch (err) {

        setError(err);

        return null;

      }

    },
    []
  );


  // =====================================================
  // Return
  // =====================================================

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

    getRecommendation,

  };

}
