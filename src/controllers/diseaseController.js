// src/controllers/diseaseController.js

import * as diseaseService from "../api/diseaseService.js";

class DiseaseController {
  async getAllDiseases() {
    try {
      const diseases = await diseaseService.getAllDiseases();

      return {
        success: true,
        data: diseases,
        total: diseases.length,
        message: "Diseases loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDiseaseById(diseaseId) {
    try {
      if (!diseaseId) {
        throw new Error("Disease ID is required.");
      }

      const disease = await diseaseService.getDiseaseById(diseaseId);

      if (!disease) {
        throw new Error("Disease not found.");
      }

      return {
        success: true,
        data: disease,
        message: "Disease loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDisease(diseaseData) {
    try {
      this.validateDisease(diseaseData);

      const disease = await diseaseService.createDisease(diseaseData);

      return {
        success: true,
        data: disease,
        message: "Disease created successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateDisease(diseaseId, diseaseData) {
    try {
      if (!diseaseId) {
        throw new Error("Disease ID is required.");
      }

      this.validateDisease(diseaseData);

      const disease = await diseaseService.updateDisease(
        diseaseId,
        diseaseData
      );

      return {
        success: true,
        data: disease,
        message: "Disease updated successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteDisease(diseaseId) {
    try {
      if (!diseaseId) {
        throw new Error("Disease ID is required.");
      }

      await diseaseService.deleteDisease(diseaseId);

      return {
        success: true,
        message: "Disease deleted successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async searchDiseases(keyword) {
    try {
      const diseases = await diseaseService.getAllDiseases();

      const results = diseases.filter((disease) => {
        const search = keyword.toLowerCase();

        return (
          disease.name?.toLowerCase().includes(search) ||
          disease.crop?.toLowerCase().includes(search) ||
          disease.category?.toLowerCase().includes(search) ||
          disease.symptoms?.toLowerCase().includes(search)
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

  validateDisease(disease) {
    if (!disease) {
      throw new Error("Disease data is required.");
    }

    if (!disease.name?.trim()) {
      throw new Error("Disease name is required.");
    }

    if (!disease.crop?.trim()) {
      throw new Error("Crop name is required.");
    }

    if (!disease.symptoms?.trim()) {
      throw new Error("Symptoms are required.");
    }

    return true;
  }

  handleError(error) {
    console.error("[DiseaseController]", error);

    return {
      success: false,
      data: null,
      message: error.message || "Unexpected disease error.",
    };
  }
}

export default new DiseaseController();
