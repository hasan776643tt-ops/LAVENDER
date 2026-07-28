// src/models/EngineerModel.js


export default class EngineerModel {

  constructor(data = {}) {


    // المعرف
    this.id =
      data.id || Date.now();



    // اسم المهندس
    this.name =
      data.name || "";



    // البريد الإلكتروني
    this.email =
      data.email || "";



    // رقم الهاتف
    this.phone =
      data.phone || "";



    // الاختصاص الزراعي
    this.specialty =
      data.specialty || "Agriculture";



    // سنوات الخبرة
    this.experience =
      data.experience || 0;



    // موقع المهندس
    this.location =
      data.location || "";



    // حالة الحساب
    this.status =
      data.status || "active";



    // المزارع المرتبطة بالمهندس
    this.farms =
      data.farms || [];



    // الاستشارات المقدمة
    this.consultations =
      data.consultations || [];



    // صورة المهندس مستقبلاً
    this.image =
      data.image || "";



    // تاريخ إنشاء الحساب
    this.createdAt =
      data.createdAt || new Date();

  }



  // تحديث بيانات المهندس
  update(data = {}) {

    Object.assign(
      this,
      data
    );

  }



  // إضافة مزرعة للمهندس
  addFarm(farmId) {

    if(!this.farms.includes(farmId)){

      this.farms.push(farmId);

    }

  }



  // إضافة استشارة
  addConsultation(consultationId){

    this.consultations.push(
      consultationId
    );

  }



  // تحويل النموذج إلى بيانات قابلة للحفظ
  toJSON(){

    return {

      id:this.id,
      name:this.name,
      email:this.email,
      phone:this.phone,
      specialty:this.specialty,
      experience:this.experience,
      location:this.location,
      status:this.status,
      farms:this.farms,
      consultations:this.consultations,
      image:this.image,
      createdAt:this.createdAt

    };

  }


}
