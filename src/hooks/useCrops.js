import { useContext, useMemo } from "react";

import { FarmContext } from "../context/FarmContext";


export default function useCrops() {


  const {
    crops = [],
    setCrops,
  } = useContext(FarmContext);



  // إضافة محصول جديد
  const addCrop = (crop) => {

    const newCrop = {

      id: Date.now(),

      createdAt: new Date()
        .toISOString(),

      ...crop,

    };


    setCrops([
      ...crops,
      newCrop
    ]);

  };



  // تعديل محصول
  const updateCrop = (
    id,
    data
  ) => {


    setCrops(

      crops.map(
        crop =>

        crop.id === id

        ?

        {
          ...crop,
          ...data,
          updatedAt:
          new Date()
          .toISOString()
        }

        :

        crop
      )

    );

  };




  // حذف محصول
  const deleteCrop = (id)=>{


    setCrops(

      crops.filter(
        crop =>
        crop.id !== id
      )

    );

  };




  // البحث عن محصول
  const searchCrops = (text)=>{


    return crops.filter(

      crop =>

      crop.name
      ?.toLowerCase()
      .includes(
        text.toLowerCase()
      )

    );

  };





  // إحصائيات المحاصيل
  const statistics = useMemo(()=>{


    return {

      total:
      crops.length,


      active:
      crops.filter(
        c=>c.status==="active"
      ).length,


      archived:
      crops.filter(
        c=>c.status==="archived"
      ).length,


    };


  },[crops]);





  return {


    crops,


    addCrop,


    updateCrop,


    deleteCrop,


    searchCrops,


    statistics,


  };

}
