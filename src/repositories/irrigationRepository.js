
// src/repositories/irrigationRepository.js


import storageService
from "../services/storageService.js";



class IrrigationRepository {



constructor(){

  this.key =
  "irrigations";

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



  const irrigations =
  await this.getAll();



  return (
    irrigations.find(

      irrigation =>
      String(irrigation.id)
      ===
      String(id)

    )
    || null
  );


}




async create(data){


  if(!data){

    throw new Error(
      "Irrigation data is required"
    );

  }



  const irrigations =
  await this.getAll();



  const irrigation = {


    id:
    Date.now().toString(),


    ...data,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  irrigations.push(
    irrigation
  );



  storageService.save(

    this.key,

    irrigations

  );



  return irrigation;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Irrigation id is required"
    );

  }



  const irrigations =
  await this.getAll();



  const index =
  irrigations.findIndex(

    irrigation =>

    String(irrigation.id)
    ===
    String(id)

  );



  if(index === -1){

    return null;

  }




  const updated = {


    ...irrigations[index],


    ...data,


    id:
    irrigations[index].id,


    updatedAt:
    new Date().toISOString()


  };



  irrigations[index] =
  updated;



  storageService.save(

    this.key,

    irrigations

  );



  return updated;


}




async delete(id){


  const irrigations =
  await this.getAll();



  const filtered =
  irrigations.filter(

    irrigation =>

    String(irrigation.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== irrigations.length;



  if(deleted){


    storageService.save(

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


  const irrigations =
  await this.getAll();


  return irrigations.length;


}



}



export default Object.freeze(
  new IrrigationRepository()
);
