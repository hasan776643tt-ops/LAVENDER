// src/repositories/engineerRepository.js


import storageService
  from "../services/storageService.js";


class EngineerRepository {


  constructor() {

    this.key =
      "engineers";

  }



  async getAll() {

    return (
      storageService.load(
        this.key
      ) || []
    );

  }



  async getById(id) {

    if (!id) {

      throw new Error(
        "Engineer id is required."
      );

    }


    const engineers =
      await this.getAll();


    return (
      engineers.find(
        engineer =>
          engineer.id === id
      ) || null
    );

  }



  async create(data) {

    const engineers =
      await this.getAll();


    const engineer = {

      id:
        crypto.randomUUID(),

      ...data,

      createdAt:
        new Date().toISOString()

    };


    engineers.push(
      engineer
    );


    storageService.save(
      this.key,
      engineers
    );


    return engineer;

  }



  async update(id, data) {


    if (!id) {

      throw new Error(
        "Engineer id is required."
      );

    }


    const engineers =
      await this.getAll();


    const index =
      engineers.findIndex(
        engineer =>
          engineer.id === id
      );


    if (index === -1) {

      return null;

    }


    engineers[index] = {

      ...engineers[index],

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.key,
      engineers
    );


    return engineers[index];

  }



  async delete(id) {


    if (!id) {

      throw new Error(
        "Engineer id is required."
      );

    }


    const engineers =
      await this.getAll();


    const filtered =
      engineers.filter(
        engineer =>
          engineer.id !== id
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }


}


export default Object.freeze(
  new EngineerRepository()
);
