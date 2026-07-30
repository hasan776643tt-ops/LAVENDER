// src/repositories/farmRepository.js

import storageService from "../services/storageService.js";


class FarmRepository {


  constructor() {

    this.key = "farms";

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


    const farms =
      this.getAll();


    return farms.find(
      farm =>
        String(farm.id) === String(id)
    ) || null;

  }



  create(farmData) {


    const farms =
      this.getAll();


    const farm = {

      id:
        Date.now().toString(),

      ...farmData,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    };


    farms.push(
      farm
    );


    storageService.save(
      this.key,
      farms
    );


    return farm;

  }



  update(id, data) {


    const farms =
      this.getAll();


    const index =
      farms.findIndex(
        farm =>
          String(farm.id) === String(id)
      );



    if (index === -1) {

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



  delete(id) {


    const farms =
      this.getAll();



    const filtered =
      farms.filter(
        farm =>
          String(farm.id) !== String(id)
      );



    const deleted =
      filtered.length !== farms.length;



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
  new FarmRepository()
);
