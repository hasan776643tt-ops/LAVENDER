📄 src/hooks/useApi.js

// src/hooks/useApi.js

import {
  useState,
  useCallback
} from "react";


export default function useApi() {


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);


  const [data, setData] =
    useState(null);


  const execute =
    useCallback(

      async (
        apiCall
      ) => {


        try {


          setLoading(true);

          setError(null);


          const result =
            await apiCall();


          setData(
            result
          );


          return result;


        } catch (err) {


          setError(
            err?.message ||
            "API_REQUEST_FAILED"
          );


          throw err;


        } finally {


          setLoading(false);


        }


      },

      []

    );


  const reset =
    useCallback(

      () => {


        setData(null);

        setError(null);

        setLoading(false);


      },

      []

    );


  return {


    data,

    loading,

    error,


    execute,

    reset


  };


}
