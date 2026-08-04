// src/services/exportService.js


class ExportService {


  constructor() {

    this.version =
      "3.0.0";

  }



  exportJSON(data) {


    this.validateData(data);



    return JSON.stringify(

      {

        version:
          this.version,


        exportedAt:
          new Date().toISOString(),


        data

      },

      null,

      2

    );

  }



  importJSON(json) {


    if (
      !json ||
      typeof json !== "string"
    ) {

      throw new Error(
        "IMPORT_DATA_REQUIRED"
      );

    }



    try {


      const parsed =
        JSON.parse(json);



      return (

        parsed?.data

        ??

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



  exportCSV(data) {


    this.validateData(data);



    if (
      !Array.isArray(data)
    ) {

      throw new Error(
        "CSV_ARRAY_REQUIRED"
      );

    }



    if (
      data.length === 0
    ) {

      return "";

    }



    const headers =
      Object.keys(data[0]);



    const rows =
      data.map(

        item =>

        headers.map(

          key =>

          item[key]

        ).join(",")

      );



    return [

      headers.join(","),

      ...rows

    ].join("\n");


  }



  validateData(data) {


    if (
      data === undefined ||
      data === null
    ) {

      throw new Error(
        "EXPORT_DATA_REQUIRED"
      );

    }


    return true;

  }



  getVersion() {

    return this.version;

  }


}



export default Object.freeze(

  new ExportService()

);
