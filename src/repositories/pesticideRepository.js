
// src/repositories/pesticideRepository.js


import storageService
from "../services/storageService.js";



class PesticideRepository {



constructor(){

  this.key =
  "pesticides";

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



  const pesticides =
  await this.getAll();



  return (
    pesticides.find(

      pesticide =>

      String(pesticide.id)
      ===
      String(id)

    )
    || null
  );


}




async create(data){


  if(!data){

    throw new Error(
      "Pesticide data is required"
    );

  }



  const pesticides =
  await this.getAll();



  const pesticide = {


    id:
    Date.now().toString(),


    ...data,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  pesticides.push(
    pesticide
  );



  storageService.save(

    this.key,

    pesticides

  );



  return pesticide;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Pesticide id is required"
    );

  }



  const pesticides =
  await this.getAll();



  const index =
  pesticides.findIndex(

    pesticide =>

    String(pesticide.id)
    ===
    String(id)

  );



  if(index === -1){

    return null;

  }




  const updated = {


    ...pesticides[index],


    ...data,


    id:
    pesticides[index].id,


    updatedAt:
    new Date().toISOString()


  };



  pesticides[index] =
  updated;



  storageService.save(

    this.key,

    pesticides

  );



  return updated;


}




async delete(id){


  const pesticides =
  await this.getAll();



  const filtered =
  pesticides.filter(

    pesticide =>

    String(pesticide.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== pesticides.length;



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


  const pesticides =
  await this.getAll();


  return pesticides.length;


}



}



export default Object.freeze(
  new PesticideRepository()
);
