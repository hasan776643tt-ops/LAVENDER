// src/api/reportApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "reports";



const generateId = () =>

  crypto?.randomUUID?.()
  ||
  Date.now().toString();



const getAll = async () => {

  return storageService.load(
    STORAGE_KEY,
    []
  );

};



const getById = async (id) => {


  if (!id) {

    throw new Error(
      "Report id is required."
    );

  }



  const reports =
    await getAll();



  return (

    reports.find(

      report =>

      String(report.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Report data is required."
    );

  }



  const reports =
    await getAll();



  const report = {


    id:
      generateId(),


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

    STORAGE_KEY,

    reports

  );



  return report;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Report id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Report data is required."
    );

  }



  const reports =
    await getAll();



  const index =
    reports.findIndex(

      report =>

      String(report.id)
      ===
      String(id)

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

    STORAGE_KEY,

    reports

  );



  return updatedReport;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Report id is required."
    );

  }



  const reports =
    await getAll();



  const filtered =
    reports.filter(

      report =>

      String(report.id)
      !==
      String(id)

    );






  const deleted =
    filtered.length !== reports.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const reportApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default reportApi;
