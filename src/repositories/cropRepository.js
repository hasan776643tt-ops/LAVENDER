// src/repositories/cropRepository.js

import storageService
  from "../services/storageService.js";


class CropRepository {


  constructor(){

    this.key =
      "crops";

  }




  getAll(){

    return storageService.load(
      this.key,
      []
    );

  }




  getById(id){

    return this.getAll().find(
      crop =>
        crop.id === id
    ) || null;

  }




  create(crop){

    const crops =
      this.getAll();


    crops.push(
      crop
    );


    storageService.save(
      this.key,
      crops
    );


    return crop;

  }




  update(
    id,
    data
  ){

    const crops =
      this.getAll();


    const index =
      crops.findIndex(
        crop =>
          crop.id === id
      );


    if(index === -1){

      return null;

    }


    crops[index] = {

      ...crops[index],

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.key,
      crops
    );


    return crops[index];

  }




  delete(id){

    const crops =
      this.getAll();


    const filtered =
      crops.filter(
        crop =>
          crop.id !== id
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }




  exists(id){

    return this.getAll().some(
      crop =>
        crop.id === id
    );

  }




  count(){

    return this.getAll().length;

  }


}


export const cropRepository =
  new CropRepository();


export default cropRepository;
