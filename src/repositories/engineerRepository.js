// src/repositories/engineerRepository.js


import storageService
from "../services/storageService.js";



class EngineerRepository {



  constructor() {

    this.key =
      "engineers";

  }



  async getAll() {

    try {

      return storageService.load(
        this.key,
        []
      );


    } catch(error) {

      throw new Error(
        `EngineerRepository getAll failed: ${error.message}`
      );

    }

  }




  async getById(id) {

    try {


      if(!id){

        return null;

      }


      const engineers =
        await this.getAll();



      return (

        engineers.find(

          engineer =>

          String(engineer.id) === String(id)

        )
        ||
        null

      );


    } catch(error) {


      throw new Error(
        `EngineerRepository getById failed: ${error.message}`
      );

    }

  }




  async create(data) {


    try {


      this.validate(data);



      const engineers =
        await this.getAll();



      const engineer = {


        id:
          crypto.randomUUID(),



        ...data,



        createdAt:
          new Date().toISOString(),



        updatedAt:
          new Date().toISOString()


      };



      engineers.push(
        engineer
      );



      storageService.save(

        this.key,

        engineers

      );



      return engineer;



    } catch(error) {


      throw new Error(
        `EngineerRepository create failed: ${error.message}`
      );

    }

  }





  async update(id,data) {


    try {


      if(!id){

        throw new Error(
          "Engineer ID is required"
        );

      }



      this.validate(data);



      const engineers =
        await this.getAll();



      const index =

        engineers.findIndex(

          engineer =>

          String(engineer.id) === String(id)

        );



      if(index === -1){

        return null;

      }



      engineers[index] = {


        ...engineers[index],


        ...data,


        id:
          engineers[index].id,



        updatedAt:
          new Date().toISOString()


      };



      storageService.save(

        this.key,

        engineers

      );



      return engineers[index];



    } catch(error) {


      throw new Error(
        `EngineerRepository update failed: ${error.message}`
      );

    }

  }





  async delete(id) {


    try {


      if(!id){

        return false;

      }



      const engineers =
        await this.getAll();



      const filtered =

        engineers.filter(

          engineer =>

          String(engineer.id) !== String(id)

        );



      const deleted =

        filtered.length !== engineers.length;



      if(deleted){


        storageService.save(

          this.key,

          filtered

        );


      }



      return deleted;



    } catch(error) {


      throw new Error(
        `EngineerRepository delete failed: ${error.message}`
      );

    }

  }





  async exists(id) {


    return Boolean(

      await this.getById(id)

    );


  }





  async count() {


    const engineers =
      await this.getAll();



    return engineers.length;


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
  new EngineerRepository()
);
