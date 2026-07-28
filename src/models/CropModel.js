// src/models/CropModel.js


/**
 * Crop Model
 * نموذج بيانات المحصول الذكي
 *
 * مسؤول عن:
 * - توحيد بيانات المحاصيل
 * - ربط المحصول بالمزرعة والحقل
 * - تجهيز البيانات للتحليلات الذكية
 */



export class CropModel {


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



    // معلومات المحصول

    this.name =
      data.name ||
      "";


    this.variety =
      data.variety ||
      "";



    // التواريخ الزراعية

    this.plantingDate =
      data.plantingDate ||
      "";


    this.harvestDate =
      data.harvestDate ||
      "";



    // الكميات

    this.seedQuantity =
      Number(data.seedQuantity) || 0;



    this.expectedProduction =
      Number(data.expectedProduction) || 0;



    this.actualProduction =
      Number(data.actualProduction) || 0;



    // حالة المحصول

    this.status =
      data.status ||
      "growing";



    // مراحل النمو

    this.growthStage =
      data.growthStage ||
      "";



    // ملاحظات

    this.notes =
      data.notes ||
      "";



    // النظام الزمني

    this.createdAt =
      data.createdAt ||
      new Date().toISOString();



    this.updatedAt =
      new Date().toISOString();



  }







  /**
   * تحديث بيانات المحصول
   */


  update(data = {}){


    Object.keys(data).forEach(key=>{


      if(
        data[key] !== undefined
      ){

        this[key] =
          data[key];

      }


    });



    this.updatedAt =
      new Date().toISOString();



    return this;


  }








  /**
   * حساب نسبة الإنتاج
   */


  getProductionRate(){


    if(
      !this.expectedProduction
    )

      return 0;



    return (

      this.actualProduction /

      this.expectedProduction

    ) * 100;


  }








  /**
   * تحويل البيانات للحفظ
   */


  toJSON(){


    return {


      id:this.id,

      farmId:this.farmId,

      fieldId:this.fieldId,


      name:this.name,

      variety:this.variety,


      plantingDate:this.plantingDate,

      harvestDate:this.harvestDate,


      seedQuantity:this.seedQuantity,


      expectedProduction:this.expectedProduction,

      actualProduction:this.actualProduction,


      status:this.status,

      growthStage:this.growthStage,


      notes:this.notes,


      createdAt:this.createdAt,

      updatedAt:this.updatedAt


    };


  }



}








/**
 * إنشاء محصول جديد
 */


export const createCrop = (data)=>{


  return new CropModel(data);


};
