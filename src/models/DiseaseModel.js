// src/models/DiseaseModel.js


export const createDiseaseModel = (data = {}) => {


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



    // معلومات المرض

    diseaseName:
      data.diseaseName || "",



    symptoms:
      data.symptoms || "",



    severity:
      data.severity || "متوسطة",



    // العلاج والمتابعة

    treatment:
      data.treatment || "",



    prevention:
      data.prevention || "",



    // الزمن

    date:
      data.date || "",



    createdAt:
      data.createdAt ||
      new Date()
      .toISOString(),



    // إدارة الحالة

    status:
      data.status || "active",



    priority:
      data.priority || "medium",



    // بيانات إضافية

    notes:
      data.notes || "",



    // طبقة الذكاء الاصطناعي المستقبلية

    aiAnalysis:
      data.aiAnalysis || {


        riskLevel:
          "low",


        recommendation:
          "",


        possibleCauses:
          [],


        preventionTips:
          []


      }


  };


};





// درجات شدة المرض

export const diseaseSeverity = [

  "خفيفة",

  "متوسطة",

  "شديدة"

];





// حالات المرض

export const diseaseStatus = [

  "active",

  "treated",

  "monitoring"

];





// مستويات الأولوية

export const diseasePriority = [

  "low",

  "medium",

  "high"

];
