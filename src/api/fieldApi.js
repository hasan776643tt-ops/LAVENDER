// src/api/fieldApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "fields";



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
      "Field id is required."
    );

  }



  const fields =
    await getAll();



  return (

    fields.find(

      field =>

      String(field.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Field data is required."
    );

  }



  const fields =
    await getAll();



  const field = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  fields.push(
    field
  );



  storageService.save(

    STORAGE_KEY,

    fields

  );



  return field;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Field id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Field data is required."
    );

  }



  const fields =
    await getAll();



  const index =
    fields.findIndex(

      field =>

      String(field.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedField = {


    ...fields[index],


    ...data,


    id:
      fields[index].id,


    updatedAt:
      new Date().toISOString()


  };



  fields[index] =
    updatedField;



  storageService.save(

    STORAGE_KEY,

    fields

  );



  return updatedField;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Field id is required."
    );

  }



  const fields =
    await getAll();



  const filtered =
    fields.filter(

      field =>

      String(field.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== fields.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const fieldApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default fieldApi;
