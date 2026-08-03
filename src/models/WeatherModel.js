// src/models/WeatherModel.js


/**
 * Weather Model
 * نموذج الطقس الذكي
 *
 * مسؤول عن:
 * - تخزين بيانات الطقس للمزرعة
 * - ربط الطقس بالموقع الجغرافي
 * - دعم القرارات الزراعية الذكية
 */


export class WeatherModel {


  constructor(data = {}) {


    this.id =
      data.id ||
      (
        globalThis.crypto?.randomUUID?.()
        ||
        Date.now().toString()
      );



    // العلاقة

    this.farmId =
      data.farmId ||
      "";



    // الموقع

    this.location = {


      city:
        data.location?.city ||
        "",


      latitude:
        data.location?.latitude ??
        null,


      longitude:
        data.location?.longitude ??
        null,


      address:
        data.location?.address ||
        ""


    };



    // حالة الطقس

    this.condition =
      data.condition ||
      "";



    this.temperature =
      Number(data.temperature) || 0;



    this.humidity =
      Number(data.humidity) || 0;



    this.windSpeed =
      Number(data.windSpeed) || 0;



    this.pressure =
      Number(data.pressure) || 0;



    // الأمطار

    this.rainfall =
      Number(data.rainfall) || 0;



    this.rainProbability =
      Number(data.rainProbability) || 0;



    // التوقعات

    this.forecast =
      data.forecast ||
      [];



    // تأثير زراعي

    this.agricultureImpact =
      data.agricultureImpact ||
      {


        irrigationRecommendation:"",


        diseaseRisk:"low",


        frostRisk:"low"


      };



    // مصدر البيانات

    this.source =
      data.source ||
      "manual";



    // الوقت

    this.recordedAt =
      data.recordedAt ||
      new Date().toISOString();



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





  isSuitableForIrrigation(){


    return (

      this.rainProbability < 50

    );


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      location:this.location,


      condition:this.condition,


      temperature:this.temperature,


      humidity:this.humidity,


      windSpeed:this.windSpeed,


      pressure:this.pressure,


      rainfall:this.rainfall,


      rainProbability:this.rainProbability,


      forecast:this.forecast,


      agricultureImpact:this.agricultureImpact,


      source:this.source,


      recordedAt:this.recordedAt,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}





export const createWeather = (data = {}) => {


  return new WeatherModel(data);


};
