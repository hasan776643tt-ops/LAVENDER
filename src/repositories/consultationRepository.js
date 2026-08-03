// src/repositories/consultationRepository.js

import storageService from "../services/storageService.js";


class ConsultationRepository {


  constructor() {

    this.key = "consultations";

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


    const items =
      await this.getAll();


    return (
      items.find(
        item =>
          String(item.id) === String(id)
      )
      || null
    );

  }


  async create(data) {

    if (!data) {

      throw new Error(
        "Consultation data is required"
      );

    }


    const items =
      await this.getAll();


    const item = {

      id:
        data.id ??
        crypto.randomUUID(),

      ...data,

      createdAt:
        data.createdAt ??
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    };


    items.push(item);


    storageService.save(
      this.key,
      items
    );


    return item;

  }


  async update(id, changes = {}) {

    if (!id) {

      return null;

    }


    const items =
      await this.getAll();


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


    items[index] =
      updatedItem;


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


    const items =
      await this.getAll();


    const filtered =
      items.filter(
        item =>
          String(item.id) !== String(id)
      );


    if (
      filtered.length === items.length
    ) {

      return false;

    }


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }


  async exists(id) {

    return Boolean(
      await this.getById(id)
    );

  }


  async count() {

    const items =
      await this.getAll();

    return items.length;

  }


}


export default Object.freeze(
  new ConsultationRepository()
);
