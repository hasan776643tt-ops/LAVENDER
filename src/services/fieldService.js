// src/services/fieldService.js

import fieldRepository
  from "../repositories/fieldRepository.js";


class FieldService {


  constructor() {

    this.repository =
      fieldRepository;

  }




  async getAll() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `FieldService getAll failed: ${error.message}`
      );

    }

  }




  async getById(id) {

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
        `FieldService getById failed: ${error.message}`
      );

    }

  }




  async create(fieldData) {

    try {

      this.validateField(
        fieldData
      );


      return await this.repository.create(
        fieldData
      );

    } catch (error) {

      throw new Error(
        `FieldService create failed: ${error.message}`
      );

    }

  }




  async update(
    id,
    fieldData
  ) {

    try {

      if (!id) {

        throw new Error(
          "Field ID is required"
        );

      }


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
        `FieldService update failed: ${error.message}`
      );

    }

  }




  async delete(id) {

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
        `FieldService delete failed: ${error.message}`
      );

    }

  }




  async count() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `FieldService count failed: ${error.message}`
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
  new FieldService()
);
