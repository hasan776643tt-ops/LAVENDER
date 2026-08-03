// src/repositories/harvestRepository.js

import storageService from "../services/storageService.js";


class HarvestRepository {


  constructor() {

    this.key = "harvests";

  }


  async getAll() {

    return storageService.load(
      this.key,
      []
    );

  }


  async getById(id) {

    if (!id) {
      return null;
    }


    const harvests =
      await this.getAll();


    return (
      harvests.find(
        harvest =>
          String(harvest.id) === String(id)
      ) || null
    );

  }


  async create(data) {

    const harvests =
      await this.getAll();


    harvests.push(data);


    storageService.save(
      this.key,
      harvests
    );


    return data;

  }


  async update(id, data) {

    const harvests =
      await this.getAll();


    const index =
      harvests.findIndex(
        harvest =>
          String(harvest.id) === String(id)
      );


    if (index === -1) {
      return null;
    }


    harvests[index] = {
      ...harvests[index],
      ...data
    };


    storageService.save(
      this.key,
      harvests
    );


    return harvests[index];

  }


  async delete(id) {

    const harvests =
      await this.getAll();


    const filtered =
      harvests.filter(
        harvest =>
          String(harvest.id) !== String(id)
      );


    const deleted =
      filtered.length !== harvests.length;


    if (deleted) {

      storageService.save(
        this.key,
        filtered
      );

    }


    return deleted;

  }


}


export default Object.freeze(
  new HarvestRepository()
);
