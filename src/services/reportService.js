// src/services/reportService.js

import reportRepository
from "../repositories/reportRepository.js";


import {
  createError
}
from "../utils/errorHandler.js";




class ReportService {



  constructor() {

    this.repository =
      reportRepository;

  }





  async getAll() {

    return this.repository.getAll();

  }





  async getById(id) {


    this.validateId(id);



    const report =
      await this.repository.getById(id);



    if (!report) {


      throw createError(

        "Report not found",

        "REPORT_NOT_FOUND"

      );


    }



    return report;


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


      throw createError(

        "Report not found",

        "REPORT_NOT_FOUND"

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


      throw createError(

        "Report not found",

        "REPORT_NOT_FOUND"

      );


    }



    return true;


  }





  async exists(id) {


    if (!id) {

      return false;

    }



    const report =
      await this.repository.getById(id);



    return Boolean(
      report
    );


  }





  async count() {


    const reports =
      await this.repository.getAll();



    return reports.length;


  }





  async search(keyword) {


    const reports =
      await this.repository.getAll();



    if (!keyword) {

      return reports;

    }



    const search =
      keyword.toLowerCase();



    return reports.filter(

      report =>

        report.title
          ?.toLowerCase()
          .includes(search)

        ||

        report.type
          ?.toLowerCase()
          .includes(search)

        ||

        report.category
          ?.toLowerCase()
          .includes(search)

    );


  }





  async generate(type, data = {}) {


    this.validateType(type);



    return this.repository.create({

      type,

      data,

      generatedAt:
        new Date().toISOString()

    });


  }





  validateId(id) {


    if (!id) {


      throw createError(

        "Report id is required",

        "REPORT_ID_REQUIRED"

      );


    }



    return true;


  }





  validateCreate(data) {


    this.validateData(data);



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


      throw createError(

        "Report data is required",

        "REPORT_DATA_REQUIRED"

      );


    }



    return true;


  }





  validateType(type) {


    if (!type) {


      throw createError(

        "Report type is required",

        "REPORT_TYPE_REQUIRED"

      );


    }



    return true;


  }



}





export default Object.freeze(

  new ReportService()

);
