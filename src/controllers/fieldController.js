// src/controllers/fieldController.js

import fieldRepository from "../repositories/fieldRepository.js";


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


      const exists =
        await this.repository.exists(id);


      if (!exists) {

        throw new Error(
          "Field not found"
        );

      }


      await this.repository.delete(id);


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

    if (!field) {

      throw new Error(
        "Field data is required"
      );

    }


    if (!field.name?.trim()) {

      throw new Error(
        "Field name is required"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new FieldController()
);
