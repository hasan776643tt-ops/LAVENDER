// src/hooks/useFilter.js


import {
  useMemo,
  useState
} from "react";



export default function useFilter(
  data = []
) {


  const [filters, setFilters] =
    useState({});




  const filteredData =
    useMemo(

      () => {


        return data.filter(

          item => {


            return Object.entries(
              filters
            )

            .every(

              ([key, value]) => {


                if (
                  value === "" ||
                  value === null ||
                  value === undefined
                ) {

                  return true;

                }



                if (
                  Array.isArray(value)
                ) {


                  return value.includes(
                    item[key]
                  );


                }



                return (

                  String(
                    item[key] ?? ""
                  )

                  .toLowerCase()

                  .includes(

                    String(value)

                    .toLowerCase()

                  )

                );


              }

            );


          }

        );


      },

      [
        data,
        filters
      ]

    );




  const updateFilter =
    (
      key,
      value
    ) => {


      setFilters(

        previous => ({

          ...previous,

          [key]:
            value

        })

      );


    };




  const clearFilters =
    () => {


      setFilters({});


    };




  return {


    filters,

    filteredData,



    updateFilter,

    setFilters,

    clearFilters


  };


}
