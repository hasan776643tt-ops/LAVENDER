// src/services/irrigationService.js


import irrigationRepository
  from "../repositories/irrigationRepository.js";



class IrrigationService {



  constructor() {

    this.repository =
      irrigationRepository;

  }





  async getAll() {

    try {

      return await this.repository.getAll();


    } catch(error) {


      throw new Error(
        `IrrigationService getAll failed: ${error.message}`
      );


    }

  }





  async getById(id) {

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
        `IrrigationService getById failed: ${error.message}`
      );


    }

  }





  async create(irrigationData) {

    try {


      this.validateIrrigation(
        irrigationData
      );



      return await this.repository.create(
        irrigationData
      );



    } catch(error) {


      throw new Error(
        `IrrigationService create failed: ${error.message}`
      );


    }

  }





  async update(
    id,
    irrigationData
  ) {

    try {


      if (!id) {

        throw new Error(
          "Irrigation ID is required"
        );

      }



      this.validateIrrigation(
        irrigationData
      );



      const irrigation =
        await this.repository.update(
          id,
          irrigationData
        );



      if (!irrigation) {

        throw new Error(
          "Irrigation not found"
        );

      }



      return irrigation;



    } catch(error) {


      throw new Error(
        `IrrigationService update failed: ${error.message}`
      );


    }

  }





  async delete(id) {

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
        `IrrigationService delete failed: ${error.message}`
      );


    }

  }





  async count() {

    try {


      return await this.repository.count();



    } catch(error) {


      throw new Error(
        `IrrigationService count failed: ${error.message}`
      );


    }

  }





  validateIrrigation(irrigation) {


    if (!irrigation) {

      throw new Error(
        "Irrigation data is required"
      );

    }



    if (
      !irrigation.type?.trim()
    ) {

      throw new Error(
        "Irrigation type is required"
      );

    }



    if (
      irrigation.quantity != null &&
      Number(irrigation.quantity) < 0
    ) {

      throw new Error(
        "Invalid irrigation quantity"
      );

    }



    return true;


  }



}



export default Object.freeze(

  new IrrigationService()

);
