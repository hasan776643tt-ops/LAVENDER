// src/controllers/fieldController.js

import fieldRepository from "../repositories/fieldRepository.js";
import { fieldValidator } from "../validators/fieldValidator.js";


class FieldController {


  constructor() {

    this.repository = fieldRepository;

  }



  async getFields() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `FieldController getFields failed: ${error.message}`
      );

    }

  }




  async getFieldById(id) {

    try {

      if (!id) {

        throw new Error(
          "Field ID is required"
        );

      }


      const field =
        await this.repository.getById(id);



      if (!field) {

        throw new Error(
          "Field not found"
        );

      }


      return field;


    } catch (error) {

      throw new Error(
        `FieldController getFieldById failed: ${error.message}`
      );

    }

  }




  async createField(fieldData) {

    try {


      this.validateField(fieldData);



      return await this.repository.create(
        fieldData
      );


    } catch (error) {

      throw new Error(
        `FieldController createField failed: ${error.message}`
      );

    }

  }





  async updateField(id, fieldData) {

    try {


      if (!id) {

        throw new Error(
          "Field ID is required"
        );

      }



      this.validateField(fieldData);



      const field =
        await this.repository.update(
          id,
          fieldData
        );



      if (!field) {

        throw new Error(
          "Field not found"
        );

      }



      return field;



    } catch (error) {

      throw new Error(
        `FieldController updateField failed: ${error.message}`
      );

    }

  }





  async deleteField(id) {

    try {


      if (!id) {

        throw new Error(
          "Field ID is required"
        );

      }



      const deleted =
        await this.repository.delete(id);



      if (!deleted) {

        throw new Error(
          "Field not found"
        );

      }



      return {

        success: true,

        message:
          "Field deleted successfully"

      };



    } catch (error) {

      throw new Error(
        `FieldController deleteField failed: ${error.message}`
      );

    }

  }





  async countFields() {

    try {

      return await this.repository.count();


    } catch (error) {

      throw new Error(
        `FieldController countFields failed: ${error.message}`
      );

    }

  }





  validateField(field) {


    const result =
      fieldValidator.validate(field);



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
  new FieldController()
);
