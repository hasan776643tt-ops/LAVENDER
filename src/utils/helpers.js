// src/utils/helpers.js


// ===============================
// Calculate Total
// حساب مجموع القيم
// ===============================

export function calculateTotal(items = []) {

  return items.reduce(

    (total, item) =>

      total +
      Number(
        item.amount || 0
      ),

    0

  );

}



// ===============================
// Clear Inputs
// تنظيف الحقول
// ===============================

export function clearInputs(setters = []) {

  setters.forEach(

    (setter)=>{

      if(typeof setter === "function"){

        setter("");

      }

    }

  );

}



// ===============================
// Safe Value
// حماية القيم الفارغة
// ===============================

export function safeValue(value) {

  return value ?? "";

}



// ===============================
// Check Empty
// فحص القيمة الفارغة
// ===============================

export function isEmpty(value) {

  return (
    value === null ||
    value === undefined ||
    value === ""
  );

}
