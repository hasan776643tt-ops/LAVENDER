// src/repositories/fieldRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class FieldRepository {


  constructor() {

    this.key =
      "fields";

  }





  async getAll() {


    return storageService.load(

      this.key,

      []

    );


  }





  async getById(id) {


    if (!id) {


      return null;


    }



    const fields =

      await this.getAll();



    return (

      fields.find(

        field =>

          String(field.id) === String(id)

      )

      ??

      null

    );


  }





  async create(fieldData) {


    if (!fieldData) {


      throw createError(

        "Field data is required",

        "FIELD_DATA_REQUIRED"

      );


    }



    const fields =

      await this.getAll();



    const now =

      new Date().toISOString();



    const field = {


      id:

        crypto.randomUUID(),


      ...fieldData,


      createdAt:

        now,


      updatedAt:

        now


    };



    fields.push(field);



    await storageService.save(

      this.key,

      fields

    );



    return field;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const fields =

      await this.getAll();



    const index =

      fields.findIndex(

        field =>

          String(field.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updatedField = {


      ...fields[index],


      ...data,


      id:

        fields[index].id,


      createdAt:

        fields[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    fields[index] =

      updatedField;



    await storageService.save(

      this.key,

      fields

    );



    return updatedField;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const fields =

      await this.getAll();



    const filtered =

      fields.filter(

        field =>

          String(field.id) !== String(id)

      );



    const deleted =

      filtered.length !== fields.length;



    if (deleted) {


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id) {


    return Boolean(

      await this.getById(id)

    );


  }





  async count() {


    const fields =

      await this.getAll();



    return fields.length;


  }


}





const fieldRepository =

  new FieldRepository();



export default Object.freeze(

  fieldRepository

);
