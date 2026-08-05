// src/hooks/useAI.js


import {
  useCallback,
  useState
} from "react";


import aiService
from "../services/aiService.js";



export default function useAI() {


  const [response, setResponse] =
    useState(null);



  const [history, setHistory] =
    useState([]);



  const [loading, setLoading] =
    useState(false);



  const [error, setError] =
    useState(null);




  const askAI =
    useCallback(

      async (
        question,
        context = {}
      ) => {


        try {


          setLoading(true);

          setError(null);



          const result =

            await aiService.ask(

              question,

              context

            );



          setResponse(
            result
          );



          setHistory(

            previous => [

              ...previous,

              {

                question,

                answer:
                  result

              }

            ]

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

      []

    );




  const clearHistory =
    useCallback(

      () => {


        setHistory([]);

        setResponse(null);


      },

      []

    );




  const resetAI =
    useCallback(

      () => {


        setResponse(null);

        setHistory([]);

        setError(null);

        setLoading(false);


      },

      []

    );




  return {


    response,

    history,

    loading,

    error,



    askAI,

    clearHistory,

    resetAI


  };


}
