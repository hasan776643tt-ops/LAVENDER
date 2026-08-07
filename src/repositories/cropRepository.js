// src/repositories/cropRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class CropRepository {


  constructor() {

    this.key =
      "crops";

  }





  async getAll() {


    return storageService.load(

      this.key,

      []

    );


  }





  async getById(id) {


    if (!id) {


      return null;


    }



    const crops =

      await this.getAll();



    return (

      crops.find(

        crop =>

          String(crop.id) === String(id)

      )

      ??

      null

    );


  }





  async create(cropData) {


    if (!cropData) {


      throw createError(

        "Crop data is required",

        "CROP_DATA_REQUIRED"

      );


    }



    const crops =

      await this.getAll();



    const now =

      new Date().toISOString();



    const crop = {


      id:

        crypto.randomUUID(),


      ...cropData,


      createdAt:

        now,


      updatedAt:

        now


    };



    crops.push(crop);



    await storageService.save(

      this.key,

      crops

    );



    return crop;


  }





  async update(
    id,
    data
  ) {


    if (!id) {


      return null;


    }



    const crops =

      await this.getAll();



    const index =

      crops.findIndex(

        crop =>

          String(crop.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updatedCrop = {


      ...crops[index],


      ...data,


      id:

        crops[index].id,


      createdAt:

        crops[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    crops[index] =

      updatedCrop;



    await storageService.save(

      this.key,

      crops

    );



    return updatedCrop;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const crops =

      await this.getAll();



    const filtered =

      crops.filter(

        crop =>

          String(crop.id) !== String(id)

      );



    const deleted =

      filtered.length !== crops.length;



    if (deleted) {


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id) {


    return Boolean(

      await this.getById(id)

    );


  }





  async count() {


    const crops =

      await this.getAll();



    return crops.length;


  }


}





const cropRepository =

  new CropRepository();



export default Object.freeze(

  cropRepository

);
