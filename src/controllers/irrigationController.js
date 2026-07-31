// src/controllers/irrigationController.js

import irrigationRepository
  from "../repositories/irrigationRepository.js";

import { irrigationValidator }
  from "../validators/irrigationValidator.js";


class IrrigationController {

  constructor() {

    this.repository =
      irrigationRepository;

  }


  async getIrrigations() {

    return await this.repository.getAll();

  }


  async getIrrigationById(id) {

    if (!id) {

      throw new Error(
        "Irrigation ID is required"
      );

    }

    return await this.repository.getById(id);

  }


  async createIrrigation(data) {

    this.validateIrrigation(data);

    return await this.repository.create(
      data
    );

  }


  async updateIrrigation(id, data) {

    if (!id) {

      throw new Error(
        "Irrigation ID is required"
      );

    }

    this.validateIrrigation(data);

    return await this.repository.update(
      id,
      data
    );

  }


  async deleteIrrigation(id) {

    if (!id) {

      throw new Error(
        "Irrigation ID is required"
      );

    }

    return await this.repository.delete(
      id
    );

  }


  async countIrrigations() {

    return await this.repository.count();

  }


  validateIrrigation(data) {

    const result =
      irrigationValidator.validate(
        data
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
  new IrrigationController()
);
