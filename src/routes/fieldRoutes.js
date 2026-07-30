// src/routes/fieldRoutes.js

import fieldController from "../controllers/fieldController.js";


class FieldRoutes {

  constructor() {
    this.controller = fieldController;
  }


  async getFields() {
    try {
      return await this.controller.getFields();

    } catch (error) {
      throw new Error(
        `Field routes get failed: ${error.message}`
      );
    }
  }


  async getFieldById(id) {
    try {
      return await this.controller.getFieldById(id);

    } catch (error) {
      throw new Error(
        `Field routes get by id failed: ${error.message}`
      );
    }
  }


  async createField(fieldData) {
    try {
      return await this.controller.createField(fieldData);

    } catch (error) {
      throw new Error(
        `Field routes create failed: ${error.message}`
      );
    }
  }


  async updateField(id, data) {
    try {
      return await this.controller.updateField(id, data);

    } catch (error) {
      throw new Error(
        `Field routes update failed: ${error.message}`
      );
    }
  }


  async deleteField(id) {
    try {
      return await this.controller.deleteField(id);

    } catch (error) {
      throw new Error(
        `Field routes delete failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "FieldRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new FieldRoutes()
);
