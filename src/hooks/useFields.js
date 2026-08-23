// src/hooks/useGeoLocation.js

import {
  useState,
  useCallback,
} from "react";


export default function useGeoLocation() {

  const [location, setLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);


  // =========================
  // Get GPS + Place Name
  // =========================

  const getLocation =
    useCallback(() => {

      return new Promise(
        (resolve, reject) => {

          if (!navigator.geolocation) {

            const message =
              "المتصفح لا يدعم تحديد الموقع.";

            setError(message);

            reject(
              new Error(message)
            );

            return;
          }


          setLoading(true);
          setError(null);


          navigator.geolocation.getCurrentPosition(

            async (position) => {

              const coordinates = {

                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude,

                accuracy:
                  position.coords.accuracy,

              };


              let place = {

                village: "",
                town: "",
                city: "",
                district: "",
                governorate: "",
                state: "",
                country: "",
                displayName: "",

              };


              try {

                const url =
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=18&addressdetails=1&accept-language=ar`;


                const response =
                  await fetch(url, {
                    headers: {
                      Accept:
                        "application/json",
                    },
                  });


                if (response.ok) {

                  const data =
                    await response.json();


                  const address =
                    data?.address || {};


                  place = {

                    village:
                      address.village ||
                      address.hamlet ||
                      "",

                    town:
                      address.town ||
                      "",

                    city:
                      address.city ||
                      address.municipality ||
                      "",

                    district:
                      address.district ||
                      address.suburb ||
                      address.neighbourhood ||
                      "",

                    governorate:
                      address.state ||
                      address.province ||
                      "",

                    state:
                      address.state ||
                      address.province ||
                      "",

                    country:
                      address.country ||
                      "",

                    displayName:
                      data?.display_name ||
                      "",

                  };

                }

              } catch (geocodeError) {

                console.warn(
                  "Reverse geocoding failed:",
                  geocodeError
                );

              }


              const result = {

                ...coordinates,

                ...place,

              };


              setLocation(result);

              setLoading(false);


              resolve(result);

            },


            (err) => {

              let message =
                "تعذر تحديد موقع الحقل.";

              if (err.code === 1) {

                message =
                  "تم رفض صلاحية الوصول إلى موقعك. اسمح للموقع بالوصول إلى GPS.";

              } else if (err.code === 2) {

                message =
                  "تعذر الحصول على موقعك الحالي.";

              } else if (err.code === 3) {

                message =
                  "انتهت مهلة تحديد الموقع. حاول مرة أخرى.";

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

    }, []);


  // =========================
  // Clear
  // =========================

  const clearLocation =
    useCallback(() => {

      setLocation(null);
      setError(null);

    }, []);


  return {

    location,

    loading,

    error,

    getLocation,

    clearLocation,

  };

}
