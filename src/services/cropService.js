// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";


class CropService {


  constructor() {

    this.repository =
      cropRepository;

  }




  async getAll() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `CropService getAll failed: ${error.message}`
      );

    }

  }




  async getById(id) {

    try {

      if (!id) {

        throw new Error(
          "Crop ID is required"
        );

      }


      const crop =
        await this.repository.getById(id);


      if (!crop) {

        throw new Error(
          "Crop not found"
        );

      }


      return crop;

    } catch (error) {

      throw new Error(
        `CropService getById failed: ${error.message}`
      );

    }

  }




  async create(cropData) {

    try {

      this.validateCrop(
        cropData
      );


      return await this.repository.create(
        cropData
      );

    } catch (error) {

      throw new Error(
        `CropService create failed: ${error.message}`
      );

    }

  }




  async update(
    id,
    cropData
  ) {

    try {

      if (!id) {

        throw new Error(
          "Crop ID is required"
        );

      }


      const crop =
        await this.repository.update(
          id,
          cropData
        );


      if (!crop) {

        throw new Error(
          "Crop not found"
        );

      }


      return crop;

    } catch (error) {

      throw new Error(
        `CropService update failed: ${error.message}`
      );

    }

  }




  async delete(id) {

    try {

      if (!id) {

        throw new Error(
          "Crop ID is required"
        );

      }


      const exists =
        await this.repository.exists(id);


      if (!exists) {

        throw new Error(
          "Crop not found"
        );

      }


      await this.repository.delete(id);


      return {

        success: true,

        message:
          "Crop deleted successfully"

      };

    } catch (error) {

      throw new Error(
        `CropService delete failed: ${error.message}`
      );

    }

  }




  async count() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `CropService count failed: ${error.message}`
      );

    }

  }




  validateCrop(crop) {

    if (!crop) {

      throw new Error(
        "Crop data is required"
      );

    }


    if (!crop.name?.trim()) {

      throw new Error(
        "Crop name is required"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new CropService()
);
