// src/routes/cropRoutes.js

import cropController from "../controllers/cropController.js";


class CropRoutes {

  constructor() {
    this.controller = cropController;
  }


  async getCrops() {
    try {
      return await this.controller.getCrops();

    } catch (error) {
      throw new Error(
        `Crop routes get failed: ${error.message}`
      );
    }
  }


  async getCropById(id) {
    try {
      return await this.controller.getCropById(id);

    } catch (error) {
      throw new Error(
        `Crop routes get by id failed: ${error.message}`
      );
    }
  }


  async createCrop(cropData) {
    try {
      return await this.controller.createCrop(cropData);

    } catch (error) {
      throw new Error(
        `Crop routes create failed: ${error.message}`
      );
    }
  }


  async updateCrop(id, data) {
    try {
      return await this.controller.updateCrop(id, data);

    } catch (error) {
      throw new Error(
        `Crop routes update failed: ${error.message}`
      );
    }
  }


  async deleteCrop(id) {
    try {
      return await this.controller.deleteCrop(id);

    } catch (error) {
      throw new Error(
        `Crop routes delete failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "CropRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new CropRoutes()
);
