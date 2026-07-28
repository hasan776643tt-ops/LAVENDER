// src/models/ConsultationModel.js


export default class ConsultationModel {


  constructor(data = {}) {


    // المعرف
    this.id =
      data.id || Date.now();



    // معرف المزارع
    this.farmerId =
      data.farmerId || "";



    // معرف المزرعة
    this.farmId =
      data.farmId || "";



    // معرف المهندس
    this.engineerId =
      data.engineerId || "";



    // عنوان الاستشارة
    this.title =
      data.title || "";



    // نوع المشكلة
    this.type =
      data.type || "";



    // وصف المشكلة
    this.description =
      data.description || "";



    // صورة المشكلة مستقبلاً
    this.image =
      data.image || "";



    // رد المهندس
    this.response =
      data.response || "";



    // حالة الاستشارة
    // pending - answered - closed
    this.status =
      data.status || "pending";



    // أولوية الطلب
    this.priority =
      data.priority || "normal";



    // تاريخ الطلب
    this.createdAt =
      data.createdAt || new Date();



    // تاريخ الرد
    this.updatedAt =
      data.updatedAt || null;


  }



  // تحديث بيانات الاستشارة
  update(data = {}) {

    Object.assign(
      this,
      data
    );

    this.updatedAt =
      new Date();

  }



  // إضافة رد المهندس
  addResponse(response){

    this.response =
      response;

    this.status =
      "answered";

    this.updatedAt =
      new Date();

  }



  // إغلاق الاستشارة
  close(){

    this.status =
      "closed";

    this.updatedAt =
      new Date();

  }



  // تحويل البيانات للحفظ
  toJSON(){

    return {

      id:this.id,
      farmerId:this.farmerId,
      farmId:this.farmId,
      engineerId:this.engineerId,
      title:this.title,
      type:this.type,
      description:this.description,
      image:this.image,
      response:this.response,
      status:this.status,
      priority:this.priority,
      createdAt:this.createdAt,
      updatedAt:this.updatedAt

    };

  }


}
