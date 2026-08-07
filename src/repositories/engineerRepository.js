// src/repositories/engineerRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class EngineerRepository {


  constructor(){

    this.key =
      "engineers";

  }





  async getAll(){

    return storageService.load(

      this.key,

      []

    );

  }





  async getById(id){


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

      ??

      null

    );


  }





  async create(data){


    this.validate(data);



    const engineers =

      await this.getAll();



    const now =

      new Date().toISOString();



    const engineer = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    engineers.push(

      engineer

    );



    await storageService.save(

      this.key,

      engineers

    );



    return engineer;


  }





  async update(
    id,
    data
  ){


    if(!id){

      throw createError(

        "Engineer id is required",

        "ENGINEER_ID_REQUIRED"

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



    const updated = {


      ...engineers[index],


      ...data,


      id:

        engineers[index].id,


      createdAt:

        engineers[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    engineers[index] =

      updated;



    await storageService.save(

      this.key,

      engineers

    );



    return updated;


  }





  async delete(id){


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


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id){


    return Boolean(

      await this.getById(id)

    );


  }





  async count(){


    const engineers =

      await this.getAll();



    return engineers.length;


  }





  validate(data){


    if(

      !data ||

      typeof data !== "object"

    ){


      throw createError(

        "Engineer data is required",

        "ENGINEER_DATA_REQUIRED"

      );

    }



    if(

      !data.name ||

      !data.name.trim()

    ){


      throw createError(

        "Engineer name is required",

        "ENGINEER_NAME_REQUIRED"

      );

    }



    return true;


  }


}





const engineerRepository =

  new EngineerRepository();



export default Object.freeze(

  engineerRepository

);
