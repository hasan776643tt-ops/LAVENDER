// src/repositories/reportRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class ReportRepository {


  constructor(){

    this.key =
      "reports";

  }





  async getAll(){

    return storageService.load(

      this.key,

      []

    );

  }





  async getById(id){


    if(!id){

      return null;

    }



    const reports =

      await this.getAll();



    return (

      reports.find(

        report =>

          String(report.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data){


    this.validate(data);



    const reports =

      await this.getAll();



    const now =

      new Date().toISOString();



    const report = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    reports.push(

      report

    );



    await storageService.save(

      this.key,

      reports

    );



    return report;


  }





  async update(
    id,
    data
  ){


    if(!id){

      throw createError(

        "Report id is required",

        "REPORT_ID_REQUIRED"

      );

    }



    this.validate(data);



    const reports =

      await this.getAll();



    const index =

      reports.findIndex(

        report =>

          String(report.id) === String(id)

      );



    if(index === -1){

      return null;

    }



    const updatedReport = {


      ...reports[index],


      ...data,


      id:

        reports[index].id,


      createdAt:

        reports[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    reports[index] =

      updatedReport;



    await storageService.save(

      this.key,

      reports

    );



    return updatedReport;


  }





  async delete(id){


    if(!id){

      return false;

    }



    const reports =

      await this.getAll();



    const filtered =

      reports.filter(

        report =>

          String(report.id) !== String(id)

      );



    const deleted =

      filtered.length !== reports.length;



    if(deleted){


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id){


    return Boolean(

      await this.getById(id)

    );


  }





  async count(){


    const reports =

      await this.getAll();



    return reports.length;


  }





  validate(data){


    if(

      !data ||

      typeof data !== "object"

    ){


      throw createError(

        "Report data is required",

        "REPORT_DATA_REQUIRED"

      );

    }



    return true;


  }


}





const reportRepository =

  new ReportRepository();



export default Object.freeze(

  reportRepository

);
