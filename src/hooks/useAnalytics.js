📄 src/hooks/useAnalytics.js

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
            err?.message ||
            "ANALYTICS_LOAD_FAILED"
          );


          throw err;


        } finally {


          setLoading(false);


        }


      },

      []

    );


  const refreshAnalytics =
    useCallback(

      async (
        params = {}
      ) => {


        return await loadAnalytics(
          params
        );


      },

      [
        loadAnalytics
      ]

    );


  const resetAnalytics =
    useCallback(

      () => {


        setAnalytics(null);

        setError(null);

        setLoading(false);


      },

      []

    );


  return {


    analytics,

    loading,

    error,


    loadAnalytics,

    refreshAnalytics,

    resetAnalytics


  };


}
