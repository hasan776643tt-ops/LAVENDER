
// src/repositories/harvestRepository.js


import storageService
from "../services/storageService.js";



class HarvestRepository {



constructor(){

  this.key =
  "harvests";

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



  const harvests =
  await this.getAll();



  return (
    harvests.find(

      harvest =>

      String(harvest.id)
      ===
      String(id)

    )
    || null
  );


}




async create(harvestData){


  if(!harvestData){

    throw new Error(
      "Harvest data is required"
    );

  }



  const harvests =
  await this.getAll();



  const harvest = {


    id:
    Date.now().toString(),


    ...harvestData,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  harvests.push(
    harvest
  );



  storageService.save(

    this.key,

    harvests

  );



  return harvest;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Harvest id is required"
    );

  }



  const harvests =
  await this.getAll();



  const index =
  harvests.findIndex(

    harvest =>

    String(harvest.id)
    ===
    String(id)

  );



  if(index === -1){

    return null;

  }




  const updatedHarvest = {


    ...harvests[index],


    ...data,


    id:
    harvests[index].id,


    updatedAt:
    new Date().toISOString()


  };



  harvests[index] =
  updatedHarvest;



  storageService.save(

    this.key,

    harvests

  );



  return updatedHarvest;


}




async delete(id){


  const harvests =
  await this.getAll();



  const filtered =
  harvests.filter(

    harvest =>

    String(harvest.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== harvests.length;



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


  const harvests =
  await this.getAll();


  return harvests.length;


}



}



export default Object.freeze(
  new HarvestRepository()
);
