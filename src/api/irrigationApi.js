// src/api/irrigationApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "irrigations";



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
      "Irrigation id is required."
    );

  }



  const irrigations =
    await getAll();



  return (

    irrigations.find(

      irrigation =>

      String(irrigation.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Irrigation data is required."
    );

  }



  const irrigations =
    await getAll();



  const irrigation = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  irrigations.push(
    irrigation
  );



  storageService.save(

    STORAGE_KEY,

    irrigations

  );



  return irrigation;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Irrigation id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Irrigation data is required."
    );

  }



  const irrigations =
    await getAll();



  const index =
    irrigations.findIndex(

      irrigation =>

      String(irrigation.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedIrrigation = {


    ...irrigations[index],


    ...data,


    id:
      irrigations[index].id,


    updatedAt:
      new Date().toISOString()


  };



  irrigations[index] =
    updatedIrrigation;



  storageService.save(

    STORAGE_KEY,

    irrigations

  );



  return updatedIrrigation;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Irrigation id is required."
    );

  }



  const irrigations =
    await getAll();



  const filtered =
    irrigations.filter(

      irrigation =>

      String(irrigation.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== irrigations.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const irrigationApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default irrigationApi;
