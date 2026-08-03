// src/api/diseaseApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "diseases";



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
      "Disease id is required."
    );

  }



  const diseases =
    await getAll();



  return (

    diseases.find(

      disease =>

      String(disease.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Disease data is required."
    );

  }



  const diseases =
    await getAll();



  const disease = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  diseases.push(
    disease
  );



  storageService.save(

    STORAGE_KEY,

    diseases

  );



  return disease;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Disease id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Disease data is required."
    );

  }



  const diseases =
    await getAll();



  const index =
    diseases.findIndex(

      disease =>

      String(disease.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedDisease = {


    ...diseases[index],


    ...data,


    id:
      diseases[index].id,


    updatedAt:
      new Date().toISOString()


  };



  diseases[index] =
    updatedDisease;



  storageService.save(

    STORAGE_KEY,

    diseases

  );



  return updatedDisease;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Disease id is required."
    );

  }



  const diseases =
    await getAll();



  const filtered =
    diseases.filter(

      disease =>

      String(disease.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== diseases.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const diseaseApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default diseaseApi;
