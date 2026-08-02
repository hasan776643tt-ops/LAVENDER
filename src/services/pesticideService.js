// src/services/pesticideService.js

import pesticideRepository from "../repositories/pesticideRepository.js";


class PesticideService {


  constructor() {
    this.repository = pesticideRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error("Pesticide id is required");
    }


    const pesticide =
      await this.repository.getById(id);


    if (!pesticide) {
      throw new Error("Pesticide not found");
    }


    return pesticide;

  }


  async create(data) {

    this.validatePesticide(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error("Pesticide id is required");
    }


    this.validatePesticide(data);


    const updatedPesticide =
      await this.repository.update(
        id,
        data
      );


    if (!updatedPesticide) {
      throw new Error("Pesticide not found");
    }


    return updatedPesticide;

  }


  async delete(id) {

    if (!id) {
      throw new Error("Pesticide id is required");
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error("Pesticide not found");
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error("Pesticide id is required");
    }


    return this.repository.exists(id);

  }


  async search(keyword) {

    const pesticides =
      await this.repository.getAll();


    if (!keyword) {
      return pesticides;
    }


    const search =
      keyword.toLowerCase();


    return pesticides.filter(
      pesticide =>
        pesticide.name
          ?.toLowerCase()
          .includes(search)

        ||

        pesticide.type
          ?.toLowerCase()
          .includes(search)

        ||

        pesticide.crop
          ?.toLowerCase()
          .includes(search)
    );

  }


  validatePesticide(data) {

    if (!data) {
      throw new Error(
        "Pesticide data is required"
      );
    }


    if (!data.name?.trim()) {
      throw new Error(
        "Pesticide name is required"
      );
    }


    return true;

  }

}


const pesticideService =
new PesticideService();


export default Object.freeze(
  pesticideService
);
