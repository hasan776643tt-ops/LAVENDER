// تحويل التاريخ إلى صيغة عربية
export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("ar");
}


// إنشاء رقم تعريفي لكل عنصر
export function generateId() {
  return Date.now();
}


// حساب مجموع القيم المالية
export function calculateTotal(items) {

  return items.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

}


// تنظيف الحقول بعد الحفظ
export function clearInputs(setters) {

  setters.forEach((setter) => {
    setter("");
  });

}
