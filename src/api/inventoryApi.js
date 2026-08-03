// src/api/inventoryApi.js


import storageService
  from "../services/storageService.js";



const STORAGE_KEY =
  "inventory";



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
      "Inventory item id is required."
    );

  }



  const inventory =
    await getAll();



  return (

    inventory.find(

      item =>

      String(item.id)
      ===
      String(id)

    )

    || null

  );

};



const create = async (data) => {


  if (!data) {

    throw new Error(
      "Inventory data is required."
    );

  }



  const inventory =
    await getAll();



  const item = {


    id:
      generateId(),


    ...data,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()


  };



  inventory.push(
    item
  );



  storageService.save(

    STORAGE_KEY,

    inventory

  );



  return item;

};



const update = async (
  id,
  data
) => {


  if (!id) {

    throw new Error(
      "Inventory item id is required."
    );

  }



  if (!data) {

    throw new Error(
      "Inventory data is required."
    );

  }



  const inventory =
    await getAll();



  const index =
    inventory.findIndex(

      item =>

      String(item.id)
      ===
      String(id)

    );



  if (index === -1) {

    return null;

  }



  const updatedItem = {


    ...inventory[index],


    ...data,


    id:
      inventory[index].id,


    updatedAt:
      new Date().toISOString()


  };



  inventory[index] =
    updatedItem;



  storageService.save(

    STORAGE_KEY,

    inventory

  );



  return updatedItem;

};



const remove = async (id) => {


  if (!id) {

    throw new Error(
      "Inventory item id is required."
    );

  }



  const inventory =
    await getAll();



  const filtered =
    inventory.filter(

      item =>

      String(item.id)
      !==
      String(id)

    );



  const deleted =
    filtered.length !== inventory.length;



  if (deleted) {

    storageService.save(

      STORAGE_KEY,

      filtered

    );

  }



  return deleted;

};



const inventoryApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete:
    remove

});



export default inventoryApi;
