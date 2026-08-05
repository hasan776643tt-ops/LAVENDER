// src/hooks/useGeoLocation.js


import {
  useState,
  useCallback
} from "react";



export default function useGeoLocation() {


  const [location, setLocation] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);




  const getLocation =
    useCallback(

      () => {


        return new Promise(

          (resolve, reject) => {


            if (
              !navigator.geolocation
            ) {


              const message =
                "Geolocation is not supported by this browser";


              setError(
                message
              );


              reject(
                new Error(message)
              );


              return;

            }




            setLoading(true);

            setError(null);




            navigator.geolocation.getCurrentPosition(


              (position) => {


                const coordinates = {


                  latitude:
                    position.coords.latitude,


                  longitude:
                    position.coords.longitude,


                  accuracy:
                    position.coords.accuracy


                };



                setLocation(
                  coordinates
                );


                setLoading(false);



                resolve(
                  coordinates
                );


              },



              (err) => {


                setError(
                  err.message
                );


                setLoading(false);



                reject(
                  err
                );


              },



              {

                enableHighAccuracy:
                  true,


                timeout:
                  10000,


                maximumAge:
                  0

              }


            );


          }

        );


      },

      []

    );




  const clearLocation =
    () => {


      setLocation(null);

      setError(null);


    };




  return {


    location,

    loading,

    error,



    getLocation,

    clearLocation


  };


}
