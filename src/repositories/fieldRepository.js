// src/repositories/fieldRepository.js


import storageService
from "../services/storageService.js";



class FieldRepository {



constructor(){

  this.key =
  "fields";

}




async getAll(){

  try{

    return storageService.load(
      this.key,
      []
    );

  }catch(error){

    throw new Error(
      `FieldRepository getAll failed: ${error.message}`
    );

  }

}




async getById(id){


  try{


    if(!id){

      return null;

    }


    const fields =
    await this.getAll();



    return (
      fields.find(
        field =>
        String(field.id) === String(id)
      )
      || null
    );


  }catch(error){


    throw new Error(
      `FieldRepository getById failed: ${error.message}`
    );


  }


}




async create(fieldData){


  try{


    this.validate(fieldData);



    const fields =
    await this.getAll();



    const field = {


      id:
      Date.now().toString(),


      ...fieldData,


      createdAt:
      new Date().toISOString(),


      updatedAt:
      new Date().toISOString()


    };



    fields.push(field);



    storageService.save(

      this.key,

      fields

    );



    return field;



  }catch(error){


    throw new Error(
      `FieldRepository create failed: ${error.message}`
    );


  }


}




async update(id,data){


  try{


    if(!id){

      throw new Error(
        "Field ID is required"
      );

    }



    this.validate(data);



    const fields =
    await this.getAll();



    const index =
    fields.findIndex(

      field =>
      String(field.id) === String(id)

    );



    if(index === -1){

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



  }catch(error){


    throw new Error(
      `FieldRepository update failed: ${error.message}`
    );


  }


}




async delete(id){


  try{


    if(!id){

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



    if(deleted){


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;



  }catch(error){


    throw new Error(
      `FieldRepository delete failed: ${error.message}`
    );


  }


}




async exists(id){


  return Boolean(

    await this.getById(id)

  );


}




async count(){


  const fields =
  await this.getAll();


  return fields.length;


}




validate(field){


  if(!field){

    throw new Error(
      "Field data is required"
    );

  }



  if(
    !field.name ||
    !field.name.trim()
  ){

    throw new Error(
      "Field name is required"
    );

  }



  return true;


}



}




export default Object.freeze(
  new FieldRepository()
);
