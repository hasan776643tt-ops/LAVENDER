// src/controllers/diseaseController.js

import diseaseRepository
  from "../repositories/diseaseRepository.js";

import { diseaseValidator }
  from "../validators/diseaseValidator.js";



class DiseaseController {


  constructor() {

    this.repository =
      diseaseRepository;

  }





  async getDiseases() {

    try {

      return await this.repository.getAll();


    } catch(error) {

      throw new Error(
        `DiseaseController getDiseases failed: ${error.message}`
      );

    }

  }





  async getDiseaseById(id) {

    try {


      if (!id) {

        throw new Error(
          "Disease ID is required"
        );

      }



      const disease =
        await this.repository.getById(id);



      if (!disease) {

        throw new Error(
          "Disease not found"
        );

      }



      return disease;



    } catch(error) {

      throw new Error(
        `DiseaseController getDiseaseById failed: ${error.message}`
      );

    }

  }





  async createDisease(data) {

    try {


      this.validateDisease(data);



      return await this.repository.create(
        data
      );



    } catch(error) {

      throw new Error(
        `DiseaseController createDisease failed: ${error.message}`
      );

    }

  }





  async updateDisease(
    id,
    data
  ) {

    try {


      if (!id) {

        throw new Error(
          "Disease ID is required"
        );

      }



      this.validateDisease(data);



      const disease =
        await this.repository.update(
          id,
          data
        );



      if (!disease) {

        throw new Error(
          "Disease not found"
        );

      }



      return disease;



    } catch(error) {

      throw new Error(
        `DiseaseController updateDisease failed: ${error.message}`
      );

    }

  }





  async deleteDisease(id) {

    try {


      if (!id) {

        throw new Error(
          "Disease ID is required"
        );

      }



      const exists =
        await this.repository.exists(id);



      if (!exists) {

        throw new Error(
          "Disease not found"
        );

      }



      await this.repository.delete(id);



      return {

        success:true,

        message:
          "Disease deleted successfully"

      };



    } catch(error) {

      throw new Error(
        `DiseaseController deleteDisease failed: ${error.message}`
      );

    }

  }





  async countDiseases() {

    try {

      return await this.repository.count();


    } catch(error) {

      throw new Error(
        `DiseaseController countDiseases failed: ${error.message}`
      );

    }

  }





  async searchDiseases(keyword) {

    try {


      const diseases =
        await this.repository.getAll();



      if (!keyword) {

        return diseases;

      }



      const search =
        keyword.toLowerCase();



      return diseases.filter(
        disease =>

          disease.name
          ?.toLowerCase()
          .includes(search)

          ||

          disease.crop
          ?.toLowerCase()
          .includes(search)

          ||

          disease.category
          ?.toLowerCase()
          .includes(search)

          ||

          disease.symptoms
          ?.toLowerCase()
          .includes(search)

      );



    } catch(error) {

      throw new Error(
        `DiseaseController searchDiseases failed: ${error.message}`
      );

    }

  }





  validateDisease(data) {


    const result =
      diseaseValidator.validate(
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
  new DiseaseController()
);
