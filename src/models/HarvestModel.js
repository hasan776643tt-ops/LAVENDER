// src/models/HarvestModel.js


/**
 * Harvest Model
 * نموذج الحصاد الذكي
 *
 * مسؤول عن:
 * - تسجيل عمليات الحصاد
 * - ربط الحصاد بالمزرعة والحقل والمحصول
 * - دعم التحليلات والإنتاج
 */


export class HarvestModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // العلاقات الزراعية

    this.farmId =
      data.farmId ||
      "";


    this.fieldId =
      data.fieldId ||
      "";


    this.cropId =
      data.cropId ||
      "";



    // معلومات الحصاد

    this.date =
      data.date ||
      "";


    this.season =
      data.season ||
      "";



    // الإنتاج

    this.quantity =
      Number(data.quantity) || 0;


    this.unit =
      data.unit ||
      "kg";



    this.quality =
      data.quality ||
      "standard";



    // التكاليف

    this.cost =
      Number(data.cost) || 0;


    this.currency =
      data.currency ||
      "USD";



    // معلومات السوق

    this.marketPrice =
      Number(data.marketPrice) || 0;


    this.totalRevenue =
      Number(data.totalRevenue) || 0;



    // الحالة

    this.status =
      data.status ||
      "completed";



    // التحليل الذكي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        yieldScore:0,


        qualityScore:0,


        recommendations:[]


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





  calculateRevenue(){


    return (

      this.quantity *

      this.marketPrice

    );


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      fieldId:this.fieldId,


      cropId:this.cropId,


      date:this.date,


      season:this.season,


      quantity:this.quantity,


      unit:this.unit,


      quality:this.quality,


      cost:this.cost,


      currency:this.currency,


      marketPrice:this.marketPrice,


      totalRevenue:this.totalRevenue,


      status:this.status,


      aiAnalysis:this.aiAnalysis,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createHarvest = (data = {}) => {


  return new HarvestModel(data);


};
