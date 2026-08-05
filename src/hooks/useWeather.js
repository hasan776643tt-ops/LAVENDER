// src/hooks/useWeather.js


import {
  useState,
  useCallback
} from "react";


import weatherService
from "../services/weatherService.js";



export default function useWeather() {


  const [weather, setWeather] =
    useState(null);



  const [loading, setLoading] =
    useState(false);



  const [error, setError] =
    useState(null);



  const getWeather = useCallback(

    async (
      latitude,
      longitude
    ) => {


      try {


        setLoading(true);

        setError(null);



        const data =
          await weatherService.getWeather(
            latitude,
            longitude
          );



        setWeather(data);



        return data;



      } catch (err) {


        setError(
          err.message
        );


        throw err;



      } finally {


        setLoading(false);


      }


    },

    []

  );



  const farmAdvice = useCallback(

    () => {


      if (!weather) {

        return null;

      }



      const {

        humidity,

        rainChance

      } = weather;



      if (

        humidity !== null &&

        humidity < 30

      ) {


        return "الرطوبة منخفضة، يفضل فحص الري";


      }



      if (

        rainChance !== null &&

        rainChance > 70

      ) {


        return "احتمال أمطار مرتفع، راقب عمليات الري";


      }



      return "الظروف الجوية مناسبة";


    },

    [weather]

  );



  return {


    weather,

    loading,

    error,

    getWeather,

    farmAdvice


  };


}
