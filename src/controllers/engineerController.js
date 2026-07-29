// src/controllers/engineerController.js

import * as engineerService from "../api/engineerService.js";

class EngineerController {
  async getAllEngineers() {
    try {
      const engineers = await engineerService.getAllEngineers();

      return {
        success: true,
        data: engineers,
        total: engineers.length,
        message: "Engineers loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getEngineerById(engineerId) {
    try {
      if (!engineerId) {
        throw new Error("Engineer ID is required.");
      }

      const engineer = await engineerService.getEngineerById(engineerId);

      if (!engineer) {
        throw new Error("Engineer not found.");
      }

      return {
        success: true,
        data: engineer,
        message: "Engineer loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createEngineer(engineerData) {
    try {
      this.validateEngineer(engineerData);

      const engineer = await engineerService.createEngineer(engineerData);

      return {
        success: true,
        data: engineer,
        message: "Engineer created successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateEngineer(engineerId, engineerData) {
    try {
      if (!engineerId) {
        throw new Error("Engineer ID is required.");
      }

      this.validateEngineer(engineerData);

      const engineer = await engineerService.updateEngineer(
        engineerId,
        engineerData
      );

      return {
        success: true,
        data: engineer,
        message: "Engineer updated successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteEngineer(engineerId) {
    try {
      if (!engineerId) {
        throw new Error("Engineer ID is required.");
      }

      await engineerService.deleteEngineer(engineerId);

      return {
        success: true,
        message: "Engineer deleted successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async searchEngineers(keyword) {
    try {
      const engineers = await engineerService.getAllEngineers();

      const results = engineers.filter((engineer) => {
        const search = keyword.toLowerCase();

        return (
          engineer.name?.toLowerCase().includes(search) ||
          engineer.specialization?.toLowerCase().includes(search) ||
          engineer.city?.toLowerCase().includes(search)
        );
      });

      return {
        success: true,
        data: results,
        total: results.length,
        message: "Search completed successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateEngineer(engineer) {
    if (!engineer) {
      throw new Error("Engineer data is required.");
    }

    if (!engineer.name?.trim()) {
      throw new Error("Engineer name is required.");
    }

    if (!engineer.specialization?.trim()) {
      throw new Error("Specialization is required.");
    }

    if (!engineer.phone?.trim()) {
      throw new Error("Phone number is required.");
    }

    return true;
  }

  handleError(error) {
    console.error("[EngineerController]", error);

    return {
      success: false,
      data: null,
      message: error.message || "Unexpected engineer error.",
    };
  }
}

export default new EngineerController();
