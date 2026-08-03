// src/models/ReportModel.js


/**
 * Report Model
 * نموذج التقارير الذكي
 *
 * مسؤول عن:
 * - إنشاء وإدارة تقارير المزرعة
 * - ربط التقارير بالبيانات الزراعية
 * - دعم التحليلات المستقبلية
 */


export class ReportModel {


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


    this.engineerId =
      data.engineerId ||
      "";



    // نوع التقرير

    this.type =
      data.type ||
      "farm";



    // بيانات التقرير

    this.title =
      data.title ||
      "";


    this.content =
      data.content ||
      "";


    this.data =
      data.data ||
      {};



    // الحالة

    this.status =
      data.status ||
      "created";



    // التحليل الذكي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        summary:"",


        recommendations:[],


        riskLevel:"low"


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





  changeStatus(status){


    this.status =
      status;


    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      fieldId:this.fieldId,


      engineerId:this.engineerId,


      type:this.type,


      title:this.title,


      content:this.content,


      data:this.data,


      status:this.status,


      aiAnalysis:this.aiAnalysis,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createReport = (data = {}) => {


  return new ReportModel(data);


};
