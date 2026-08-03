// src/models/EngineerModel.js


/**
 * Engineer Model
 * نموذج المهندس الزراعي الذكي
 *
 * مسؤول عن:
 * - إدارة بيانات المهندسين
 * - ربط المهندس بالمزارع والاستشارات
 * - دعم نظام الاستشارات الزراعية
 */


export class EngineerModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // البيانات الأساسية

    this.name =
      data.name ||
      "";


    this.email =
      data.email ||
      "";


    this.phone =
      data.phone ||
      "";



    // الاختصاص

    this.specialty =
      data.specialty ||
      "Agriculture";


    this.experience =
      Number(data.experience) || 0;



    // الموقع

    this.location =
      data.location ||
      {


        city:"",


        coordinates:{


          latitude:null,


          longitude:null


        }


      };



    // الحالة

    this.status =
      data.status ||
      "active";


    this.available =
      data.available ??
      true;



    // التقييم

    this.rating =
      Number(data.rating) || 0;



    // العلاقات

    this.farms =
      data.farms ||
      [];


    this.consultations =
      data.consultations ||
      [];



    // الصورة

    this.image =
      data.image ||
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





  addFarm(farmId){


    if(
      farmId &&
      !this.farms.includes(farmId)
    ){


      this.farms.push(farmId);


    }


    return this;


  }





  addConsultation(consultationId){


    if(
      consultationId &&
      !this.consultations.includes(
        consultationId
      )
    ){


      this.consultations.push(
        consultationId
      );


    }


    return this;


  }





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


      available:this.available,


      rating:this.rating,


      farms:this.farms,


      consultations:this.consultations,


      image:this.image,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createEngineer = (data = {}) => {


  return new EngineerModel(data);


};
