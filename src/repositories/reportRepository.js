// src/repositories/reportRepository.js

import * as reportApi from "../api/reportService.js";


class ReportRepository {


  async getAll() {

    return await reportApi.getAllReports();

  }


  async getById(id) {

    if (!id) {
      throw new Error(
        "Report id is required."
      );
    }


    return await reportApi.getReportById(id);

  }


  async create(data) {

    return await reportApi.createReport(data);

  }


  async update(id, data) {

    if (!id) {
      throw new Error(
        "Report id is required."
      );
    }


    return await reportApi.updateReport(
      id,
      data
    );

  }


  async delete(id) {

    if (!id) {
      throw new Error(
        "Report id is required."
      );
    }


    await reportApi.deleteReport(id);


    return true;

  }


}


export default Object.freeze(
  new ReportRepository()
);
