// src/models/ConsultationModel.js


/**
 * Consultation Model
 * نموذج الاستشارات الزراعية الذكي
 */


export class ConsultationModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // العلاقات

    this.farmerId =
      data.farmerId ||
      "";


    this.farmId =
      data.farmId ||
      "";


    this.engineerId =
      data.engineerId ||
      "";



    // بيانات الاستشارة

    this.title =
      data.title ||
      "";


    this.type =
      data.type ||
      "";


    this.description =
      data.description ||
      "";



    // المرفقات

    this.images =
      data.images ||
      [];



    // الرد

    this.response =
      data.response ||
      "";



    // الحالة

    this.status =
      data.status ||
      "pending";



    this.priority =
      data.priority ||
      "medium";



    // تقييم الحل

    this.rating =
      Number(data.rating) || 0;



    // طبقة الذكاء الاصطناعي

    this.aiAnalysis =
      data.aiAnalysis ||
      {


        diagnosis:"",


        recommendations:[],


        confidence:0


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





  addResponse(response){


    this.response =
      response;


    this.status =
      "answered";


    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  close(){


    this.status =
      "closed";


    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  toJSON(){


    return {


      id:this.id,


      farmerId:this.farmerId,


      farmId:this.farmId,


      engineerId:this.engineerId,


      title:this.title,


      type:this.type,


      description:this.description,


      images:this.images,


      response:this.response,


      status:this.status,


      priority:this.priority,


      rating:this.rating,


      aiAnalysis:this.aiAnalysis,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createConsultation = (data = {}) => {


  return new ConsultationModel(data);


};
