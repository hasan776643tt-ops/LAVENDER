
// src/repositories/cropRepository.js


import storageService
from "../services/storageService.js";



class CropRepository {



constructor(){

  this.key =
  "crops";

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


  const crops =
  await this.getAll();



  return (
    crops.find(
      crop =>
      String(crop.id) === String(id)
    )
    || null
  );


}




async create(cropData){


  if(!cropData){

    throw new Error(
      "Crop data is required"
    );

  }



  const crops =
  await this.getAll();



  const crop = {


    id:
    Date.now().toString(),


    ...cropData,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  crops.push(crop);



  storageService.save(

    this.key,

    crops

  );



  return crop;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Crop id is required"
    );

  }



  const crops =
  await this.getAll();



  const index =
  crops.findIndex(

    crop =>
    String(crop.id) === String(id)

  );



  if(index === -1){

    return null;

  }




  const updatedCrop = {


    ...crops[index],


    ...data,


    id:
    crops[index].id,


    updatedAt:
    new Date().toISOString()


  };



  crops[index] =
  updatedCrop;



  storageService.save(

    this.key,

    crops

  );



  return updatedCrop;


}




async delete(id){


  const crops =
  await this.getAll();



  const filtered =
  crops.filter(

    crop =>
    String(crop.id) !== String(id)

  );



  const deleted =
  filtered.length !== crops.length;



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


  const crops =
  await this.getAll();


  return crops.length;


}



}




export default Object.freeze(
  new CropRepository()
);
