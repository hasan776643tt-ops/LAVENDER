// src/controllers/pesticideController.js

import pesticideRepository from "../repositories/pesticideRepository.js";
import { pesticideValidator } from "../validators/pesticideValidator.js";


class PesticideController {

  constructor() {

    this.repository = pesticideRepository;

  }


  async getPesticides() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `PesticideController getPesticides failed: ${error.message}`
      );

    }

  }


  async getPesticideById(id) {

    try {

      if (!id) {

        throw new Error(
          "Pesticide ID is required"
        );

      }

      const pesticide =
        await this.repository.getById(id);

      if (!pesticide) {

        throw new Error(
          "Pesticide not found"
        );

      }

      return pesticide;

    } catch (error) {

      throw new Error(
        `PesticideController getPesticideById failed: ${error.message}`
      );

    }

  }


  async createPesticide(pesticideData) {

    try {

      this.validatePesticide(
        pesticideData
      );

      return await this.repository.create(
        pesticideData
      );

    } catch (error) {

      throw new Error(
        `PesticideController createPesticide failed: ${error.message}`
      );

    }

  }


  async updatePesticide(
    id,
    pesticideData
  ) {

    try {

      if (!id) {

        throw new Error(
          "Pesticide ID is required"
        );

      }

      this.validatePesticide(
        pesticideData
      );

      const pesticide =
        await this.repository.update(
          id,
          pesticideData
        );

      if (!pesticide) {

        throw new Error(
          "Pesticide not found"
        );

      }

      return pesticide;

    } catch (error) {

      throw new Error(
        `PesticideController updatePesticide failed: ${error.message}`
      );

    }

  }


  async deletePesticide(id) {

    try {

      if (!id) {

        throw new Error(
          "Pesticide ID is required"
        );

      }

      const exists =
        await this.repository.exists(id);

      if (!exists) {

        throw new Error(
          "Pesticide not found"
        );

      }

      await this.repository.delete(id);

      return {

        success: true,

        message:
          "Pesticide deleted successfully"

      };

    } catch (error) {

      throw new Error(
        `PesticideController deletePesticide failed: ${error.message}`
      );

    }

  }


  async countPesticides() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `PesticideController countPesticides failed: ${error.message}`
      );

    }

  }


  validatePesticide(
    pesticide
  ) {

    const result =
      pesticideValidator.validate(
        pesticide
      );

    if (!result.valid) {

      throw new Error(
        JSON.stringify(
          result.errors
        )
      );

    }

    return true;

  }

}


export default Object.freeze(
  new PesticideController()
);
