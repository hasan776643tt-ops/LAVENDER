// src/models/CropModel.js


/**
 * Crop Model
 * نموذج بيانات المحصول الذكي
 *
 * المسؤوليات:
 * - إدارة بيانات المحصول
 * - الربط مع Farm و Field
 * - دعم التحليلات الزراعية
 * - قابل للتوسع مستقبلاً
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



    // بيانات المحصول

    this.name =
      data.name ||
      "";


    this.variety =
      data.variety ||
      "";



    this.category =
      data.category ||
      "";



    // الموسم الزراعي

    this.season =
      data.season ||
      "";



    // التواريخ

    this.plantingDate =
      data.plantingDate ||
      "";


    this.expectedHarvestDate =
      data.expectedHarvestDate ||
      "";


    this.actualHarvestDate =
      data.actualHarvestDate ||
      "";



    // الموارد

    this.seedQuantity =
      Number(data.seedQuantity) || 0;



    this.unit =
      data.unit ||
      "kg";



    // الإنتاج

    this.expectedProduction =
      Number(data.expectedProduction) || 0;



    this.actualProduction =
      Number(data.actualProduction) || 0;



    // النمو والحالة

    this.growthStage =
      data.growthStage ||
      "";


    this.status =
      data.status ||
      "growing";



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


    Object.keys(data).forEach(key => {


      if(data[key] !== undefined){


        this[key] =
          data[key];


      }


    });



    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  getProductionRate(){


    if(!this.expectedProduction){


      return 0;


    }



    return (

      this.actualProduction /

      this.expectedProduction

    ) * 100;


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      fieldId:this.fieldId,


      name:this.name,


      variety:this.variety,


      category:this.category,


      season:this.season,


      plantingDate:this.plantingDate,


      expectedHarvestDate:this.expectedHarvestDate,


      actualHarvestDate:this.actualHarvestDate,


      seedQuantity:this.seedQuantity,


      unit:this.unit,


      expectedProduction:this.expectedProduction,


      actualProduction:this.actualProduction,


      growthStage:this.growthStage,


      status:this.status,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createCrop = (data = {}) => {


  return new CropModel(data);


};
