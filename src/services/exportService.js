// src/services/exportService.js


class ExportService {


  exportJSON(data) {

    return JSON.stringify(
      data,
      null,
      2
    );

  }





  importJSON(json) {

    try {

      return JSON.parse(
        json
      );

    } catch {

      return null;

    }

  }





  exportData(data) {

    return this.exportJSON(
      data
    );

  }





  importData(data) {

    return this.importJSON(
      data
    );

  }


}



export const exportService =
  new ExportService();



export default exportService;
