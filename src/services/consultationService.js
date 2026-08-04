// src/services/consultationService.js


import consultationRepository
from "../repositories/consultationRepository.js";



class ConsultationService {



  constructor() {


    this.repository =
      consultationRepository;


  }





  async getAll() {


    return this.repository.getAll();


  }





  async getById(id) {


    if (!id) {


      throw new Error(

        "CONSULTATION_ID_REQUIRED"

      );


    }



    const consultation =

      await this.repository.getById(id);



    if (!consultation) {


      throw new Error(

        "CONSULTATION_NOT_FOUND"

      );


    }



    return consultation;


  }





  async create(data) {


    this.validate(data);



    return this.repository.create(

      data

    );


  }





  async update(id, data) {


    if (!id) {


      throw new Error(

        "CONSULTATION_ID_REQUIRED"

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

        "CONSULTATION_NOT_FOUND"

      );


    }



    return updated;


  }





  async delete(id) {


    if (!id) {


      throw new Error(

        "CONSULTATION_ID_REQUIRED"

      );


    }



    const deleted =

      await this.repository.delete(id);



    if (!deleted) {


      throw new Error(

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

      await this.repository.getById(id);



    return Boolean(consultation);


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





  validate(data) {


    if (

      !data ||

      typeof data !== "object"

    ) {


      throw new Error(

        "CONSULTATION_DATA_REQUIRED"

      );


    }



    if (

      !data.question &&

      !data.title

    ) {


      throw new Error(

        "CONSULTATION_CONTENT_REQUIRED"

      );


    }



    return true;


  }





}



export default Object.freeze(

  new ConsultationService()

);
