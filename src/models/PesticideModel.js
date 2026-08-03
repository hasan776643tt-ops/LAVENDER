// src/models/PesticideModel.js


/**
 * Pesticide Model
 * نموذج بيانات المبيدات الذكي
 *
 * مسؤول عن:
 * - إدارة عمليات مكافحة الآفات
 * - ربط المبيد بالمزرعة والحقل والمحصول
 * - دعم التحليلات والسلامة الزراعية
 */


export class PesticideModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      Date.now();



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



    // معلومات المبيد

    this.name =
      data.name ||
      "";


    this.active =
      data.active ||
      "";


    this.target =
      data.target ||
      "";



    // الكمية

    this.quantity =
      Number(data.quantity) || 0;


    this.unit =
      data.unit ||
      "liter";



    // طريقة الاستخدام

    this.method =
      data.method ||
      "spray";



    // الزمن

    this.date =
      data.date ||
      "";



    // فترة الأمان قبل الحصاد

    this.safetyDays =
      Number(data.safetyDays) || 0;



    // الحالة والمتابعة

    this.status =
      data.status ||
      "scheduled";


    this.priority =
      data.priority ||
      "medium";



    // المورد والتكلفة

    this.supplier =
      data.supplier ||
      "";


    this.cost =
      Number(data.cost) || 0;


    this.currency =
      data.currency ||
      "USD";



    // الذكاء الاصطناعي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        riskLevel:"low",


        recommendation:"",


        harvestWarning:""


      };



    // ملاحظات

    this.notes =
      data.notes ||
      "";



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


      name:this.name,


      active:this.active,


      target:this.target,


      quantity:this.quantity,


      unit:this.unit,


      method:this.method,


      date:this.date,


      safetyDays:this.safetyDays,


      status:this.status,


      priority:this.priority,


      supplier:this.supplier,


      cost:this.cost,


      currency:this.currency,


      aiAnalysis:this.aiAnalysis,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createPesticide = (data = {}) => {


  return new PesticideModel(data);


};





export const pesticideUnits = [

  "ml",

  "liter",

  "kg"

];





export const pesticideMethods = [

  "spray",

  "irrigation",

  "soil"

];





export const pesticideStatus = [

  "scheduled",

  "done",

  "pending"

];





export const pesticidePriority = [

  "low",

  "medium",

  "high"

];
