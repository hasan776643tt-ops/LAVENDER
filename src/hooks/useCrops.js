// src/hooks/useCrops.js


import {
  useContext,
  useMemo
} from "react";


import {
  FarmContext
} from "../context/FarmContext.js";



export default function useCrops() {


  const context =
    useContext(FarmContext);



  if (!context) {

    throw new Error(
      "useCrops must be used inside FarmProvider"
    );

  }



  const {

    crops = [],

    cropActions

  } = context;



  const addCrop = async (
    data
  ) => {


    return await cropActions.create(
      data
    );


  };



  const updateCrop = async (
    id,
    data
  ) => {


    return await cropActions.update(
      id,
      data
    );


  };



  const deleteCrop = async (
    id
  ) => {


    return await cropActions.delete(
      id
    );


  };



  const loadCrops = async () => {


    return await cropActions.load();


  };



  const searchCrops = (
    text = ""
  ) => {


    const value =
      text.toLowerCase();



    return crops.filter(

      crop =>

        crop.name
        ?.toLowerCase()
        .includes(value)

    );


  };



  const statistics =
    useMemo(

      () => ({


        total:
          crops.length,



        active:
          crops.filter(

            crop =>

              crop.status === "active"

          ).length,



        archived:
          crops.filter(

            crop =>

              crop.status === "archived"

          ).length


      }),

      [crops]

    );



  return {


    crops,

    addCrop,

    updateCrop,

    deleteCrop,

    loadCrops,

    searchCrops,

    statistics


  };


}
