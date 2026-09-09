// src/models/ExpenseModel.js

/**
 * LAVENDER — Expense Model
 *
 * نموذج المصروفات والإنتاج والنتيجة المالية للمشروع الزراعي.
 *
 * كل مصروف هو سطر مستقل داخل جدول المشروع الزراعي.
 * يمكن إضافة عدد غير محدود من المصروفات.
 */

export class ExpenseModel {
  constructor(data = {}) {
    this.id =
      data.id ||
      globalThis.crypto?.randomUUID?.() ||
      Date.now().toString();

    // ارتباط بالمزرعة
    this.farmId = data.farmId || "";

    // ارتباط بالمشروع الزراعي / الحقل
    // cropId هو المرجع الأساسي للمشروع الزراعي.
    this.cropId = data.cropId || "";

    // اسم المصروف الذي يكتبه الفلاح
    this.type = data.type || "";

    // تصنيف اختياري
    this.category = data.category || "other";

    // المبلغ
    this.amount = Number(data.amount) || 0;

    // العملة
    this.currency = data.currency || "USD";

    // معلومات إضافية اختيارية
    this.quantity =
      data.quantity !== undefined &&
      data.quantity !== null &&
      data.quantity !== ""
        ? Number(data.quantity)
        : "";

    this.unit = data.unit || "";

    // التاريخ
    this.date = data.date || "";

    // المورد اختياري
    this.supplier = data.supplier || "";

    // ملاحظات
    this.notes = data.notes || "";

    // الاحتفاظ بالحقول القديمة للتوافق
    this.paymentMethod =
      data.paymentMethod || "cash";

    this.invoice =
      data.invoice || "";

    this.status =
      data.status || "paid";

    // التحليل الذكي القديم
    this.aiAnalysis =
      data.aiAnalysis || {
        costLevel: "normal",
        recommendation: "",
        savingTips: [],
        farmImpact: ""
      };

    // النظام الزمني
    this.createdAt =
      data.createdAt ||
      new Date().toISOString();

    this.updatedAt =
      data.updatedAt ||
      new Date().toISOString();
  }

  update(data = {}) {
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        this[key] = data[key];
      }
    });

    if (data.amount !== undefined) {
      this.amount = Number(data.amount) || 0;
    }

    if (
      data.quantity !== undefined &&
      data.quantity !== ""
    ) {
      this.quantity = Number(data.quantity) || 0;
    }

    this.updatedAt =
      new Date().toISOString();

    return this;
  }

  getAmount() {
    return {
      value: Number(this.amount) || 0,
      currency: this.currency
    };
  }

  toJSON() {
    return {
      id: this.id,

      farmId: this.farmId,

      cropId: this.cropId,

      type: this.type,

      category: this.category,

      amount: Number(this.amount) || 0,

      currency: this.currency,

      quantity:
        this.quantity === ""
          ? ""
          : Number(this.quantity) || 0,

      unit: this.unit,

      date: this.date,

      supplier: this.supplier,

      invoice: this.invoice,

      paymentMethod: this.paymentMethod,

      status: this.status,

      aiAnalysis: this.aiAnalysis,

      notes: this.notes,

      createdAt: this.createdAt,

      updatedAt: this.updatedAt
    };
  }
}

export const createExpense = (data = {}) => {
  return new ExpenseModel(data);
};

export const expenseCategories = [
  "seed",
  "fertilizer",
  "pesticide",
  "workers",
  "tractor",
  "irrigation",
  "fuel",
  "transport",
  "maintenance",
  "equipment",
  "other"
];

export const paymentMethods = [
  "cash",
  "bank_transfer",
  "card",
  "digital_wallet"
];

export const expenseStatus = [
  "paid",
  "pending",
  "scheduled"
];
