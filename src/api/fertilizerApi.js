// src/api/fertilizerApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "fertilizers";



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
      "Fertilizer id is required."
    );

  }



  const fertilizers =
    await getAll();



  return (

    fertilizers.find(

      fertilizer =>

      String(fertilizer.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Fertilizer data is required."
    );

  }



  const fertilizers =
    await getAll();



  const fertilizer = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  fertilizers.push(
    fertilizer
  );



  storageService.save(

    STORAGE_KEY,

    fertilizers

  );



  return fertilizer;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Fertilizer id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Fertilizer data is required."
    );

  }



  const fertilizers =
    await getAll();



  const index =
    fertilizers.findIndex(

      fertilizer =>

      String(fertilizer.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedFertilizer = {


    ...fertilizers[index],


    ...data,


    id:
      fertilizers[index].id,


    updatedAt:
      new Date().toISOString()


  };



  fertilizers[index] =
    updatedFertilizer;



  storageService.save(

    STORAGE_KEY,

    fertilizers

  );



  return updatedFertilizer;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Fertilizer id is required."
    );

  }



  const fertilizers =
    await getAll();



  const filtered =
    fertilizers.filter(

      fertilizer =>

      String(fertilizer.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== fertilizers.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const fertilizerApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default fertilizerApi;
