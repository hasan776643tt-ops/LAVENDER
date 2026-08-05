// src/hooks/useFetch.js


import {
  useState,
  useEffect,
  useCallback
} from "react";



export default function useFetch(
  fetchFunction,
  dependencies = []
) {


  const [data, setData] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState(null);




  const fetchData =
    useCallback(

      async () => {


        try {


          setLoading(true);

          setError(null);



          const result =
            await fetchFunction();



          setData(
            result
          );



          return result;


        } catch (err) {


          setError(
            err.message
          );


          throw err;


        } finally {


          setLoading(false);


        }


      },

      dependencies

    );




  useEffect(() => {


    fetchData();


  }, [fetchData]);




  const refresh =
    async () => {


      return await fetchData();


    };




  return {


    data,

    loading,

    error,



    refresh


  };


}
