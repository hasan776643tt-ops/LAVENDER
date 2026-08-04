// src/repositories/reportRepository.js


import storageService
  from "../services/storageService.js";



class ReportRepository {



  constructor() {

    this.key =
      "reports";

  }



  getAll() {


    try {


      return storageService.load(

        this.key,

        []

      );


    } catch(error) {


      throw new Error(

        `ReportRepository getAll failed:${error.message}`

      );


    }

  }




  getById(id) {


    try {


      if (!id) {

        throw new Error(
          "REPORT_ID_REQUIRED"
        );

      }



      const reports =
        this.getAll();



      return (

        reports.find(

          report =>

            String(report.id) === String(id)

        )

        ||

        null

      );


    } catch(error) {


      throw new Error(

        `ReportRepository getById failed:${error.message}`

      );


    }

  }





  create(data) {


    try {


      this.validate(data);



      const reports =
        this.getAll();



      const report = {


        id:
          crypto.randomUUID(),



        ...data,



        createdAt:
          new Date().toISOString(),



        updatedAt:
          new Date().toISOString()


      };



      reports.push(
        report
      );



      storageService.save(

        this.key,

        reports

      );



      return report;


    } catch(error) {


      throw new Error(

        `ReportRepository create failed:${error.message}`

      );


    }

  }





  update(id, data) {


    try {


      if (!id) {

        throw new Error(
          "REPORT_ID_REQUIRED"
        );

      }



      this.validate(data);



      const reports =
        this.getAll();



      const index =
        reports.findIndex(

          report =>

            String(report.id) === String(id)

        );



      if (index === -1) {

        return null;

      }



      const updatedReport = {


        ...reports[index],


        ...data,



        id:
          reports[index].id,



        updatedAt:
          new Date().toISOString()


      };



      reports[index] =
        updatedReport;



      storageService.save(

        this.key,

        reports

      );



      return updatedReport;


    } catch(error) {


      throw new Error(

        `ReportRepository update failed:${error.message}`

      );


    }

  }





  delete(id) {


    try {


      if (!id) {

        throw new Error(
          "REPORT_ID_REQUIRED"
        );

      }



      const reports =
        this.getAll();



      const filtered =
        reports.filter(

          report =>

            String(report.id) !== String(id)

        );



      const deleted =

        filtered.length !== reports.length;



      if (deleted) {


        storageService.save(

          this.key,

          filtered

        );


      }



      return deleted;


    } catch(error) {


      throw new Error(

        `ReportRepository delete failed:${error.message}`

      );


    }

  }





  exists(id) {


    return Boolean(

      this.getById(id)

    );


  }





  count() {


    return this.getAll().length;


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



}



export default Object.freeze(

  new ReportRepository()

);
