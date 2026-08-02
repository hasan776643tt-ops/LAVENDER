
// src/repositories/fertilizerRepository.js


import storageService
from "../services/storageService.js";



class FertilizerRepository {



constructor(){

  this.key =
  "fertilizers";

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



  const fertilizers =
  await this.getAll();



  return (
    fertilizers.find(

      fertilizer =>

      String(fertilizer.id)
      ===
      String(id)

    )
    || null
  );


}




async create(data){


  if(!data){

    throw new Error(
      "Fertilizer data is required"
    );

  }



  const fertilizers =
  await this.getAll();



  const fertilizer = {


    id:
    Date.now().toString(),


    ...data,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  fertilizers.push(
    fertilizer
  );



  storageService.save(

    this.key,

    fertilizers

  );



  return fertilizer;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Fertilizer id is required"
    );

  }



  const fertilizers =
  await this.getAll();



  const index =
  fertilizers.findIndex(

    fertilizer =>

    String(fertilizer.id)
    ===
    String(id)

  );



  if(index === -1){

    return null;

  }




  const updated = {


    ...fertilizers[index],


    ...data,


    id:
    fertilizers[index].id,


    updatedAt:
    new Date().toISOString()


  };



  fertilizers[index] =
  updated;



  storageService.save(

    this.key,

    fertilizers

  );



  return updated;


}




async delete(id){


  const fertilizers =
  await this.getAll();



  const filtered =
  fertilizers.filter(

    fertilizer =>

    String(fertilizer.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== fertilizers.length;



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


  const fertilizers =
  await this.getAll();


  return fertilizers.length;


}



}



export default Object.freeze(
  new FertilizerRepository()
);
