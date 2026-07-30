// src/routes/userRoutes.js

import userController from "../controllers/userController.js";


class UserRoutes {

  constructor() {
    this.controller = userController;
  }


  async getUsers() {
    try {
      return await this.controller.getUsers();

    } catch (error) {
      throw new Error(
        `User routes get failed: ${error.message}`
      );
    }
  }


  async getUserById(id) {
    try {
      return await this.controller.getUserById(id);

    } catch (error) {
      throw new Error(
        `User routes get by id failed: ${error.message}`
      );
    }
  }


  async createUser(userData) {
    try {
      return await this.controller.createUser(userData);

    } catch (error) {
      throw new Error(
        `User routes create failed: ${error.message}`
      );
    }
  }


  async updateUser(id, data) {
    try {
      return await this.controller.updateUser(id, data);

    } catch (error) {
      throw new Error(
        `User routes update failed: ${error.message}`
      );
    }
  }


  async deleteUser(id) {
    try {
      return await this.controller.deleteUser(id);

    } catch (error) {
      throw new Error(
        `User routes delete failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "UserRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new UserRoutes()
);
