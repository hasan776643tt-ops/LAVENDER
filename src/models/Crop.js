// src/models/Crop.js


/**
 * Crop Model
 * نموذج المحصول الموحد
 *
 * متوافق مع معمارية LAVENDER الحديثة
 */


export class Crop {


  constructor({

    id = null,

    farmId = "",

    fieldId = "",


    name = "",

    variety = "",

    category = "",


    season = "",


    plantingDate = "",

    expectedHarvestDate = "",

    actualHarvestDate = "",


    seedQuantity = 0,

    unit = "kg",


    expectedProduction = 0,

    actualProduction = 0,


    growthStage = "",


    status = "growing",


    notes = "",


    createdAt = new Date().toISOString(),

    updatedAt = new Date().toISOString()


  } = {}) {



    this.id = id;


    this.farmId = farmId;


    this.fieldId = fieldId;


    this.name = name;


    this.variety = variety;


    this.category = category;


    this.season = season;


    this.plantingDate = plantingDate;


    this.expectedHarvestDate = expectedHarvestDate;


    this.actualHarvestDate = actualHarvestDate;


    this.seedQuantity = Number(seedQuantity) || 0;


    this.unit = unit;


    this.expectedProduction = Number(expectedProduction) || 0;


    this.actualProduction = Number(actualProduction) || 0;


    this.growthStage = growthStage;


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





  getProductionRate(){


    if(!this.expectedProduction){


      return 0;


    }



    return (

      this.actualProduction /

      this.expectedProduction

    ) * 100;


  }





  toJSON(){


    return {


      id:this.id,


      farmId:this.farmId,


      fieldId:this.fieldId,


      name:this.name,


      variety:this.variety,


      category:this.category,


      season:this.season,


      plantingDate:this.plantingDate,


      expectedHarvestDate:this.expectedHarvestDate,


      actualHarvestDate:this.actualHarvestDate,


      seedQuantity:this.seedQuantity,


      unit:this.unit,


      expectedProduction:this.expectedProduction,


      actualProduction:this.actualProduction,


      growthStage:this.growthStage,


      status:this.status,


      notes:this.notes,


      createdAt:this.createdAt,


      updatedAt:this.updatedAt


    };


  }


}
