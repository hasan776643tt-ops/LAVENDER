// src/services/engineerService.js


import engineerRepository
from "../repositories/engineerRepository.js";



class EngineerService {



  constructor() {

    this.repository =
      engineerRepository;

  }





  async getAll() {

    return await this.repository.getAll();

  }





  async getById(id) {


    if(!id){

      throw new Error(
        "ENGINEER_ID_REQUIRED"
      );

    }



    const engineer =
      await this.repository.getById(id);



    if(!engineer){

      throw new Error(
        "ENGINEER_NOT_FOUND"
      );

    }



    return engineer;

  }





  async create(data) {


    this.validate(data);



    return await this.repository.create(
      data
    );

  }





  async update(id,data) {


    if(!id){

      throw new Error(
        "ENGINEER_ID_REQUIRED"
      );

    }



    this.validate(data);



    const updated =
      await this.repository.update(
        id,
        data
      );



    if(!updated){

      throw new Error(
        "ENGINEER_NOT_FOUND"
      );

    }



    return updated;

  }





  async delete(id) {


    if(!id){

      throw new Error(
        "ENGINEER_ID_REQUIRED"
      );

    }



    const deleted =
      await this.repository.delete(id);



    if(!deleted){

      throw new Error(
        "ENGINEER_NOT_FOUND"
      );

    }



    return true;

  }





  async exists(id) {


    if(!id){

      return false;

    }



    return Boolean(

      await this.repository.getById(id)

    );

  }





  async count() {


    const engineers =
      await this.repository.getAll();



    return engineers.length;

  }





  async search(keyword) {


    const engineers =
      await this.repository.getAll();



    if(!keyword){

      return engineers;

    }



    const search =
      keyword.toLowerCase();



    return engineers.filter(

      engineer =>


        engineer.name
        ?.toLowerCase()
        .includes(search)


        ||


        engineer.specialization
        ?.toLowerCase()
        .includes(search)


        ||


        engineer.city
        ?.toLowerCase()
        .includes(search)


    );

  }





  async findBySpecialization(
    specialization
  ) {


    if(!specialization){

      return [];

    }



    const engineers =
      await this.repository.getAll();



    const search =
      specialization.toLowerCase();



    return engineers.filter(

      engineer =>

      engineer.specialization
      ?.toLowerCase()
      === search

    );


  }





  async findByCity(city) {


    if(!city){

      return [];

    }



    const engineers =
      await this.repository.getAll();



    const search =
      city.toLowerCase();



    return engineers.filter(

      engineer =>

      engineer.city
      ?.toLowerCase()
      === search

    );


  }





  validate(data){


    if(
      !data ||
      typeof data !== "object"
    ){

      throw new Error(
        "ENGINEER_DATA_REQUIRED"
      );

    }



    if(
      !data.name ||
      !data.name.trim()
    ){

      throw new Error(
        "ENGINEER_NAME_REQUIRED"
      );

    }



    return true;

  }



}



export default Object.freeze(
  new EngineerService()
);
