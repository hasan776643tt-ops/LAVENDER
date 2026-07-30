// src/controllers/cropController.js

import cropRepository from "../repositories/cropRepository.js";


class CropController {


  constructor() {

    this.repository = cropRepository;

  }




  async getCrops() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `CropController getCrops failed: ${error.message}`
      );

    }

  }




  async getCropById(id) {

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
        `CropController getCropById failed: ${error.message}`
      );

    }

  }




  async createCrop(cropData) {

    try {

      this.validateCrop(cropData);


      return await this.repository.create(
        cropData
      );


    } catch (error) {

      throw new Error(
        `CropController createCrop failed: ${error.message}`
      );

    }

  }




  async updateCrop(id, cropData) {

    try {

      if (!id) {

        throw new Error(
          "Crop ID is required"
        );

      }


      this.validateCrop(cropData);


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
        `CropController updateCrop failed: ${error.message}`
      );

    }

  }




  async deleteCrop(id) {

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
        `CropController deleteCrop failed: ${error.message}`
      );

    }

  }




  async countCrops() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `CropController countCrops failed: ${error.message}`
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
  new CropController()
);
