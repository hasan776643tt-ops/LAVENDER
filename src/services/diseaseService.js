// src/services/diseaseService.js

import diseaseRepository
  from "../repositories/diseaseRepository.js";


class DiseaseService {


  constructor() {

    this.repository =
      diseaseRepository;

  }



  async getAll() {

    return this.repository.getAll();

  }



  async getById(id) {

    this.validateId(id);


    const disease =
      await this.repository.getById(id);


    if (!disease) {

      throw new Error(
        "DISEASE_NOT_FOUND"
      );

    }


    return disease;

  }



  async create(data) {

    this.validateCreate(data);


    return this.repository.create(
      data
    );

  }



  async update(id, data) {

    this.validateId(id);


    this.validateUpdate(data);


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "DISEASE_NOT_FOUND"
      );

    }


    return updated;

  }



  async delete(id) {

    this.validateId(id);


    const deleted =
      await this.repository.delete(
        id
      );


    if (!deleted) {

      throw new Error(
        "DISEASE_NOT_FOUND"
      );

    }


    return true;

  }



  async exists(id) {

    if (!id) {

      return false;

    }


    const disease =
      await this.repository.getById(
        id
      );


    return Boolean(disease);

  }



  async count() {

    const diseases =
      await this.repository.getAll();


    return diseases.length;

  }



  async search(keyword) {

    const diseases =
      await this.repository.getAll();


    if (!keyword) {

      return diseases;

    }


    const search =
      keyword.toLowerCase();


    return diseases.filter(

      disease =>

        disease.name
          ?.toLowerCase()
          .includes(search)

        ||

        disease.crop
          ?.toLowerCase()
          .includes(search)

        ||

        disease.category
          ?.toLowerCase()
          .includes(search)

        ||

        disease.symptoms
          ?.toLowerCase()
          .includes(search)

    );

  }



  validateId(id) {

    if (!id) {

      throw new Error(
        "DISEASE_ID_REQUIRED"
      );

    }


    return true;

  }



  validateCreate(data) {

    this.validateData(data);


    if (
      !data.name ||
      !data.name.trim()
    ) {

      throw new Error(
        "DISEASE_NAME_REQUIRED"
      );

    }


    return true;

  }



  validateUpdate(data) {

    this.validateData(data);


    return true;

  }



  validateData(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {

      throw new Error(
        "DISEASE_DATA_REQUIRED"
      );

    }


    return true;

  }


}



export default Object.freeze(
  new DiseaseService()
);
