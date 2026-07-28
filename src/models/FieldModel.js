// src/models/FieldModel.js


/**
 * Field Model
 * نموذج بيانات الحقل الذكي
 *
 * مسؤول عن:
 * - توحيد بيانات الحقول
 * - ربط الحقل بالمزرعة
 * - دعم التوسع والتحليلات المستقبلية
 */


export class FieldModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      Date.now();



    // ارتباط بالمزرعة

    this.farmId =
      data.farmId ||
      "";



    // معلومات الحقل الأساسية

    this.name =
      data.name ||
      "";



    this.area =
      Number(data.area) || 0;



    this.unit =
      data.unit ||
      "دونم";



    this.soilType =
      data.soilType ||
      "";



    this.location =
      data.location ||
      "";



    // GPS

    this.latitude =
      data.latitude ||
      null;



    this.longitude =
      data.longitude ||
      null;



    // المحصول الحالي

    this.currentCrop =
      data.currentCrop ||
      "";



    this.plantingDate =
      data.plantingDate ||
      "";



    // حالة الحقل

    this.status =
      data.status ||
      "active";



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
   * تحديث بيانات الحقل
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
   * حساب مساحة الحقل
   */


  getArea(){


    return {


      value:this.area,

      unit:this.unit


    };


  }







  /**
   * تحويل البيانات للحفظ
   */


  toJSON(){


    return {


      id:this.id,

      farmId:this.farmId,

      name:this.name,

      area:this.area,

      unit:this.unit,

      soilType:this.soilType,

      location:this.location,

      latitude:this.latitude,

      longitude:this.longitude,

      currentCrop:this.currentCrop,

      plantingDate:this.plantingDate,

      status:this.status,

      notes:this.notes,

      createdAt:this.createdAt,

      updatedAt:this.updatedAt


    };


  }



}







/**
 * إنشاء حقل جديد
 */


export const createField = (data)=>{


  return new FieldModel(data);


};
