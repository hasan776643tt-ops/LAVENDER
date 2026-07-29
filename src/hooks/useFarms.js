import { useContext, useMemo } from "react";

import { FarmContext } from "../context/FarmContext";


export default function useFarms() {


  const {
    farms = [],
    setFarms,
  } = useContext(FarmContext);



  // إضافة مزرعة
  const addFarm = (farm) => {

    const newFarm = {

      id: Date.now(),

      createdAt:
      new Date()
      .toISOString(),

      status: "active",

      ...farm,

    };


    setFarms([
      ...farms,
      newFarm
    ]);

  };




  // تعديل مزرعة
  const updateFarm = (
    id,
    data
  ) => {


    setFarms(

      farms.map(
        farm =>

        farm.id === id

        ?

        {
          ...farm,
          ...data,

          updatedAt:
          new Date()
          .toISOString()
        }

        :

        farm

      )

    );

  };





  // حذف مزرعة
  const deleteFarm = (id)=>{


    setFarms(

      farms.filter(
        farm =>
        farm.id !== id
      )

    );

  };





  // البحث
  const searchFarms = (text)=>{


    return farms.filter(

      farm =>

      farm.name
      ?.toLowerCase()
      .includes(
        text.toLowerCase()
      )

    );

  };





  // إحصائيات المزارع
  const statistics = useMemo(()=>{


    return {

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
      ).length,

    };


  },[farms]);





  return {

    farms,

    addFarm,

    updateFarm,

    deleteFarm,

    searchFarms,

    statistics,

  };

}
