// src/repositories/fieldRepository.js

import storageService from "../services/storageService.js";


class FieldRepository {


  constructor() {

    this.key = "fields";

  }



  getAll() {

    return storageService.load(
      this.key,
      []
    );

  }




  getById(id) {


    if (!id) {

      return null;

    }


    return this.getAll().find(

      field =>
        String(field.id) === String(id)

    ) || null;


  }




  create(fieldData) {


    const fields =
      this.getAll();



    const field = {


      id:
        Date.now().toString(),


      ...fieldData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    fields.push(
      field
    );



    storageService.save(

      this.key,

      fields

    );



    return field;


  }




  update(id, data) {


    const fields =
      this.getAll();



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


      updatedAt:
        new Date().toISOString()


    };



    fields[index] =
      updatedField;



    storageService.save(

      this.key,

      fields

    );



    return updatedField;


  }




  delete(id) {


    const fields =
      this.getAll();



    const filtered =
      fields.filter(

        field =>
          String(field.id) !== String(id)

      );



    const deleted =
      filtered.length !== fields.length;



    if (deleted) {


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }




  exists(id) {


    return Boolean(

      this.getById(id)

    );


  }




  count() {


    return this.getAll().length;


  }


}



export default Object.freeze(

  new FieldRepository()

);
