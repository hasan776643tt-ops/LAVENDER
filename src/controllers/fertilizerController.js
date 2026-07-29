// src/controllers/fertilizerController.js

import * as fertilizerService from "../api/fertilizerService.js";

class FertilizerController {
  async getAllFertilizers() {
    try {
      const fertilizers = await fertilizerService.getAllFertilizers();

      return {
        success: true,
        data: fertilizers,
        total: fertilizers.length,
        message: "Fertilizers loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getFertilizerById(fertilizerId) {
    try {
      if (!fertilizerId) {
        throw new Error("Fertilizer ID is required.");
      }

      const fertilizer = await fertilizerService.getFertilizerById(
        fertilizerId
      );

      if (!fertilizer) {
        throw new Error("Fertilizer not found.");
      }

      return {
        success: true,
        data: fertilizer,
        message: "Fertilizer loaded successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createFertilizer(fertilizerData) {
    try {
      this.validateFertilizer(fertilizerData);

      const fertilizer = await fertilizerService.createFertilizer(
        fertilizerData
      );

      return {
        success: true,
        data: fertilizer,
        message: "Fertilizer created successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateFertilizer(fertilizerId, fertilizerData) {
    try {
      if (!fertilizerId) {
        throw new Error("Fertilizer ID is required.");
      }

      this.validateFertilizer(fertilizerData);

      const fertilizer = await fertilizerService.updateFertilizer(
        fertilizerId,
        fertilizerData
      );

      return {
        success: true,
        data: fertilizer,
        message: "Fertilizer updated successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteFertilizer(fertilizerId) {
    try {
      if (!fertilizerId) {
        throw new Error("Fertilizer ID is required.");
      }

      await fertilizerService.deleteFertilizer(fertilizerId);

      return {
        success: true,
        message: "Fertilizer deleted successfully.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async searchFertilizers(keyword) {
    try {
      const fertilizers = await fertilizerService.getAllFertilizers();

      const search = keyword.trim().toLowerCase();

      const results = fertilizers.filter((fertilizer) => {
        return (
          fertilizer.name?.toLowerCase().includes(search) ||
          fertilizer.type?.toLowerCase().includes(search) ||
          fertilizer.manufacturer?.toLowerCase().includes(search)
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

  validateFertilizer(fertilizer) {
    if (!fertilizer) {
      throw new Error("Fertilizer data is required.");
    }

    if (!fertilizer.name?.trim()) {
      throw new Error("Fertilizer name is required.");
    }

    if (!fertilizer.type?.trim()) {
      throw new Error("Fertilizer type is required.");
    }

    if (
      fertilizer.quantity == null ||
      Number(fertilizer.quantity) < 0
    ) {
      throw new Error("Invalid fertilizer quantity.");
    }

    return true;
  }

  calculateTotalCost(quantity, unitPrice) {
    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (Number.isNaN(qty) || Number.isNaN(price)) {
      return 0;
    }

    return qty * price;
  }

  handleError(error) {
    console.error("[FertilizerController]", error);

    return {
      success: false,
      data: null,
      message: error.message || "Unexpected fertilizer error.",
    };
  }
}

export default new FertilizerController();
