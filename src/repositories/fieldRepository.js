// src/repositories/fieldRepository.js

import storageService
  from "../services/storageService.js";


class FieldRepository {


  constructor(){

    this.key =
      "fields";

  }




  getAll(){

    return storageService.load(
      this.key,
      []
    );

  }




  getById(id){

    return this.getAll().find(
      field =>
        field.id === id
    ) || null;

  }




  create(field){

    const fields =
      this.getAll();


    fields.push(
      field
    );


    storageService.save(
      this.key,
      fields
    );


    return field;

  }




  update(
    id,
    data
  ){

    const fields =
      this.getAll();


    const index =
      fields.findIndex(
        field =>
          field.id === id
      );


    if(index === -1){

      return null;

    }


    fields[index] = {

      ...fields[index],

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.key,
      fields
    );


    return fields[index];

  }




  delete(id){

    const fields =
      this.getAll();


    const filtered =
      fields.filter(
        field =>
          field.id !== id
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }




  exists(id){

    return this.getAll().some(
      field =>
        field.id === id
    );

  }




  count(){

    return this.getAll().length;

  }


}


export const fieldRepository =
  new FieldRepository();


export default fieldRepository;
