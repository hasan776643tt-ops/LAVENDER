// src/utils/helpers.js


// ===============================
// تنسيق التاريخ للعرض
// ===============================

export function formatDate(date) {

  if (!date) return "";

  return new Date(date)
    .toLocaleDateString("ar");

}




// ===============================
// إنشاء معرف موحد
// يعتمد على مصدر واحد
// ===============================

export function generateId() {

  return (
    Date.now()
    +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );

}




// ===============================
// حساب مجموع القيم المالية
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
// تنظيف الحقول بعد الحفظ
// ===============================

export function clearInputs(setters = []) {

  setters.forEach(

    (setter) => {

      setter("");

    }

  );

}
