// src/models/FarmModel.js


/**
 * Farm Model
 * نموذج بيانات المزرعة الذكي
 *
 * مسؤول عن:
 * - توحيد شكل بيانات المزرعة
 * - تجهيز البيانات للتخزين
 * - دعم التوسع مستقبلاً
 */


export class FarmModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      Date.now();



    this.name =
      data.name ||
      "";



    this.owner =
      data.owner ||
      "";



    this.location =
      data.location ||
      "";



    this.latitude =
      data.latitude ||
      null;



    this.longitude =
      data.longitude ||
      null;



    this.area =
      Number(data.area) || 0;



    this.unit =
      data.unit ||
      "دونم";



    this.soilType =
      data.soilType ||
      "";



    this.waterSource =
      data.waterSource ||
      "";



    this.description =
      data.description ||
      "";



    this.status =
      data.status ||
      "active";



    this.createdAt =
      data.createdAt ||
      new Date().toISOString();



    this.updatedAt =
      new Date().toISOString();


  }




  /**
   * تحديث بيانات المزرعة
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
   * تحويل إلى بيانات قابلة للتخزين
   */

  toJSON(){


    return {


      id:this.id,

      name:this.name,

      owner:this.owner,

      location:this.location,

      latitude:this.latitude,

      longitude:this.longitude,

      area:this.area,

      unit:this.unit,

      soilType:this.soilType,

      waterSource:this.waterSource,

      description:this.description,

      status:this.status,

      createdAt:this.createdAt,

      updatedAt:this.updatedAt


    };


  }




}



/**
 * إنشاء مزرعة جديدة بسهولة
 */

export const createFarm = (data)=>{


return new FarmModel(data);


};
