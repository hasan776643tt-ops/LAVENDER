import {
  useState,
  useCallback,
} from "react";


export default function useWeather() {


  const [weather, setWeather] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);



  // جلب الطقس حسب إحداثيات المزرعة
  const getWeather = useCallback(
    async (
      latitude,
      longitude
    ) => {


      try {

        setLoading(true);

        setError(null);



        /*
          هنا يتم ربط API الطقس الحقيقي

          latitude  = خط العرض
          longitude = خط الطول
        */


        const response =
          await fetch(
            `YOUR_WEATHER_API_URL`
          );


        if(!response.ok){

          throw new Error(
            "فشل جلب بيانات الطقس"
          );

        }



        const data =
          await response.json();



        const smartWeather = {


          location: {

            latitude,

            longitude,

          },


          temperature:

          data.temperature ?? null,


          humidity:

          data.humidity ?? null,


          windSpeed:

          data.windSpeed ?? null,


          pressure:

          data.pressure ?? null,


          rainChance:

          data.rainChance ?? null,



          condition:

          data.condition ?? "unknown",



          updatedAt:

          new Date()
          .toISOString()

        };



        setWeather(
          smartWeather
        );


      }


      catch(err){

        setError(
          err.message
        );

      }


      finally{

        setLoading(false);

      }


    },

    []

  );





  // تقييم زراعي ذكي
  const farmAdvice = useCallback(
    ()=>{


      if(!weather)
        return null;



      if(
        weather.humidity < 30
      ){

        return "الرطوبة منخفضة، يفضل فحص الري";

      }



      if(
        weather.rainChance > 70
      ){

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


    farmAdvice,


  };


}
