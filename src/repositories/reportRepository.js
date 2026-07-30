// src/repositories/reportRepository.js

import * as reportApi from "../api/reportService.js";


class ReportRepository {


  constructor() {

    this.cache = new Map();

    this.cacheDuration =
      5 * 60 * 1000;

  }



  async getAll() {

    try {

      const cached =
        this.getCache("reports");


      if (cached) {

        return cached;

      }


      const reports =
        await reportApi.getAllReports();


      this.setCache(
        "reports",
        reports
      );


      return reports;


    } catch (error) {

      throw new Error(
        `Report repository get all failed: ${error.message}`
      );

    }

  }




  async getById(id) {

    try {

      if (!id) {

        throw new Error(
          "Report ID is required."
        );

      }


      const cached =
        this.getCache(id);


      if (cached) {

        return cached;

      }


      const report =
        await reportApi.getReportById(id);



      if (report) {

        this.setCache(
          id,
          report
        );

      }


      return report;


    } catch (error) {

      throw new Error(
        `Report repository get by id failed: ${error.message}`
      );

    }

  }





  async create(data) {

    try {

      const report =
        await reportApi.createReport(
          data
        );


      this.clearCache();


      return report;


    } catch (error) {

      throw new Error(
        `Report repository create failed: ${error.message}`
      );

    }

  }





  async update(id, data) {

    try {

      if (!id) {

        throw new Error(
          "Report ID is required."
        );

      }


      const report =
        await reportApi.updateReport(
          id,
          data
        );


      this.clearCache();


      return report;


    } catch (error) {

      throw new Error(
        `Report repository update failed: ${error.message}`
      );

    }

  }





  async delete(id) {

    try {

      if (!id) {

        throw new Error(
          "Report ID is required."
        );

      }


      await reportApi.deleteReport(
        id
      );


      this.clearCache();


      return true;


    } catch (error) {

      throw new Error(
        `Report repository delete failed: ${error.message}`
      );

    }

  }





  async search(keyword = "") {

    try {

      const reports =
        await this.getAll();


      const search =
        keyword
          .trim()
          .toLowerCase();



      return reports.filter(
        report => {

          const values = [

            report.title,

            report.description,

            report.status,

            report.cropName,

            report.farmName

          ];


          return values
            .filter(Boolean)
            .some(value =>
              value
                .toLowerCase()
                .includes(search)
            );

        }
      );


    } catch (error) {

      throw new Error(
        `Report repository search failed: ${error.message}`
      );

    }

  }





  async getStatistics() {

    try {

      const reports =
        await this.getAll();


      return {

        total:
          reports.length,


        completed:
          reports.filter(
            report =>
              report.status === "Completed"
          ).length,


        pending:
          reports.filter(
            report =>
              report.status === "Pending"
          ).length,


        draft:
          reports.filter(
            report =>
              report.status === "Draft"
          ).length

      };


    } catch (error) {

      throw new Error(
        `Report statistics failed: ${error.message}`
      );

    }

  }





  setCache(key, value) {

    this.cache.set(
      String(key),
      {

        data: value,

        timestamp:
          Date.now()

      }
    );

  }





  getCache(key) {

    const item =
      this.cache.get(
        String(key)
      );


    if (!item) {

      return null;

    }


    if (
      Date.now() -
      item.timestamp >
      this.cacheDuration
    ) {

      this.cache.delete(
        String(key)
      );


      return null;

    }


    return item.data;

  }





  clearCache() {

    this.cache.clear();

  }


}



export default Object.freeze(
  new ReportRepository()
);
