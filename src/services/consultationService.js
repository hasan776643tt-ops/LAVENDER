// src/services/consultationService.js


import consultationRepository
  from "../repositories/consultationRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";



class ConsultationService {



  constructor() {


    this.repository =
      consultationRepository;


  }





  async getAll() {


    return this.repository.getAll();


  }





  async getById(id) {


    this.validateId(
      id
    );



    const consultation =

      await this.repository.getById(
        id
      );



    if (!consultation) {


      throw createError(

        "Consultation not found",

        "CONSULTATION_NOT_FOUND"

      );


    }



    return consultation;


  }





  async create(data) {


    this.validateCreate(
      data
    );



    return this.repository.create(

      data

    );


 





  async update(
    id,
    data
  ) {


    this.validateId(
      id
    );


    this.validateUpdate(
      data
    );



    const updated =

      await this.repository.update(

        id,

        data

      );



    if (!updated) {


      throw createError(

        "Consultation not found",

        "CONSULTATION_NOT_FOUND"

      );


    }



    return updated;


  }





  async delete(id) {


    this.validateId(
      id
    );



    const deleted =

      await this.repository.delete(
        id
      );



    if (!deleted) {


      throw createError(

        "Consultation not found",

        "CONSULTATION_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {


      return false;


    }



    const consultation =

      await this.repository.getById(
        id
      );



    return Boolean(
      consultation
    );


  }





  async count() {


    const consultations =

      await this.repository.getAll();



    return consultations.length;


  }





  async search(keyword) {


    const consultations =

      await this.repository.getAll();



    if (!keyword) {


      return consultations;


    }



    const search =

      keyword.toLowerCase();



    return consultations.filter(

      consultation =>


        consultation.title

          ?.toLowerCase()

          .includes(search)


        ||


        consultation.question

          ?.toLowerCase()

          .includes(search)


        ||


        consultation.category

          ?.toLowerCase()

          .includes(search)


    );


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Consultation id is required",

        "CONSULTATION_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    this.validateData(
      data
    );



    if (

      !data.question &&

      !data.title

    ) {


      throw createError(

        "Consultation content is required",

        "CONSULTATION_CONTENT_REQUIRED"

      );


    }



    return true;


  }





  validateUpdate(data) {


    this.validateData(
      data
    );



    return true;


  }





  validateData(data) {


    if (

      !data ||

      typeof data !== "object"

    ) {


      throw createError(

        "Consultation data is required",

        "CONSULTATION_DATA_REQUIRED"

      );


    }



    return true;


  }



}



export default Object.freeze(

  new ConsultationService()

);
