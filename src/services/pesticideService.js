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

      throw new Error(
        "PESTICIDE_ID_REQUIRED"
      );

    }


    const pesticide =
      await this.repository.getById(id);


    if (!pesticide) {

      throw new Error(
        "PESTICIDE_NOT_FOUND"
      );

    }


    return pesticide;

  }


  async create(data) {

    this.validate(data);


    return this.repository.create(data);

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "PESTICIDE_ID_REQUIRED"
      );

    }


    this.validate(data);


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "PESTICIDE_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "PESTICIDE_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "PESTICIDE_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }


    const pesticide =
      await this.repository.getById(id);


    return Boolean(pesticide);

  }


  async count() {

    const pesticides =
      await this.repository.getAll();


    return pesticides.length;

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


  validate(data) {


    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "PESTICIDE_DATA_REQUIRED"
      );

    }


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "PESTICIDE_NAME_REQUIRED"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new PesticideService()
);
