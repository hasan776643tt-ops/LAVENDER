// src/models/Field.js


/**
 * Field Model Legacy Replacement
 *
 * نموذج الحقل الموحد
 *
 * ملاحظة:
 * هذا الملف أصبح متوافقاً مع معمارية LAVENDER الحديثة
 * ويدعم:
 * - GPS
 * - العلاقات
 * - التوسع المستقبلي
 */


export class Field {


  constructor({

    id = null,

    farmId = "",

    name = "",

    area = 0,

    unit = "dunum",

    soilType = "",

    waterSource = "",


    location = {

      latitude: null,

      longitude: null,

      address: ""

    },


    cropId = "",


    plantingDate = "",


    status = "active",


    notes = "",


    createdAt = new Date().toISOString(),


    updatedAt = new Date().toISOString()


  } = {}) {



    this.id = id;


    this.farmId = farmId;


    this.name = name;


    this.area = Number(area) || 0;


    this.unit = unit;



    this.soilType = soilType;


    this.waterSource = waterSource;



    this.location = {


      latitude:
        location.latitude ?? null,


      longitude:
        location.longitude ?? null,


      address:
        location.address || ""


    };



    this.cropId = cropId;


    this.plantingDate = plantingDate;


    this.status = status;


    this.notes = notes;


    this.createdAt = createdAt;


    this.updatedAt = updatedAt;



  }





  update(data = {}){


    Object.assign(

      this,

      data

    );


    this.updatedAt =
      new Date().toISOString();



    return this;


  }





  getLocation(){


    return this.location;


  }





  getArea(){


    return {


      value:this.area,


      unit:this.unit


    };


  }





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
