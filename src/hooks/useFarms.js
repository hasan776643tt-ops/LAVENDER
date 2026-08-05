// src/hooks/useFarms.js


import {
  useContext,
  useMemo
} from "react";


import {
  FarmContext
} from "../context/FarmContext.js";



export default function useFarms() {


  const context =
    useContext(FarmContext);



  if (!context) {

    throw new Error(
      "useFarms must be used inside FarmProvider"
    );

  }



  const {

    farms = [],

    farmActions

  } = context;



  const statistics =
    useMemo(

      () => ({


        total:
          farms.length,



        active:
          farms.filter(

            farm =>

              farm.status === "active"

          ).length,



        inactive:
          farms.filter(

            farm =>

              farm.status === "inactive"

          ).length


      }),

      [farms]

    );



  const addFarm = async (
    data
  ) => {


    return await farmActions.create(
      data
    );


  };



  const updateFarm = async (
    id,
    data
  ) => {


    return await farmActions.update(
      id,
      data
    );


  };



  const deleteFarm = async (
    id
  ) => {


    return await farmActions.delete(
      id
    );


  };



  const loadFarms = async () => {


    return await farmActions.load();


  };



  const searchFarms = (
    text = ""
  ) => {


    const value =
      text.toLowerCase();



    return farms.filter(

      farm =>

        farm.name
        ?.toLowerCase()
        .includes(value)

    );


  };



  return {


    farms,

    addFarm,

    updateFarm,

    deleteFarm,

    loadFarms,

    searchFarms,

    statistics


  };


}
