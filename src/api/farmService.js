// src/services/farmService.js

import farmRepository
  from "../repositories/farmRepository.js";


class FarmService {


  constructor() {

    this.repository =
      farmRepository;

  }



  async getAll() {

    return await this.repository.getAll();

  }



  async getById(id) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }


    return await this.repository.getById(id);

  }



  async create(data) {


    if (!data) {

      throw new Error(
        "Farm data is required"
      );

    }


    return await this.repository.create(data);

  }



  async update(id, data) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }


    if (!data) {

      throw new Error(
        "Farm data is required"
      );

    }


    const result =
      await this.repository.update(
        id,
        data
      );


    if (!result) {

      throw new Error(
        "Farm not found"
      );

    }


    return result;

  }



  async delete(id) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }


    const result =
      await this.repository.delete(id);


    if (!result) {

      throw new Error(
        "Farm not found"
      );

    }


    return true;

  }



  async count() {

    return await this.repository.count();

  }



  async exists(id) {


    if (!id) {

      throw new Error(
        "Farm id is required"
      );

    }


    return await this.repository.exists(id);

  }


}



const farmService =
  new FarmService();



export default Object.freeze(
  farmService
);
