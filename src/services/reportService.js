// src/services/reportService.js


import reportRepository
from "../repositories/reportRepository.js";



class ReportService {



  constructor() {


    this.repository =
      reportRepository;


  }





  async getAll() {


    return this.repository.getAll();


  }





  async getById(id) {


    if (!id) {


      throw new Error(

        "REPORT_ID_REQUIRED"

      );


    }



    const report =

      await this.repository.getById(id);



    if (!report) {


      throw new Error(

        "REPORT_NOT_FOUND"

      );


    }



    return report;


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

        "REPORT_ID_REQUIRED"

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

        "REPORT_NOT_FOUND"

      );


    }



    return updated;


  }





  async delete(id) {


    if (!id) {


      throw new Error(

        "REPORT_ID_REQUIRED"

      );


    }



    const deleted =

      await this.repository.delete(id);



    if (!deleted) {


      throw new Error(

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



    return Boolean(report);


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





  validate(data) {


    if (

      !data ||

      typeof data !== "object"

    ) {


      throw new Error(

        "REPORT_DATA_REQUIRED"

      );


    }



    return true;


  }





  validateType(type) {


    if (!type) {


      throw new Error(

        "REPORT_TYPE_REQUIRED"

      );


    }



    return true;


  }





}



export default Object.freeze(

  new ReportService()

);
