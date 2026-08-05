// src/hooks/useSearch.js


import {
  useMemo,
  useState
} from "react";



export default function useSearch(
  data = [],
  fields = ["name"]
) {


  const [searchTerm, setSearchTerm] =
    useState("");




  const results =
    useMemo(

      () => {


        const value =
          searchTerm
          .toLowerCase()
          .trim();



        if (!value) {

          return data;

        }



        return data.filter(

          item =>


            fields.some(

              field =>


                String(
                  item[field] ?? ""
                )

                .toLowerCase()

                .includes(
                  value
                )


            )

        );


      },

      [
        data,
        fields,
        searchTerm
      ]

    );




  const clearSearch =
    () => {


      setSearchTerm("");


    };




  return {


    searchTerm,

    setSearchTerm,

    results,

    clearSearch


  };


}
