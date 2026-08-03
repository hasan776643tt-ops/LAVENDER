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

    if (!id) return null;


    const items = await this.getAll();


    return (
      items.find(
        item => String(item.id) === String(id)
      ) || null
    );

  }


  async create(entity) {

    if (!entity) {
      throw new Error(
        "Harvest data is required"
      );
    }


    const items = await this.getAll();


    const newItem = {

      id:
        entity.id ??
        crypto.randomUUID(),

      createdAt:
        entity.createdAt ??
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...entity

    };


    items.push(newItem);


    storageService.save(
      this.key,
      items
    );


    return newItem;

  }


  async update(id, changes) {

    if (!id || !changes) {
      return null;
    }


    const items = await this.getAll();


    const index =
      items.findIndex(
        item =>
          String(item.id) === String(id)
      );


    if (index === -1) {
      return null;
    }


    const updatedItem = {

      ...items[index],

      ...changes,

      id:
        items[index].id,

      updatedAt:
        new Date().toISOString()

    };


    items[index] = updatedItem;


    storageService.save(
      this.key,
      items
    );


    return updatedItem;

  }


  async delete(id) {

    if (!id) {
      return false;
    }


    const items = await getAll();


    const remaining =
      items.filter(
        item =>
          String(item.id) !== String(id)
      );


    if (
      remaining.length === items.length
    ) {
      return false;
    }


    storageService.save(
      this.key,
      remaining
    );


    return true;

  }


}


export default Object.freeze(
  new HarvestRepository()
);
