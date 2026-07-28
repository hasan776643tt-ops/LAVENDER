// src/models/ReportModel.js


export default class ReportModel {


  constructor(data = {}) {


    // المعرف
    this.id =
      data.id || Date.now();



    // معرف المزرعة
    this.farmId =
      data.farmId || "";



    // معرف الحقل
    this.fieldId =
      data.fieldId || "";



    // نوع التقرير
    // farm - crop - disease - irrigation - fertilizer
    this.type =
      data.type || "farm";



    // عنوان التقرير
    this.title =
      data.title || "";



    // محتوى التقرير
    this.content =
      data.content || "";



    // بيانات التقرير
    this.data =
      data.data || {};



    // اسم المهندس المسؤول
    this.engineerId =
      data.engineerId || "";



    // حالة التقرير
    this.status =
      data.status || "created";



    // تاريخ إنشاء التقرير
    this.createdAt =
      data.createdAt || new Date();



    // تاريخ التحديث
    this.updatedAt =
      data.updatedAt || null;


  }



  // تحديث التقرير
  update(data = {}) {

    Object.assign(
      this,
      data
    );


    this.updatedAt =
      new Date();

  }



  // تغيير حالة التقرير
  changeStatus(status){

    this.status =
      status;


    this.updatedAt =
      new Date();

  }



  // تحويل البيانات للحفظ
  toJSON(){

    return {

      id:this.id,
      farmId:this.farmId,
      fieldId:this.fieldId,
      type:this.type,
      title:this.title,
      content:this.content,
      data:this.data,
      engineerId:this.engineerId,
      status:this.status,
      createdAt:this.createdAt,
      updatedAt:this.updatedAt

    };

  }


}
