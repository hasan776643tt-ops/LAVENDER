// src/models/EngineerModel.js


import {
  createId,
  createTimestamp
} from "../context/DataModel";



export default class EngineerModel {


  constructor(data = {}) {


    this.id =
      data.id || createId();



    this.name =
      data.name || "";



    this.email =
      data.email || "";



    this.phone =
      data.phone || "";



    this.specialty =
      data.specialty || "Agriculture";



    this.experience =
      data.experience || 0;



    this.location = {

      city:
        data.location?.city || "",

      coordinates:
        data.location?.coordinates || {
          latitude:"",
          longitude:""
        }

    };



    this.status =
      data.status || "active";



    this.available =
      data.available ?? true;



    this.rating =
      data.rating || 0;



    this.farms =
      data.farms || [];



    this.consultations =
      data.consultations || [];



    this.image =
      data.image || "";



    this.createdAt =
      data.createdAt || createTimestamp();



    this.updatedAt =
      data.updatedAt || createTimestamp();


  }




  update(data = {}){


    Object.assign(
      this,
      data
    );


    this.updatedAt =
      createTimestamp();

  }





  addFarm(farmId){


    if(
      !this.farms.includes(farmId)
    ){

      this.farms.push(
        farmId
      );

    }

  }





  addConsultation(consultationId){


    if(
      !this.consultations.includes(
        consultationId
      )
    ){

      this.consultations.push(
        consultationId
      );

    }

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
