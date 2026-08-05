// src/utils/calculations.js


export function calculateTotal(
  items = [],
  field = "amount"
) {


  return items.reduce(

    (total, item) =>

      total +
      Number(
        item[field] || 0
      ),

    0

  );


}



export function calculateAverage(
  values = []
) {


  if (
    values.length === 0
  ) {

    return 0;

  }



  return (

    values.reduce(

      (sum, value) =>

        sum +
        Number(value || 0),

      0

    )

    /

    values.length

  );


}



export function calculatePercentage(
  value,
  total
) {


  if (
    !total
  ) {

    return 0;

  }



  return (

    Number(value) /

    Number(total)

  ) * 100;


}




export function calculateAreaProduction(
  quantity,
  area
) {


  if (
    !area ||
    Number(area) <= 0
  ) {

    return 0;

  }



  return (

    Number(quantity || 0)

    /

    Number(area)

  );


}




export function calculateWaterNeed(
  area,
  waterPerUnit
) {


  return (

    Number(area || 0)

    *

    Number(waterPerUnit || 0)

  );


}




export function calculateGrowthRate(
  oldValue,
  newValue
) {


  if (
    !oldValue
  ) {

    return 0;

  }



  return (

    (

      Number(newValue) -

      Number(oldValue)

    )

    /

    Number(oldValue)

  ) * 100;


}



export default {


  calculateTotal,

  calculateAverage,

  calculatePercentage,

  calculateAreaProduction,

  calculateWaterNeed,

  calculateGrowthRate


};
