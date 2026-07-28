// src/models/ExpenseModel.js


export const createExpenseModel = (data = {}) => {


  return {


    id:
      data.id ||
      Date.now(),



    // ربط المصروف بالمزرعة

    farmId:
      data.farmId || "",



    // معلومات المصروف

    type:
      data.type || "",



    category:
      data.category || "تشغيل",



    amount:
      Number(
        data.amount || 0
      ),



    currency:
      data.currency || "ل.س",



    // طريقة الدفع

    paymentMethod:
      data.paymentMethod || "نقدي",



    // المورد والفاتورة

    supplier:
      data.supplier || "",



    invoice:
      data.invoice || "",



    // التاريخ

    date:
      data.date || "",



    createdAt:
      data.createdAt ||
      new Date()
      .toISOString(),



    // حالة الدفع

    status:
      data.status || "paid",



    // ملاحظات

    notes:
      data.notes || "",



    // طبقة التحليل الذكي المستقبلية

    aiAnalysis:
      data.aiAnalysis || {


        costLevel:
          "normal",


        recommendation:
          "",


        savingTips:
          [],


        farmImpact:
          ""

      }


  };


};





// تصنيفات المصاريف

export const expenseCategories = [


  "تشغيل",

  "زراعة",

  "سماد",

  "مبيدات",

  "ري",

  "معدات",

  "عمال",

  "نقل",

  "صيانة",

  "أخرى"

];





// طرق الدفع

export const paymentMethods = [


  "نقدي",

  "تحويل بنكي",

  "بطاقة مصرفية",

  "محفظة إلكترونية"

];





// حالات المصروف

export const expenseStatus = [


  "paid",

  "pending",

  "scheduled"

];
