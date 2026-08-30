// src/hooks/useCrops.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import cropService
  from "../services/cropService.js";


// =========================================================
// LAVENDER — useCrops
// =========================================================
//
// مسؤول عن:
// تحميل المحاصيل
// إضافة محصول
// تعديل محصول
// حذف محصول
// البحث
// الإحصائيات
//
// الموقع يأتي من الخريطة.
// لا يعتمد على إدخال موقع يدوي من Crops.
//
// =========================================================


function normalizeNumber(
  value
) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function normalizeBoundary(
  boundary
) {

  if (
    !Array.isArray(boundary)
  ) {
    return [];
  }


  return boundary
    .map(point => {

      if (
        Array.isArray(point)
      ) {

        const latitude =
          normalizeNumber(
            point[0]
          );

        const longitude =
          normalizeNumber(
            point[1]
          );

        if (
          latitude === null ||
          longitude === null
        ) {
          return null;
        }

        return {
          latitude,
          longitude,
        };
      }


      if (
        point &&
        typeof point === "object"
      ) {

        const latitude =
          normalizeNumber(
            point.latitude
          );

        const longitude =
          normalizeNumber(
            point.longitude
          );

        if (
          latitude === null ||
          longitude === null
        ) {
          return null;
        }

        return {
          latitude,
          longitude,
        };
      }


      return null;
    })
    .filter(Boolean);
}


function normalizeCropData(
  data = {}
) {

  const latitude =
    normalizeNumber(
      data.latitude
    );

  const longitude =
    normalizeNumber(
      data.longitude
    );


  const boundary =
    normalizeBoundary(
      data.boundary ||
      data.points
    );


  return {

    ...data,


    // =====================================================
    // FARM
    // =====================================================

    farmId:
      data.farmId
        ? String(data.farmId)
        : "",


    // =====================================================
    // LOCATION
    // =====================================================

    latitude,

    longitude,

    boundary,

    points:
      boundary,


    // =====================================================
    // ADMINISTRATIVE LOCATION
    // =====================================================

    country:
      String(
        data.country ||
        ""
      ).trim(),

    governorate:
      String(
        data.governorate ||
        data.state ||
        data.province ||
        data.region ||
        ""
      ).trim(),

    state:
      String(
        data.state ||
        data.governorate ||
        ""
      ).trim(),

    province:
      String(
        data.province ||
        data.governorate ||
        ""
      ).trim(),

    region:
      String(
        data.region ||
        data.governorate ||
        ""
      ).trim(),

    district:
      String(
        data.district ||
        ""
      ).trim(),

    municipality:
      String(
        data.municipality ||
        ""
      ).trim(),

    city:
      String(
        data.city ||
        ""
      ).trim(),

    town:
      String(
        data.town ||
        ""
      ).trim(),

    village:
      String(
        data.village ||
        ""
      ).trim(),

    hamlet:
      String(
        data.hamlet ||
        ""
      ).trim(),


    // =====================================================
    // LOCATION DISPLAY
    // =====================================================

    locationName:
      String(
        data.locationName ||
        data.placeName ||
        data.village ||
        data.town ||
        data.city ||
        ""
      ).trim(),


    // =====================================================
    // CLIMATE
    // =====================================================

    climate:
      String(
        data.climate ||
        ""
      ).trim(),


    // =====================================================
    // RECOMMENDATIONS
    // =====================================================

    recommendedSeeds:
      Array.isArray(
        data.recommendedSeeds
      )
        ? data.recommendedSeeds
        : [],


    recommendedSeedVarieties:
      Array.isArray(
        data.recommendedSeedVarieties
      )
        ? data.recommendedSeedVarieties
        : [],
  };
}


export default function useCrops() {

  const [
    crops,
    setCrops,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // LOAD
  // =======================================================

  const loadCrops =
    useCallback(
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

    loadCrops()
      .catch(() => {});

  }, [loadCrops]);


  // =======================================================
  // ADD
  // =======================================================

  const addCrop =
    useCallback(
      async data => {

        setLoading(true);

        setError(null);


        try {

          const payload =
            normalizeCropData(
              data
            );


          // المزرعة مطلوبة
          if (
            !payload.farmId
          ) {

            throw new Error(
              "CROP_FARM_REQUIRED"
            );
          }


          // الموقع الجغرافي مطلوب
          if (
            payload.latitude === null ||
            payload.longitude === null
          ) {

            throw new Error(
              "CROP_LOCATION_REQUIRED"
            );
          }


          const crop =
            await cropService.create(
              payload
            );


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


  // =======================================================
  // UPDATE
  // =======================================================

  const updateCrop =
    useCallback(
      async (
        id,
        data
      ) => {

        setLoading(true);

        setError(null);


        try {

          const payload =
            normalizeCropData(
              data
            );


          const updated =
            await cropService.update(
              id,
              payload
            );


          setCrops(
            current =>
              current.map(
                crop =>
                  String(
                    crop.id
                  ) ===
                  String(id)
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


  // =======================================================
  // DELETE
  // =======================================================

  const deleteCrop =
    useCallback(
      async id => {

        setLoading(true);

        setError(null);


        try {

          await cropService.delete(
            id
          );


          setCrops(
            current =>
              current.filter(
                crop =>
                  String(
                    crop.id
                  ) !==
                  String(id)
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


  // =======================================================
  // SEARCH
  // =======================================================

  const searchCrops =
    useCallback(
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
          crop =>
            [

              crop?.name,

              crop?.seedType,

              crop?.seedVariety,

              crop?.fertilizerType,

              crop?.locationName,

              crop?.country,

              crop?.governorate,

              crop?.district,

              crop?.city,

              crop?.town,

              crop?.village,

              crop?.climate,

              crop?.notes,

            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(value)
        );

      },
      [crops]
    );


  // =======================================================
  // STATISTICS
  // =======================================================

  const getStatistics =
    useCallback(
      (items = crops) => {

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
                crop?.status ===
                "active"
            ).length,

          archived:
            source.filter(
              crop =>
                crop?.status ===
                "archived"
            ).length,

        };

      },
      [crops]
    );


  // =======================================================
  // RETURN
  // =======================================================

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
