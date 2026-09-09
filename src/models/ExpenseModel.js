// src/models/ExpenseModel.js

// =========================================================
// LAVENDER — EXPENSE MODEL
// src/models/ExpenseModel.js
// =========================================================

export class ExpenseModel {

  constructor(data = {}) {

    this.id =
      data.id ||
      null;


    this.farmId =
      data.farmId ||
      "";


    /*
     * اسم المصروف
     */

    this.type =
      data.type ||
      "";


    /*
     * التصنيف يبقى للتوافق مع البيانات القديمة.
     */

    this.category =
      data.category ||
      "operation";


    /*
     * المبلغ
     */

    this.amount =
      Number(
        data.amount || 0
      );


    /*
     * العملة:
     *
     * لا يوجد تحويل.
     *
     * إذا اختار المستخدم:
     * ل.س
     *
     * تبقى:
     * ل.س
     */

    this.currency =
      data.currency ||
      "ل.س";


    /*
     * هذه الحقول القديمة تبقى
     * حتى لا تتضرر البيانات السابقة.
     */

    this.paymentMethod =
      data.paymentMethod ||
      "نقدي";


    this.supplier =
      data.supplier ||
      "";


    this.invoice =
      data.invoice ||
      "";


    /*
     * التاريخ:
     *
     * أهم جزء في هذا التعديل.
     *
     * لا نستخدم:
     *
     * new Date()
     *
     * ولا:
     *
     * new Date().toISOString()
     *
     * كقيمة بديلة.
     *
     * نحفظ النص الذي أرسله المستخدم كما هو.
     */

    this.date =
      data.date !== undefined &&
      data.date !== null

        ? String(data.date)

        : "";


    /*
     * الحالة القديمة
     */

    this.status =
      data.status ||
      "paid";


    /*
     * الملاحظات
     */

    this.notes =
      data.notes !== undefined &&
      data.notes !== null

        ? String(data.notes)

        : "";


    /*
     * التحليل القديم
     */

    this.aiAnalysis =
      data.aiAnalysis ||
      null;


    /*
     * التواريخ التقنية للنظام.
     *
     * createdAt و updatedAt مختلفان
     * عن تاريخ المصروف الذي يدخله الفلاح.
     */

    this.createdAt =
      data.createdAt ||
      null;


    this.updatedAt =
      data.updatedAt ||
      null;

  }


  // =========================================================
  // تحديث البيانات
  // =========================================================

  update(data = {}) {

    if (
      data.farmId !== undefined
    ) {

      this.farmId =
        data.farmId;

    }


    if (
      data.type !== undefined
    ) {

      this.type =
        String(
          data.type
        );

    }


    if (
      data.category !== undefined
    ) {

      this.category =
        data.category;

    }


    if (
      data.amount !== undefined
    ) {

      this.amount =
        Number(
          data.amount
        ) || 0;

    }


    /*
     * العملة تحفظ كما هي.
     */

    if (
      data.currency !== undefined
    ) {

      this.currency =
        String(
          data.currency
        );

    }


    if (
      data.paymentMethod !== undefined
    ) {

      this.paymentMethod =
        data.paymentMethod;

    }


    if (
      data.supplier !== undefined
    ) {

      this.supplier =
        data.supplier;

    }


    if (
      data.invoice !== undefined
    ) {

      this.invoice =
        data.invoice;

    }


    /*
     * التاريخ يحفظ كما أدخله المستخدم.
     *
     * لا يوجد أي استبدال بتاريخ اليوم.
     */

    if (
      data.date !== undefined
    ) {

      this.date =
        String(
          data.date
        );

    }


    if (
      data.status !== undefined
    ) {

      this.status =
        data.status;

    }


    if (
      data.notes !== undefined
    ) {

      this.notes =
        String(
          data.notes
        );

    }


    if (
      data.aiAnalysis !== undefined
    ) {

      this.aiAnalysis =
        data.aiAnalysis;

    }


    if (
      data.updatedAt !== undefined
    ) {

      this.updatedAt =
        data.updatedAt;

    }


    return this;

  }


  // =========================================================
  // قيمة المصروف
  // =========================================================

  getAmount() {

    return Number(
      this.amount || 0
    );

  }


  // =========================================================
  // تحويل إلى JSON
  // =========================================================

  toJSON() {

    return {

      id:
        this.id,

      farmId:
        this.farmId,

      type:
        this.type,

      category:
        this.category,

      amount:
        this.amount,

      currency:
        this.currency,

      paymentMethod:
        this.paymentMethod,

      supplier:
        this.supplier,

      invoice:
        this.invoice,

      /*
       * التاريخ المدخل من الفلاح نفسه.
       */

      date:
        this.date,

      status:
        this.status,

      notes:
        this.notes,

      aiAnalysis:
        this.aiAnalysis,

      createdAt:
        this.createdAt,

      updatedAt:
        this.updatedAt

    };

  }

}


// =========================================================
// Factory
// =========================================================

export function createExpense(
  data = {}
) {

  return new ExpenseModel(
    data
  );

}


// =========================================================
// التصنيفات
// =========================================================

export const expenseCategories = [

  {
    value: "operation",
    label: "تشغيل"
  },

  {
    value: "agriculture",
    label: "زراعة"
  },

  {
    value: "seed",
    label: "بذار"
  },

  {
    value: "fertilizer",
    label: "سماد"
  },

  {
    value: "pesticide",
    label: "مبيد"
  },

  {
    value: "workers",
    label: "عمال"
  },

  {
    value: "tractor",
    label: "جرار"
  },

  {
    value: "irrigation",
    label: "ري"
  },

  {
    value: "fuel",
    label: "وقود"
  },

  {
    value: "transport",
    label: "نقل"
  },

  {
    value: "maintenance",
    label: "صيانة"
  },

  {
    value: "equipment",
    label: "معدات"
  },

  {
    value: "other",
    label: "أخرى"
  }

];


// =========================================================
// طرق الدفع — للتوافق مع البيانات القديمة
// =========================================================

export const paymentMethods = [

  {
    value: "نقدي",
    label: "نقدي"
  },

  {
    value: "تحويل بنكي",
    label: "تحويل بنكي"
  },

  {
    value: "بطاقة",
    label: "بطاقة"
  },

  {
    value: "محفظة إلكترونية",
    label: "محفظة إلكترونية"
  }

];


// =========================================================
// حالات المصروف — للتوافق مع البيانات القديمة
// =========================================================

export const expenseStatus = [

  {
    value: "paid",
    label: "مدفوع"
  },

  {
    value: "pending",
    label: "معلق"
  },

  {
    value: "scheduled",
    label: "مجدول"
  }

];


export default ExpenseModel;
