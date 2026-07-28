// src/models/FertilizerModel.js


export const createFertilizerModel = (data = {}) => {


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



    // معلومات السماد

    type:
      data.type || "",



    category:
      data.category || "كيميائي",



    quantity:
      Number(
        data.quantity || 0
      ),



    unit:
      data.unit || "كغ",



    // طريقة الاستخدام

    method:
      data.method || "تربة",



    stage:
      data.stage || "",



    // المورد والتكلفة

    supplier:
      data.supplier || "",



    cost:
      Number(
        data.cost || 0
      ),



    currency:
      data.currency || "ل.س",



    // الزمن

    date:
      data.date || "",



    createdAt:
      data.createdAt ||
      new Date()
      .toISOString(),



    // إدارة الحالة

    status:
      data.status || "scheduled",



    priority:
      data.priority || "medium",



    // ملاحظات

    notes:
      data.notes || "",



    // بيانات مستقبلية للذكاء الاصطناعي

    aiAnalysis:
      data.aiAnalysis || {

        recommendation:
          "",

        riskLevel:
          "low",

        efficiency:
          null

      }


  };


};



// أنواع السماد المدعومة

export const fertilizerCategories = [

  "عضوي",

  "كيميائي",

  "ورقي",

  "مركب"

];



// طرق التسميد

export const fertilizerMethods = [

  "تربة",

  "رش ورقي",

  "مع الري"

];



// حالات العملية

export const fertilizerStatus = [

  "scheduled",

  "done",

  "pending"

];



// مستويات الأولوية

export const fertilizerPriority = [

  "low",

  "medium",

  "high"

];
