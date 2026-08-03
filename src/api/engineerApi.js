// src/api/engineerApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "engineers";



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
      "Engineer id is required."
    );

  }



  const engineers =
    await getAll();



  return (

    engineers.find(

      engineer =>

      String(engineer.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Engineer data is required."
    );

  }



  const engineers =
    await getAll();



  const engineer = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  engineers.push(
    engineer
  );



  storageService.save(

    STORAGE_KEY,

    engineers

  );



  return engineer;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Engineer id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Engineer data is required."
    );

  }



  const engineers =
    await getAll();



  const index =
    engineers.findIndex(

      engineer =>

      String(engineer.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedEngineer = {


    ...engineers[index],


    ...data,


    id:
      engineers[index].id,


    updatedAt:
      new Date().toISOString()


  };



  engineers[index] =
    updatedEngineer;



  storageService.save(

    STORAGE_KEY,

    engineers

  );



  return updatedEngineer;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Engineer id is required."
    );

  }



  const engineers =
    await getAll();



  const filtered =
    engineers.filter(

      engineer =>

      String(engineer.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== engineers.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const engineerApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default engineerApi;
