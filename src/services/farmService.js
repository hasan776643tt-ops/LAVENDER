// src/services/farmService.js


import farmRepository
from "../repositories/farmRepository.js";



class FarmService {



constructor(){

  this.repository =
  farmRepository;

}




async getAll(){

  return await this.repository.getAll();

}




async getById(id){


  if(!id){

    throw new Error(
      "Farm id is required"
    );

  }


  return await this.repository.getById(id);

}




async create(data){


  if(!data){

    throw new Error(
      "Farm data is required"
    );

  }


  return await this.repository.create(data);

}




async update(id,data){


  if(!id){

    throw new Error(
      "Farm id is required"
    );

  }


  if(!data){

    throw new Error(
      "Farm data is required"
    );

  }


  const updatedFarm =
  await this.repository.update(
    id,
    data
  );


  if(!updatedFarm){

    throw new Error(
      "Farm not found"
    );

  }


  return updatedFarm;

}




async delete(id){


  if(!id){

    throw new Error(
      "Farm id is required"
    );

  }


  const deleted =
  await this.repository.delete(id);


  if(!deleted){

    throw new Error(
      "Farm not found"
    );

  }


  return true;

}




async count(){

  return await this.repository.count();

}




async exists(id){

  return await this.repository.exists(id);

}



}



const farmService =
new FarmService();



export default Object.freeze(
  farmService
);
