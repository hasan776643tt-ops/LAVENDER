// src/routes/authRoutes.js

import userController from "../controllers/userController.js";


class AuthRoutes {

  constructor() {
    this.controller = userController;
  }


  async login(credentials) {
    try {
      return await this.controller.login(credentials);

    } catch (error) {
      throw new Error(
        `Auth login failed: ${error.message}`
      );
    }
  }


  async register(userData) {
    try {
      return await this.controller.register(userData);

    } catch (error) {
      throw new Error(
        `Auth register failed: ${error.message}`
      );
    }
  }


  async logout() {
    try {
      return await this.controller.logout();

    } catch (error) {
      throw new Error(
        `Auth logout failed: ${error.message}`
      );
    }
  }


  async updateProfile(userData) {
    try {
      return await this.controller.updateProfile(userData);

    } catch (error) {
      throw new Error(
        `Profile update failed: ${error.message}`
      );
    }
  }


  async changePassword(passwordData) {
    try {
      return await this.controller.changePassword(passwordData);

    } catch (error) {
      throw new Error(
        `Password change failed: ${error.message}`
      );
    }
  }


  async forgotPassword(email) {
    try {
      return await this.controller.forgotPassword(email);

    } catch (error) {
      throw new Error(
        `Password reset failed: ${error.message}`
      );
    }
  }


  async isAuthenticated() {
    try {
      return await this.controller.isAuthenticated();

    } catch (error) {
      throw new Error(
        `Authentication check failed: ${error.message}`
      );
    }
  }


  async getCurrentUser() {
    try {
      return await this.controller.getCurrentUser();

    } catch (error) {
      throw new Error(
        `Get current user failed: ${error.message}`
      );
    }
  }


  health() {
    return {
      success: true,
      module: "AuthRoutes",
      version: "1.0.0",
      status: "Ready",
      timestamp: new Date().toISOString()
    };
  }

}


export default Object.freeze(
  new AuthRoutes()
);
