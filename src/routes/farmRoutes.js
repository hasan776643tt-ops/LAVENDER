// src/routes/farmRoutes.js

import farmController from "../controllers/farmController.js";


class FarmRoutes {

  constructor() {
    this.controller = farmController;
  }


  async getFarms() {
    try {
      return await this.controller.getFarms();

    } catch (error) {
      throw new Error(
        `Farm routes get failed: ${error.message}`
      );
    }
  }


  async getFarmById(id) {
    try {
      return await this.controller.getFarmById(id);

    } catch (error) {
      throw new Error(
        `Farm routes get by id failed: ${error.message}`
      );
    }
  }


  async createFarm(farmData) {
    try {
      return await this.controller.createFarm(farmData);

    } catch (error) {
      throw new Error(
        `Farm routes create failed: ${error.message}`
      );
    }
  }


  async updateFarm(id, data) {
    try {
      return await this.controller.updateFarm(id, data);

    } catch (error) {
      throw new Error(
        `Farm routes update failed: ${error.message}`
      );
    }
  }


  async deleteFarm(id) {
    try {
      return await this.controller.deleteFarm(id);

    } catch (error) {
      throw new Error(
        `Farm routes delete failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "FarmRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new FarmRoutes()
);
