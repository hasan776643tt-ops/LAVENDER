// src/repositories/cropRepository.js

import storageService from "../services/storageService.js";


class CropRepository {


  constructor() {

    this.key = "crops";

  }



  getAll() {

    return storageService.load(
      this.key,
      []
    );

  }





  getById(id) {


    if (!id) {

      return null;

    }


    return this.getAll().find(

      crop =>
        String(crop.id) === String(id)

    ) || null;


  }





  create(cropData) {


    const crops =
      this.getAll();



    const crop = {


      id:
        Date.now().toString(),


      ...cropData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    crops.push(
      crop
    );



    storageService.save(

      this.key,

      crops

    );



    return crop;


  }





  update(id, data) {


    const crops =
      this.getAll();



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





  delete(id) {


    const crops =
      this.getAll();



    const filtered =
      crops.filter(

        crop =>
          String(crop.id) !== String(id)

      );



    const deleted =
      filtered.length !== crops.length;



    if (deleted) {


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  exists(id) {


    return Boolean(

      this.getById(id)

    );


  }





  count() {


    return this.getAll().length;


  }


}



export default Object.freeze(

  new CropRepository()

);
