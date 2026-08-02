// src/services/fertilizerService.js

import fertilizerRepository from "../repositories/fertilizerRepository.js";


class FertilizerService {


  constructor() {
    this.repository = fertilizerRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error("Fertilizer id is required");
    }


    const fertilizer =
      await this.repository.getById(id);


    if (!fertilizer) {
      throw new Error("Fertilizer not found");
    }


    return fertilizer;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error("Fertilizer id is required");
    }


    this.validate(data);


    const updatedFertilizer =
      await this.repository.update(
        id,
        data
      );


    if (!updatedFertilizer) {
      throw new Error("Fertilizer not found");
    }


    return updatedFertilizer;

  }


  async delete(id) {

    if (!id) {
      throw new Error("Fertilizer id is required");
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error("Fertilizer not found");
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error("Fertilizer id is required");
    }


    return this.repository.exists(id);

  }


  validate(data) {

    if (!data) {
      throw new Error(
        "Fertilizer data is required"
      );
    }


    if (!data.name?.trim()) {
      throw new Error(
        "Fertilizer name is required"
      );
    }


    return true;

  }

}


const fertilizerService =
new FertilizerService();


export default Object.freeze(
  fertilizerService
);
