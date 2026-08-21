تمام. الآن نعدّل useCrops.js فقط، ولا نلمس Crops.jsx بعد.
الهدف أن يصبح الـHook مسؤولًا عن حالة المحاصيل، مع بقاء كل الوصول للبيانات عبر cropService.
استبدل محتوى:
src/hooks/useCrops.js
بالنسخة التالية:
الكتابة
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

        const updated
