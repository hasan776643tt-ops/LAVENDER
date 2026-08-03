// src/api/farmApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "farms";



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
      "Farm id is required."
    );

  }



  const farms =
    await getAll();



  return (

    farms.find(

      farm =>

      String(farm.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Farm data is required."
    );

  }



  const farms =
    await getAll();



  const farm = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  farms.push(
    farm
  );



  storageService.save(

    STORAGE_KEY,

    farms

  );



  return farm;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Farm id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Farm data is required."
    );

  }



  const farms =
    await getAll();



  const index =
    farms.findIndex(

      farm =>

      String(farm.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedFarm = {


    ...farms[index],


    ...data,


    id:
      farms[index].id,


    updatedAt:
      new Date().toISOString()


  };



  farms[index] =
    updatedFarm;



  storageService.save(

    STORAGE_KEY,

    farms

  );



  return updatedFarm;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Farm id is required."
    );

  }



  const farms =
    await getAll();



  const filtered =
    farms.filter(

      farm =>

      String(farm.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== farms.length;



  if (deleted) {


    storageService.save(

      STORAGE_KEY,

      filtered

    );


  }



  return deleted;

};



const farmApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default farmApi;
