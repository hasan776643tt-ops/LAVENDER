 // src/services/farmService.js

import farmRepository
  from "../repositories/farmRepository.js";



class FarmService {


  constructor() {

    this.repository =
      farmRepository;

  }





  getAll() {

    return this.repository.getAll();

  }





  getById(id) {


    if (!id) {

      return null;

    }


    return this.repository.getById(id);

  }





  create(data) {


    if (!data) {

      throw new Error(
        "Farm data is required"
      );

    }



    return this.repository.create(data);

  }





  update(id, data) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }



    const updatedFarm =
      this.repository.update(
        id,
        data
      );



    if (!updatedFarm) {

      throw new Error(
        "Farm not found"
      );

    }



    return updatedFarm;

  }





  delete(id) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }



    const deleted =
      this.repository.delete(id);



    if (!deleted) {

      throw new Error(
        "Farm not found"
      );

    }



    return true;

  }





  count() {

    return this.repository.count();

  }





  exists(id) {

    return this.repository.exists(id);

  }





}



const farmService =
  new FarmService();



export default Object.freeze(
  farmService
);
