// src/utils/formatters.js


export function formatNumber(
  value,
  decimals = 2
) {


  const number =
    Number(value);



  if (
    Number.isNaN(number)
  ) {

    return "0";

  }



  return number.toFixed(
    decimals
  );


}




export function formatCurrency(
  value,
  currency = "USD"
) {


  return new Intl.NumberFormat(

    "en-US",

    {

      style:
        "currency",

      currency

    }

  ).format(

    Number(value) || 0

  );


}




export function formatDate(
  date
) {


  if (!date) {

    return "";

  }



  return new Intl.DateTimeFormat(

    "en-GB",

    {

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit"

    }

  ).format(

    new Date(date)

  );


}




export function formatPercentage(
  value
) {


  return `${Number(value) || 0}%`;


}




export function capitalize(
  text = ""
) {


  return text.charAt(0)
    .toUpperCase() +

    text.slice(1);


}



export default {

  formatNumber,

  formatCurrency,

  formatDate,

  formatPercentage,

  capitalize

};
