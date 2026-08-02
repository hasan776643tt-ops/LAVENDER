// src/repositories/farmRepository.js


import storageService
from "../services/storageService.js";



class FarmRepository {



constructor(){

  this.key =
  "farms";

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


  const farms =
  await this.getAll();


  return (
    farms.find(
      farm =>
      String(farm.id) === String(id)
    )
    || null
  );

}




async create(farmData){


  const farms =
  await this.getAll();


  const farm = {

    id:
    Date.now().toString(),

    ...farmData,

    createdAt:
    new Date().toISOString(),

    updatedAt:
    new Date().toISOString()

  };


  farms.push(farm);


  storageService.save(
    this.key,
    farms
  );


  return farm;

}




async update(id,data){


  const farms =
  await this.getAll();


  const index =
  farms.findIndex(
    farm =>
    String(farm.id) === String(id)
  );


  if(index === -1){

    return null;

  }



  const updatedFarm = {

    ...farms[index],

    ...data,

    id:
    farms[index].id,

    updatedAt:
    new Date().toISOString()

  };



  farms[index] =
  updatedFarm;



  storageService.save(
    this.key,
    farms
  );


  return updatedFarm;

}




async delete(id){


  const farms =
  await this.getAll();



  const filtered =
  farms.filter(
    farm =>
    String(farm.id) !== String(id)
  );



  const deleted =
  filtered.length !== farms.length;



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

  const farms =
  await this.getAll();


  return farms.length;

}



}



export default Object.freeze(
  new FarmRepository()
);
