// src/controllers/irrigationController.js

import irrigationRepository
  from "../repositories/irrigationRepository.js";

import { irrigationValidator }
  from "../validators/irrigationValidator.js";



class IrrigationController {



  constructor() {

    this.repository =
      irrigationRepository;

  }





  async getIrrigations() {

    try {

      return await this.repository.getAll();


    } catch(error) {

      throw new Error(
        `IrrigationController getIrrigations failed: ${error.message}`
      );

    }

  }





  async getIrrigationById(id) {

    try {


      if (!id) {

        throw new Error(
          "Irrigation ID is required"
        );

      }



      const irrigation =
        await this.repository.getById(id);



      if (!irrigation) {

        throw new Error(
          "Irrigation not found"
        );

      }



      return irrigation;



    } catch(error) {


      throw new Error(
        `IrrigationController getIrrigationById failed: ${error.message}`
      );


    }

  }





  async createIrrigation(data) {

    try {


      this.validateIrrigation(
        data
      );


      return await this.repository.create(
        data
      );



    } catch(error) {


      throw new Error(
        `IrrigationController createIrrigation failed: ${error.message}`
      );


    }

  }





  async updateIrrigation(id,data) {

    try {


      if (!id) {

        throw new Error(
          "Irrigation ID is required"
        );

      }



      this.validateIrrigation(
        data
      );



      const updated =
        await this.repository.update(
          id,
          data
        );



      if (!updated) {

        throw new Error(
          "Irrigation not found"
        );

      }



      return updated;



    } catch(error) {


      throw new Error(
        `IrrigationController updateIrrigation failed: ${error.message}`
      );


    }

  }





  async deleteIrrigation(id) {

    try {


      if (!id) {

        throw new Error(
          "Irrigation ID is required"
        );

      }



      const exists =
        await this.repository.exists(id);



      if (!exists) {

        throw new Error(
          "Irrigation not found"
        );

      }



      await this.repository.delete(
        id
      );



      return {

        success:true,

        message:
          "Irrigation deleted successfully"

      };



    } catch(error) {


      throw new Error(
        `IrrigationController deleteIrrigation failed: ${error.message}`
      );


    }

  }





  async countIrrigations() {

    try {


      return await this.repository.count();


    } catch(error) {


      throw new Error(
        `IrrigationController countIrrigations failed: ${error.message}`
      );


    }

  }





  validateIrrigation(data) {


    const result =
      irrigationValidator.validate(
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
  new IrrigationController()
);
