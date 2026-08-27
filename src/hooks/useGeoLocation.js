// src/hooks/useGeoLocation.js

import {
  useCallback,
  useState,
} from "react";


// =========================================================
// LAVENDER — useGeoLocation
//
// مسؤول عن:
// 1. الحصول على إحداثيات GPS
// 2. حفظ الموقع الحالي
// 3. حالة التحميل
// 4. معالجة أخطاء GPS
// 5. مسح الموقع الحالي
//
// Architecture:
//
// Map.jsx
//     ↓
// useGeoLocation.js
//     ↓
// Browser Geolocation API
//
// مهم:
// هذا الـ Hook لا يصل إلى:
// fieldRepository
// fieldService
// storageService
// DataModel
// =========================================================


export default function useGeoLocation() {


  // =======================================================
  // Location
  // =======================================================

  const [
    location,
    setLocation,
  ] = useState(null);


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
  // Get Current Location
  // =======================================================

  const getLocation = useCallback(
    () => {

      return new Promise(
        (resolve, reject) => {

          // -------------------------------------------------
          // Browser support
          // -------------------------------------------------

          if (
            typeof navigator === "undefined" ||
            !navigator.geolocation
          ) {

            const message =
              "المتصفح لا يدعم تحديد الموقع.";

            setError(message);

            reject(
              new Error(message)
            );

            return;

          }


          // -------------------------------------------------
          // Start loading
          // -------------------------------------------------

          setLoading(true);
          setError(null);


          // -------------------------------------------------
          // Get GPS position
          // -------------------------------------------------

          navigator.geolocation.getCurrentPosition(

            (position) => {

              const result = {

                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude,

                accuracy:
                  position.coords.accuracy,

                altitude:
                  position.coords.altitude,

                altitudeAccuracy:
                  position.coords.altitudeAccuracy,

                heading:
                  position.coords.heading,

                speed:
                  position.coords.speed,

              };


              setLocation(result);
              setLoading(false);


              resolve(result);

            },


            (err) => {

              let message =
                "تعذر تحديد موقعك الحالي.";


              switch (err?.code) {

                case 1:

                  message =
                    "تم رفض صلاحية الوصول إلى الموقع. اسمح للتطبيق باستخدام GPS.";

                  break;


                case 2:

                  message =
                    "تعذر الحصول على موقعك الحالي.";

                  break;


                case 3:

                  message =
                    "انتهت مهلة تحديد الموقع. حاول مرة أخرى.";

                  break;


                default:

                  message =
                    err?.message ||
                    "حدث خطأ أثناء تحديد الموقع.";

              }


              setError(message);
              setLoading(false);


              reject(
                new Error(message)
              );

            },


            {

              enableHighAccuracy:
                true,

              timeout:
                15000,

              maximumAge:
                0,

            }

          );

        }
      );

    },
    []
  );


  // =======================================================
  // Clear Location
  // =======================================================

  const clearLocation = useCallback(
    () => {

      setLocation(null);
      setError(null);

    },
    []
  );


  // =======================================================
  // Return
  // =======================================================

  return {

    location,

    loading,

    error,

    getLocation,

    clearLocation,

  };

}
