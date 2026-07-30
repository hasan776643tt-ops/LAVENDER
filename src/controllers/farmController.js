// src/controllers/farmController.js

import farmRepository from "../repositories/farmRepository.js";
import { farmValidator } from "../validators/farmValidator.js";


class FarmController {


  constructor() {

    this.repository = farmRepository;

  }




  async getFarms() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `FarmController getFarms failed: ${error.message}`
      );

    }

  }




  async getFarmById(id) {

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
        `FarmController getFarmById failed: ${error.message}`
      );

    }

  }




  async createFarm(farmData) {

    try {

      this.validateFarm(farmData);


      return await this.repository.create(
        farmData
      );


    } catch (error) {

      throw new Error(
        `FarmController createFarm failed: ${error.message}`
      );

    }

  }




  async updateFarm(id, farmData) {

    try {

      if (!id) {

        throw new Error(
          "Farm ID is required"
        );

      }


      this.validateFarm(farmData);


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
        `FarmController updateFarm failed: ${error.message}`
      );

    }

  }




  async deleteFarm(id) {

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
        `FarmController deleteFarm failed: ${error.message}`
      );

    }

  }




  async countFarms() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `FarmController countFarms failed: ${error.message}`
      );

    }

  }




  validateFarm(farm) {

    const result =
      farmValidator.validate(farm);


    if (!result.valid) {

      throw new Error(
        JSON.stringify(result.errors)
      );

    }


    return true;

  }


}


export default Object.freeze(
  new FarmController()
);
