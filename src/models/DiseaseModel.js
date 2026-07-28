// src/models/DiseaseModel.js


// إنشاء نموذج مرض زراعي ذكي

export const createDiseaseModel = (data = {}) => {


  return {


    // الهوية

    id:
      data.id ??
      crypto.randomUUID(),



    // العلاقات

    farmId:
      data.farmId ?? "",


    fieldId:
      data.fieldId ?? "",


    cropId:
      data.cropId ?? "",





    // معلومات المرض الأساسية

    diseaseName:
      data.diseaseName ?? "",


    scientificName:
      data.scientificName ?? "",


    symptoms:
      data.symptoms ?? "",


    severity:
      data.severity ?? DiseaseSeverity.MEDIUM,





    // التشخيص والعلاج

    diagnosis:
      data.diagnosis ?? "",


    treatment:
      data.treatment ?? "",


    prevention:
      data.prevention ?? "",


    pesticidesUsed:
      data.pesticidesUsed ?? [],





    // المتابعة الزمنية

    detectedDate:
      data.detectedDate ?? "",


    treatmentDate:
      data.treatmentDate ?? "",


    followUpDate:
      data.followUpDate ?? "",





    // الحالة والإدارة

    status:
      data.status ?? DiseaseStatus.ACTIVE,


    priority:
      data.priority ?? PriorityLevel.MEDIUM,





    // بيانات المراقبة

    images:
      data.images ?? [],


    notes:
      data.notes ?? "",





    // نظام الذكاء الاصطناعي مستقبلاً

    ai:

      data.ai ?? {


        riskScore: 0,


        riskLevel:
          "low",


        confidence:
          0,


        detectedSigns:
          [],


        recommendations:
          [],


        preventionPlan:
          []


      },





    // التحليلات

    analytics:

      data.analytics ?? {


        occurrenceCount:
          0,


        affectedArea:
          0,


        estimatedLoss:
          0,


        recoveryRate:
          0


      },





    // النظام

    createdAt:

      data.createdAt ??

      new Date()
      .toISOString(),



    updatedAt:

      data.updatedAt ??

      new Date()
      .toISOString()



  };


};









// درجات خطورة المرض

export const DiseaseSeverity = {


  LOW:
    "خفيفة",


  MEDIUM:
    "متوسطة",


  HIGH:
    "شديدة"


};









// حالات المرض

export const DiseaseStatus = {


  ACTIVE:
    "active",


  TREATED:
    "treated",


  MONITORING:
    "monitoring",


  CLOSED:
    "closed"


};









// مستويات الأولوية

export const PriorityLevel = {


  LOW:
    "low",


  MEDIUM:
    "medium",


  HIGH:
    "high",


  CRITICAL:
    "critical"


};
