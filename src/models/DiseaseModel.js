// src/models/DiseaseModel.js


/**
 * Disease Model
 * نموذج المرض الزراعي الذكي
 *
 * مسؤول عن:
 * - إدارة الأمراض الزراعية
 * - متابعة التشخيص والعلاج
 * - دعم الذكاء الاصطناعي والتحليلات
 */


export class DiseaseModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // العلاقات

    this.farmId =
      data.farmId ||
      "";


    this.fieldId =
      data.fieldId ||
      "";


    this.cropId =
      data.cropId ||
      "";



    // معلومات المرض

    this.diseaseName =
      data.diseaseName ||
      "";


    this.scientificName =
      data.scientificName ||
      "";


    this.symptoms =
      data.symptoms ||
      "";


    this.severity =
      data.severity ||
      DiseaseSeverity.MEDIUM;



    // التشخيص والعلاج

    this.diagnosis =
      data.diagnosis ||
      "";


    this.treatment =
      data.treatment ||
      "";


    this.prevention =
      data.prevention ||
      "";


    this.pesticidesUsed =
      data.pesticidesUsed ||
      [];



    // المتابعة الزمنية

    this.detectedDate =
      data.detectedDate ||
      "";


    this.treatmentDate =
      data.treatmentDate ||
      "";


    this.followUpDate =
      data.followUpDate ||
      "";



    // الإدارة

    this.status =
      data.status ||
      DiseaseStatus.ACTIVE;


    this.priority =
      data.priority ||
      PriorityLevel.MEDIUM;



    // الصور والملاحظات

    this.images =
      data.images ||
      [];


    this.notes =
      data.notes ||
      "";



    // الذكاء الاصطناعي

    this.ai =
      data.ai ||
      {


        riskScore:0,


        riskLevel:"low",


        confidence:0,


        detectedSigns:[],


        recommendations:[],


        preventionPlan:[]


      };



    // التحليلات

    this.analytics =
      data.analytics ||
      {


        occurrenceCount:0,


        affectedArea:0,


        estimatedLoss:0,


        recoveryRate:0


      };



    // النظام الزمني

    this.createdAt =
      data.createdAt ||
      new Date().toISOString();


    this.updatedAt =
      data.updatedAt ||
      new Date().toISOString();


  }





  update(data = {}){


    Object.keys(data)
    .forEach(key => {


      if(data[key] !== undefined){


        this[key] =
          data[key];


      }


    });



    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      fieldId:this.fieldId,


      cropId:this.cropId,


      diseaseName:this.diseaseName,


      scientificName:this.scientificName,


      symptoms:this.symptoms,


      severity:this.severity,


      diagnosis:this.diagnosis,


      treatment:this.treatment,


      prevention:this.prevention,


      pesticidesUsed:this.pesticidesUsed,


      detectedDate:this.detectedDate,


      treatmentDate:this.treatmentDate,


      followUpDate:this.followUpDate,


      status:this.status,


      priority:this.priority,


      images:this.images,


      notes:this.notes,


      ai:this.ai,


      analytics:this.analytics,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createDisease = (data = {}) => {


  return new DiseaseModel(data);


};





export const DiseaseSeverity = {


  LOW:"low",


  MEDIUM:"medium",


  HIGH:"high"


};





export const DiseaseStatus = {


  ACTIVE:"active",


  TREATED:"treated",


  MONITORING:"monitoring",


  CLOSED:"closed"


};





export const PriorityLevel = {


  LOW:"low",


  MEDIUM:"medium",


  HIGH:"high",


  CRITICAL:"critical"


};
