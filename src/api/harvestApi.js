// src/api/harvestApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "harvests";



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
      "Harvest id is required."
    );

  }



  const harvests =
    await getAll();



  return (

    harvests.find(

      harvest =>

      String(harvest.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Harvest data is required."
    );

  }



  const harvests =
    await getAll();



  const harvest = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  harvests.push(
    harvest
  );



  storageService.save(

    STORAGE_KEY,

    harvests

  );



  return harvest;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Harvest id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Harvest data is required."
    );

  }



  const harvests =
    await getAll();



  const index =
    harvests.findIndex(

      harvest =>

      String(harvest.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedHarvest = {


    ...harvests[index],


    ...data,


    id:
      harvests[index].id,


    updatedAt:
      new Date().toISOString()


  };



  harvests[index] =
    updatedHarvest;



  storageService.save(

    STORAGE_KEY,

    harvests

  );



  return updatedHarvest;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Harvest id is required."
    );

  }



  const harvests =
    await getAll();



  const filtered =
    harvests.filter(

      harvest =>

      String(harvest.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== harvests.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const harvestApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default harvestApi;
