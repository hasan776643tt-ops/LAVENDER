// src/services/exportService.js


class ExportService {



  exportJSON(data) {


    if (data === undefined) {

      throw new Error(
        "EXPORT_DATA_REQUIRED"
      );

    }


    return JSON.stringify(

      {

        version:
          "3.0.0",


        exportedAt:
          new Date().toISOString(),


        data

      },

      null,

      2

    );

  }



  importJSON(json) {


    if (!json) {

      throw new Error(
        "IMPORT_DATA_REQUIRED"
      );

    }


    try {


      const parsed =
        JSON.parse(json);



      return (

        parsed?.data ??
        parsed

      );


    } catch(error) {


      throw new Error(
        "INVALID_JSON_DATA"
      );

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



export default Object.freeze(
  new ExportService()
);
