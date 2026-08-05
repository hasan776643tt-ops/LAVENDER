// src/hooks/useLocalStorage.js


import {
  useState,
  useEffect
} from "react";



export default function useLocalStorage(
  key,
  initialValue
) {


  const [value, setValue] =
    useState(() => {


      try {


        const storedValue =
          localStorage.getItem(
            key
          );



        if (
          storedValue !== null
        ) {

          return JSON.parse(
            storedValue
          );

        }



        return initialValue;


      } catch {


        return initialValue;


      }


    });




  useEffect(() => {


    try {


      localStorage.setItem(

        key,

        JSON.stringify(
          value
        )

      );


    } catch {

      // Ignore storage errors

    }


  }, [

    key,

    value

  ]);




  const removeValue =
    () => {


      try {


        localStorage.removeItem(
          key
        );


      } catch {

        // Ignore storage errors

      }

    };




  return [

    value,

    setValue,

    removeValue

  ];


}
