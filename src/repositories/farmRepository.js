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

    const farms =
      this.getAll();


    return farms.find(
      farm =>
        farm.id === id
    ) || null;

  }


  create(farm) {

    const farms =
      this.getAll();


    farms.push(farm);


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
          farm.id === id
      );


    if (index === -1) {

      return null;

    }


    farms[index] = {

      ...farms[index],

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.key,
      farms
    );


    return farms[index];

  }


  delete(id) {

    const farms =
      this.getAll();


    const filtered =
      farms.filter(
        farm =>
          farm.id !== id
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }


}


export default Object.freeze(
  new FarmRepository()
);
