// src/models/FertilizerModel.js


/**
 * Fertilizer Model
 * نموذج بيانات التسميد الذكي
 *
 * مسؤول عن:
 * - إدارة عمليات التسميد
 * - ربط المزرعة والحقل والمحصول
 * - دعم التحليلات الذكية
 */


export class FertilizerModel {


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



    // معلومات السماد

    this.type =
      data.type ||
      "";


    this.category =
      data.category ||
      "organic";


    this.quantity =
      Number(data.quantity) || 0;


    this.unit =
      data.unit ||
      "kg";



    // طريقة الاستخدام

    this.method =
      data.method ||
      "soil";


    this.stage =
      data.stage ||
      "";



    // المورد والتكلفة

    this.supplier =
      data.supplier ||
      "";


    this.cost =
      Number(data.cost) || 0;


    this.currency =
      data.currency ||
      "USD";



    // الزمن

    this.date =
      data.date ||
      "";



    // الحالة

    this.status =
      data.status ||
      "scheduled";


    this.priority =
      data.priority ||
      "medium";



    // التحليل الذكي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        recommendation:"",


        riskLevel:"low",


        efficiency:null


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


      type:this.type,


      category:this.category,


      quantity:this.quantity,


      unit:this.unit,


      method:this.method,


      stage:this.stage,


      supplier:this.supplier,


      cost:this.cost,


      currency:this.currency,


      date:this.date,


      status:this.status,


      priority:this.priority,


      aiAnalysis:this.aiAnalysis,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createFertilizer = (data = {}) => {


  return new FertilizerModel(data);


};





export const fertilizerCategories = [

  "organic",

  "chemical",

  "foliar",

  "compound"

];





export const fertilizerMethods = [

  "soil",

  "foliar",

  "irrigation"

];





export const fertilizerStatus = [

  "scheduled",

  "done",

  "pending"

];





export const fertilizerPriority = [

  "low",

  "medium",

  "high"

];
