import { useContext, useMemo } from "react";

import { FarmContext } from "../context/FarmContext";


export default function useFields() {


  const {
    fields = [],
    setFields,
  } = useContext(FarmContext);




  // إضافة حقل جديد
  const addField = (field) => {


    const newField = {

      id: Date.now(),

      createdAt:
      new Date()
      .toISOString(),

      status: "active",

      ...field,

    };


    setFields([
      ...fields,
      newField
    ]);

  };





  // تعديل حقل
  const updateField = (
    id,
    data
  ) => {


    setFields(

      fields.map(
        field =>

        field.id === id

        ?

        {
          ...field,
          ...data,

          updatedAt:
          new Date()
          .toISOString()
        }

        :

        field

      )

    );

  };





  // حذف حقل
  const deleteField = (id)=>{


    setFields(

      fields.filter(
        field =>
        field.id !== id
      )

    );

  };





  // البحث عن الحقول
  const searchFields = (text)=>{


    return fields.filter(

      field =>

      field.name
      ?.toLowerCase()
      .includes(
        text.toLowerCase()
      )

    );

  };





  // إحصائيات الحقول
  const statistics = useMemo(()=>{


    return {

      total:
      fields.length,


      totalArea:
      fields.reduce(

        (sum, field)=>

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
      ).length,


    };


  },[fields]);





  return {

    fields,

    addField,

    updateField,

    deleteField,

    searchFields,

    statistics,

  };

}
