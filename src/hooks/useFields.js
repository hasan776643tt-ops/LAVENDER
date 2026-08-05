// src/hooks/useFields.js


import {
  useContext,
  useMemo
} from "react";


import {
  FarmContext
} from "../context/FarmContext.js";



export default function useFields() {


  const context =
    useContext(FarmContext);



  if (!context) {

    throw new Error(
      "useFields must be used inside FarmProvider"
    );

  }



  const {

    fields = [],

    fieldActions

  } = context;



  const addField = async (
    data
  ) => {


    return await fieldActions.create(
      data
    );


  };



  const updateField = async (
    id,
    data
  ) => {


    return await fieldActions.update(
      id,
      data
    );


  };



  const deleteField = async (
    id
  ) => {


    return await fieldActions.delete(
      id
    );


  };



  const loadFields = async () => {


    return await fieldActions.load();


  };



  const searchFields = (
    text = ""
  ) => {


    const value =
      text.toLowerCase();



    return fields.filter(

      field =>

        field.name
        ?.toLowerCase()
        .includes(value)

    );


  };



  const statistics =
    useMemo(

      () => ({


        total:
          fields.length,



        totalArea:
          fields.reduce(

            (sum, field) =>

              sum +
              Number(
                field.area || 0
              ),

            0

          ),



        active:
          fields.filter(

            field =>

              field.status === "active"

          ).length


      }),

      [fields]

    );



  return {


    fields,

    addField,

    updateField,

    deleteField,

    loadFields,

    searchFields,

    statistics


  };


}
