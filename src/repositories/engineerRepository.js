// src/repositories/engineerRepository.js

import * as engineerApi from "../api/engineerService.js";


class EngineerRepository {

  async getAll() {
    return await engineerApi.getAllEngineers();
  }


  async getById(id) {
    if (!id) {
      throw new Error("Engineer id is required.");
    }

    return await engineerApi.getEngineerById(id);
  }


  async create(data) {
    return await engineerApi.createEngineer(data);
  }


  async update(id, data) {
    if (!id) {
      throw new Error("Engineer id is required.");
    }

    return await engineerApi.updateEngineer(id, data);
  }


  async delete(id) {
    if (!id) {
      throw new Error("Engineer id is required.");
    }

    await engineerApi.deleteEngineer(id);

    return true;
  }


  async search(keyword = "") {

    const engineers = await this.getAll();

    const value = keyword
      .trim()
      .toLowerCase();


    if (!value) {
      return engineers;
    }


    return engineers.filter((engineer) =>
      [
        engineer.name,
        engineer.specialization,
        engineer.city,
        engineer.phone,
        engineer.email
      ]
      .filter(Boolean)
      .some((item) =>
        item
          .toLowerCase()
          .includes(value)
      )
    );
  }


  clearCache() {
    return true;
  }

}


export default Object.freeze(
  new EngineerRepository()
);
