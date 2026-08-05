// src/hooks/usePagination.js


import {
  useMemo,
  useState
} from "react";



export default function usePagination(
  data = [],
  itemsPerPage = 10
) {


  const [currentPage, setCurrentPage] =
    useState(1);




  const totalPages =
    Math.ceil(
      data.length /
      itemsPerPage
    );




  const currentData =
    useMemo(

      () => {


        const startIndex =
          (currentPage - 1) *
          itemsPerPage;



        const endIndex =
          startIndex +
          itemsPerPage;



        return data.slice(
          startIndex,
          endIndex
        );


      },

      [
        data,
        currentPage,
        itemsPerPage
      ]

    );




  const nextPage =
    () => {


      setCurrentPage(
        page =>

          Math.min(
            page + 1,
            totalPages
          )

      );


    };




  const previousPage =
    () => {


      setCurrentPage(

        page =>

          Math.max(
            page - 1,
            1
          )

      );


    };




  const goToPage =
    (page) => {


      setCurrentPage(

        Math.min(

          Math.max(
            page,
            1
          ),

          totalPages

        )

      );


    };




  const resetPagination =
    () => {


      setCurrentPage(1);


    };




  return {


    currentData,

    currentPage,

    totalPages,



    nextPage,

    previousPage,

    goToPage,

    resetPagination


  };


}
