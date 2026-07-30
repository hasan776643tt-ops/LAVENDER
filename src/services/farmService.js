// src/services/farmService.js


import farmRepository
  from "../repositories/farmRepository.js";



class FarmService {


  constructor() {

    this.repository =
      farmRepository;

  }





  async getAll() {

    try {

      return await this.repository.getAll();


    } catch (error) {

      throw new Error(
        `FarmService getAll failed: ${error.message}`
      );

    }

  }





  async getById(id) {

    try {

      if (!id) {

        throw new Error(
          "Farm ID is required"
        );

      }


      const farm =
        await this.repository.getById(id);


      if (!farm) {

        throw new Error(
          "Farm not found"
        );

      }


      return farm;


    } catch (error) {

      throw new Error(
        `FarmService getById failed: ${error.message}`
      );

    }

  }





  async create(farmData) {

    try {

      this.validateFarm(
        farmData
      );


      return await this.repository.create(
        farmData
      );


    } catch (error) {

      throw new Error(
        `FarmService create failed: ${error.message}`
      );

    }

  }





  async update(
    id,
    farmData
  ) {

    try {

      if (!id) {

        throw new Error(
          "Farm ID is required"
        );

      }


      const farm =
        await this.repository.update(
          id,
          farmData
        );


      if (!farm) {

        throw new Error(
          "Farm not found"
        );

      }


      return farm;


    } catch (error) {

      throw new Error(
        `FarmService update failed: ${error.message}`
      );

    }

  }





  async delete(id) {

    try {

      if (!id) {

        throw new Error(
          "Farm ID is required"
        );

      }


      const exists =
        await this.repository.exists(id);


      if (!exists) {

        throw new Error(
          "Farm not found"
        );

      }


      await this.repository.delete(id);


      return {

        success: true,

        message:
          "Farm deleted successfully"

      };


    } catch (error) {

      throw new Error(
        `FarmService delete failed: ${error.message}`
      );

    }

  }





  async count() {

    try {

      return await this.repository.count();


    } catch (error) {

      throw new Error(
        `FarmService count failed: ${error.message}`
      );

    }

  }





  validateFarm(farm) {

    if (!farm) {

      throw new Error(
        "Farm data is required"
      );

    }


    if (!farm.name?.trim()) {

      throw new Error(
        "Farm name is required"
      );

    }


    return true;

  }


}





export default Object.freeze(
  new FarmService()
);
