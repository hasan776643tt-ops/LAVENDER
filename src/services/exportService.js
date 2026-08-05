// src/services/exportService.js


import {
  createError
}
from "../utils/errorHandler.js";



class ExportService {


  constructor() {


    this.version =
      "3.0.0";


  }





  exportJSON(data) {


    this.validateData(
      data
    );



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


      throw createError(

        "Import data is required",

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


      throw createError(

        "Invalid JSON data",

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


    this.validateArray(
      data
    );



    if (

      data.length === 0

    ) {


      return "";

    }



    const headers =
      Object.keys(
        data[0]
      );



    const rows =

      data.map(

        item =>

        headers.map(

          key =>

          this.escapeCSV(
            item[key]
          )

        ).join(",")

      );



    return [

      headers.join(","),

      ...rows

    ].join("\n");


  }





  escapeCSV(value) {


    if (

      value === null ||

      value === undefined

    ) {


      return "";

    }



    const stringValue =
      String(value);



    if (

      stringValue.includes(",")

      ||

      stringValue.includes('"')

      ||

      stringValue.includes("\n")

    ) {


      return (

        '"' +

        stringValue.replace(

          /"/g,

          '""'

        )

        +

        '"'

      );


    }



    return stringValue;


  }





  validateData(data) {


    if (

      data === undefined

      ||

      data === null

    ) {


      throw createError(

        "Export data is required",

        "EXPORT_DATA_REQUIRED"

      );


    }



    return true;


  }





  validateArray(data) {


    if (

      !Array.isArray(data)

    ) {


      throw createError(

        "CSV data must be an array",

        "CSV_ARRAY_REQUIRED"

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
