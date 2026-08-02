// src/services/irrigationService.js

import irrigationRepository from "../repositories/irrigationRepository.js";


class IrrigationService {


  constructor() {
    this.repository = irrigationRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error("Irrigation id is required");
    }


    const irrigation =
      await this.repository.getById(id);


    if (!irrigation) {
      throw new Error("Irrigation not found");
    }


    return irrigation;

  }


  async create(irrigationData) {

    this.validateIrrigation(
      irrigationData
    );


    return this.repository.create(
      irrigationData
    );

  }


  async update(id, irrigationData) {

    if (!id) {
      throw new Error("Irrigation id is required");
    }


    this.validateIrrigation(
      irrigationData
    );


    const updatedIrrigation =
      await this.repository.update(
        id,
        irrigationData
      );


    if (!updatedIrrigation) {
      throw new Error(
        "Irrigation not found"
      );
    }


    return updatedIrrigation;

  }


  async delete(id) {

    if (!id) {
      throw new Error("Irrigation id is required");
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error(
        "Irrigation not found"
      );
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error("Irrigation id is required");
    }


    return this.repository.exists(id);

  }


  validateIrrigation(irrigation) {


    if (!irrigation) {
      throw new Error(
        "Irrigation data is required"
      );
    }


    if (!irrigation.type?.trim()) {
      throw new Error(
        "Irrigation type is required"
      );
    }


    if (
      irrigation.quantity != null &&
      Number(irrigation.quantity) < 0
    ) {

      throw new Error(
        "Invalid irrigation quantity"
      );

    }


    return true;

  }

}


const irrigationService =
new IrrigationService();


export default Object.freeze(
  irrigationService
);
