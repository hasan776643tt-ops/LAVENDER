// src/models/FieldModel.js


/**
 * Field Model
 * نموذج بيانات الحقل الذكي
 *
 * المسؤوليات:
 * - إدارة بيانات الحقل الأساسية
 * - الربط مع المزرعة
 * - دعم GPS والموقع
 * - جاهز للتوسع مع Crop / Irrigation
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



    // بيانات الحقل الأساسية

    this.name =
      data.name ||
      "";


    this.area =
      Number(data.area) || 0;


    this.unit =
      data.unit ||
      "dunum";



    // معلومات التربة والمياه

    this.soilType =
      data.soilType ||
      "";


    this.waterSource =
      data.waterSource ||
      "";



    // الموقع الذكي GPS

    this.location = {


      latitude:
        data.location?.latitude ??
        data.latitude ??
        null,


      longitude:
        data.location?.longitude ??
        data.longitude ??
        null,


      address:
        data.location?.address ||
        ""

    };



    // العلاقات

    this.cropId =
      data.cropId ||
      "";



    // معلومات الزراعة

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
      data.updatedAt ||
      new Date().toISOString();


  }





  /**
   * تحديث بيانات الحقل
   */

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





  /**
   * إرجاع الموقع
   */

  getLocation(){


    return this.location;


  }





  /**
   * حساب المساحة
   */

  getArea(){


    return {

      value:this.area,

      unit:this.unit

    };


  }





  /**
   * تجهيز البيانات للحفظ
   */

  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      name:this.name,


      area:this.area,


      unit:this.unit,


      soilType:this.soilType,


      waterSource:this.waterSource,


      location:this.location,


      cropId:this.cropId,


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

export const createField = (data = {}) => {


  return new FieldModel(data);


};
