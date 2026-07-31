// src/controllers/fertilizerController.js

import fertilizerRepository
  from "../repositories/fertilizerRepository.js";

import { fertilizerValidator }
  from "../validators/fertilizerValidator.js";



class FertilizerController {



  constructor() {

    this.repository =
      fertilizerRepository;

  }





  async getAllFertilizers() {

    try {

      return await this.repository.getAll();


    } catch(error) {


      throw new Error(
        `FertilizerController getAllFertilizers failed: ${error.message}`
      );


    }

  }





  async getFertilizerById(id) {

    try {


      if (!id) {

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      const fertilizer =
        await this.repository.getById(id);



      if (!fertilizer) {

        throw new Error(
          "Fertilizer not found"
        );

      }



      return fertilizer;



    } catch(error) {


      throw new Error(
        `FertilizerController getFertilizerById failed: ${error.message}`
      );


    }

  }





  async createFertilizer(data) {

    try {


      this.validateFertilizer(
        data
      );



      return await this.repository.create(
        data
      );



    } catch(error) {


      throw new Error(
        `FertilizerController createFertilizer failed: ${error.message}`
      );


    }

  }





  async updateFertilizer(id,data) {

    try {


      if (!id) {

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      this.validateFertilizer(
        data
      );



      const updated =
        await this.repository.update(
          id,
          data
        );



      if (!updated) {

        throw new Error(
          "Fertilizer not found"
        );

      }



      return updated;



    } catch(error) {


      throw new Error(
        `FertilizerController updateFertilizer failed: ${error.message}`
      );


    }

  }





  async deleteFertilizer(id) {

    try {


      if (!id) {

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      const exists =
        await this.repository.exists(id);



      if (!exists) {

        throw new Error(
          "Fertilizer not found"
        );

      }



      await this.repository.delete(
        id
      );



      return {

        success:true,

        message:
          "Fertilizer deleted successfully"

      };



    } catch(error) {


      throw new Error(
        `FertilizerController deleteFertilizer failed: ${error.message}`
      );


    }

  }





  async countFertilizers() {

    try {

      return await this.repository.count();


    } catch(error) {


      throw new Error(
        `FertilizerController countFertilizers failed: ${error.message}`
      );


    }

  }





  validateFertilizer(data) {


    const result =
      fertilizerValidator.validate(
        data
      );



    if (!result.valid) {

      throw new Error(

        JSON.stringify(
          result.errors
        )

      );

    }



    return true;


  }



}



export default Object.freeze(
  new FertilizerController()
);
