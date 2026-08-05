// src/utils/helpers.js


import logger
from "./logger.js";



// ===============================
// Calculate Total
// حساب مجموع القيم
// ===============================


export function calculateTotal(
  items = [],
  field = "amount"
) {


  if(
    !Array.isArray(items)
  ) {


    logger.warn(

      "calculateTotal expects an array",

      items

    );


    return 0;


  }



  return items.reduce(

    (total, item) =>

      total +

      Number(

        item?.[field] || 0

      ),


    0

  );


}






// ===============================
// Clear Inputs
// تنظيف الحقول
// ===============================


export function clearInputs(
  setters = []
) {


  if(
    !Array.isArray(setters)
  ) {


    return;


  }



  setters.forEach(

    setter => {


      if(
        typeof setter === "function"
      ) {


        setter("");


      }


    }

  );


}






// ===============================
// Safe Value
// حماية القيم الفارغة
// ===============================


export function safeValue(
  value,
  fallback = ""
) {


  return (

    value ??

    fallback

  );


}






// ===============================
// Check Empty
// فحص القيمة الفارغة
// ===============================


export function isEmpty(
  value
) {


  return (

    value === null

    ||

    value === undefined

    ||

    value === ""

    ||

    (

      typeof value === "string"

      &&

      value.trim() === ""

    )

  );


}






// ===============================
// Deep Clone
// نسخ آمن للبيانات
// ===============================


export function deepClone(
  data
) {


  if(
    data === undefined ||
    data === null
  ) {


    return data;


  }



  return JSON.parse(

    JSON.stringify(
      data
    )

  );


}






// ===============================
// Generate Array Range
// إنشاء قائمة أرقام
// ===============================


export function range(
  start,
  end
) {


  const result = [];



  for(
    let i = start;
    i <= end;
    i++
  ) {


    result.push(i);


  }



  return result;


}





export default {


  calculateTotal,

  clearInputs,

  safeValue,

  isEmpty,

  deepClone,

  range


};
