// src/routes/engineerRoutes.js

import engineerController from "../controllers/engineerController.js";


class EngineerRoutes {

  constructor() {
    this.controller = engineerController;
  }


  async getAll() {
    try {
      return await this.controller.getAllEngineers();

    } catch (error) {
      throw new Error(
        `Engineer routes get failed: ${error.message}`
      );
    }
  }


  async getById(engineerId) {
    try {
      return await this.controller.getEngineerById(engineerId);

    } catch (error) {
      throw new Error(
        `Engineer routes get by id failed: ${error.message}`
      );
    }
  }


  async create(engineerData) {
    try {
      return await this.controller.createEngineer(engineerData);

    } catch (error) {
      throw new Error(
        `Engineer routes create failed: ${error.message}`
      );
    }
  }


  async update(engineerId, engineerData) {
    try {
      return await this.controller.updateEngineer(
        engineerId,
        engineerData
      );

    } catch (error) {
      throw new Error(
        `Engineer routes update failed: ${error.message}`
      );
    }
  }


  async delete(engineerId) {
    try {
      return await this.controller.deleteEngineer(engineerId);

    } catch (error) {
      throw new Error(
        `Engineer routes delete failed: ${error.message}`
      );
    }
  }


  async search(keyword) {
    try {
      return await this.controller.searchEngineers(keyword);

    } catch (error) {
      throw new Error(
        `Engineer search failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "EngineerRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new EngineerRoutes()
);
