// src/api/pesticideApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "pesticides";



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
      "Pesticide id is required."
    );

  }



  const pesticides =
    await getAll();



  return (

    pesticides.find(

      pesticide =>

      String(pesticide.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Pesticide data is required."
    );

  }



  const pesticides =
    await getAll();



  const pesticide = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  pesticides.push(
    pesticide
  );



  storageService.save(

    STORAGE_KEY,

    pesticides

  );



  return pesticide;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Pesticide id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Pesticide data is required."
    );

  }



  const pesticides =
    await getAll();



  const index =
    pesticides.findIndex(

      pesticide =>

      String(pesticide.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedPesticide = {


    ...pesticides[index],


    ...data,


    id:
      pesticides[index].id,


    updatedAt:
      new Date().toISOString()


  };



  pesticides[index] =
    updatedPesticide;



  storageService.save(

    STORAGE_KEY,

    pesticides

  );



  return updatedPesticide;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Pesticide id is required."
    );

  }



  const pesticides =
    await getAll();



  const filtered =
    pesticides.filter(

      pesticide =>

      String(pesticide.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== pesticides.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const pesticideApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default pesticideApi;
