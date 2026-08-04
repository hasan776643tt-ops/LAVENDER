// src/controllers/fieldController.js


import fieldService
  from "../services/fieldService.js";



class FieldController {


  constructor() {

    this.service =
      fieldService;

  }



  async getAll() {

    try {

      return await this.service.getAll();


    } catch(error) {

      throw new Error(
        `FIELD_GET_ALL_FAILED:${error.message}`
      );

    }

  }



  async getById(id) {

    try {

      return await this.service.getById(
        id
      );


    } catch(error) {

      throw new Error(
        `FIELD_GET_BY_ID_FAILED:${error.message}`
      );

    }

  }



  async create(data) {

    try {

      return await this.service.create(
        data
      );


    } catch(error) {

      throw new Error(
        `FIELD_CREATE_FAILED:${error.message}`
      );

    }

  }



  async update(id, data) {

    try {

      return await this.service.update(
        id,
        data
      );


    } catch(error) {

      throw new Error(
        `FIELD_UPDATE_FAILED:${error.message}`
      );

    }

  }



  async delete(id) {

    try {

      return await this.service.delete(
        id
      );


    } catch(error) {

      throw new Error(
        `FIELD_DELETE_FAILED:${error.message}`
      );

    }

  }



  async exists(id) {

    try {

      return await this.service.exists(
        id
      );


    } catch(error) {

      throw new Error(
        `FIELD_EXISTS_FAILED:${error.message}`
      );

    }

  }



  async count() {

    try {

      return await this.service.count();


    } catch(error) {

      throw new Error(
        `FIELD_COUNT_FAILED:${error.message}`
      );

    }

  }


}



export default Object.freeze(
  new FieldController()
);
