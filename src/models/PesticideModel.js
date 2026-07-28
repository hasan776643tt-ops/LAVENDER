// src/models/PesticideModel.js


export const createPesticideModel = (data = {}) => {


  return {


    id:
      data.id ||
      Date.now(),



    farmId:
      data.farmId || "",



    fieldId:
      data.fieldId || "",



    cropId:
      data.cropId || "",



    // معلومات المبيد

    name:
      data.name || "",



    active:
      data.active || "",



    target:
      data.target || "",



    // الكمية

    quantity:
      Number(
        data.quantity || 0
      ),



    unit:
      data.unit || "مل",



    // طريقة الاستخدام

    method:
      data.method || "رش",



    // الزمن

    date:
      data.date || "",



    safetyDays:
      Number(
        data.safetyDays || 0
      ),



    // الإدارة والمتابعة

    status:
      data.status || "scheduled",



    priority:
      data.priority || "medium",



    // المورد والتكلفة مستقبلاً

    supplier:
      data.supplier || "",



    cost:
      Number(
        data.cost || 0
      ),



    currency:
      data.currency || "ل.س",



    // ملاحظات

    notes:
      data.notes || "",



    createdAt:
      data.createdAt ||
      new Date()
      .toISOString(),



    // طبقة الذكاء الاصطناعي المستقبلية

    aiAnalysis:
      data.aiAnalysis || {

        riskLevel:
          "low",


        recommendation:
          "",


        harvestWarning:
          ""

      }


  };


};





// أنواع وحدات المبيدات

export const pesticideUnits = [

  "مل",

  "لتر",

  "كغ"

];





// طرق الاستخدام

export const pesticideMethods = [

  "رش",

  "مع الري",

  "تربة"

];





// حالات العملية

export const pesticideStatus = [

  "scheduled",

  "done",

  "pending"

];





// مستويات الأولوية

export const pesticidePriority = [

  "low",

  "medium",

  "high"

];
