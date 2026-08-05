// src/hooks/useAnalytics.js


import {
  useCallback,
  useState
} from "react";


import analyticsService
from "../services/analyticsService.js";



export default function useAnalytics() {


  const [analytics, setAnalytics] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);




  const loadAnalytics =
    useCallback(

      async (
        params = {}
      ) => {


        try {


          setLoading(true);

          setError(null);



          const data =

            await analyticsService.getAnalytics(
              params
            );



          setAnalytics(
            data
          );



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




  const refreshAnalytics =
    async (
      params = {}
    ) => {


      return await loadAnalytics(
        params
      );


    };




  const resetAnalytics =
    () => {


      setAnalytics(null);

      setError(null);

      setLoading(false);


    };




  return {


    analytics,

    loading,

    error,



    loadAnalytics,

    refreshAnalytics,

    resetAnalytics


  };


}
