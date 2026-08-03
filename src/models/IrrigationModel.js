// src/models/IrrigationModel.js


/**
 * Irrigation Model
 * نموذج بيانات الري الذكي
 *
 * مسؤول عن:
 * - إدارة عمليات الري
 * - ربط المزرعة والحقل والمحصول
 * - دعم التحليلات الزراعية
 */


export class IrrigationModel {


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



    // معلومات الري

    this.method =
      data.method ||
      "drip";


    this.waterAmount =
      Number(data.waterAmount) || 0;


    this.waterUnit =
      data.waterUnit ||
      "liter";


    this.duration =
      Number(data.duration) || 0;



    // الجدولة

    this.date =
      data.date ||
      "";


    this.status =
      data.status ||
      "scheduled";



    // الأولوية

    this.priority =
      data.priority ||
      "medium";



    // البيانات الذكية

    this.weatherImpact =
      data.weatherImpact ||
      "";


    this.soilMoisture =
      Number(data.soilMoisture) || 0;


    this.efficiency =
      Number(data.efficiency) || 0;



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


      method:this.method,


      waterAmount:this.waterAmount,


      waterUnit:this.waterUnit,


      duration:this.duration,


      date:this.date,


      status:this.status,


      priority:this.priority,


      weatherImpact:this.weatherImpact,


      soilMoisture:this.soilMoisture,


      efficiency:this.efficiency,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createIrrigation = (data = {}) => {


  return new IrrigationModel(data);


};
