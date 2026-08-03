// src/api/cropApi.js

import storageService from "../services/storageService.js";


const STORAGE_KEY = "crops";


const generateId = () =>
  crypto?.randomUUID?.()
  || Date.now().toString();


const getAll = async () => {

  return storageService.load(
    STORAGE_KEY,
    []
  );

};


const getById = async (id) => {

  if (!id) {
    throw new Error(
      "Crop id is required."
    );
  }

  const crops =
    await getAll();

  return (
    crops.find(
      (crop) =>
        String(crop.id) ===
        String(id)
    ) || null
  );

};


const create = async (data) => {

  if (!data) {
    throw new Error(
      "Crop data is required."
    );
  }

  const crops =
    await getAll();

  const crop = {

    id: generateId(),

    ...data,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };

  crops.push(crop);

  storageService.save(
    STORAGE_KEY,
    crops
  );

  return crop;

};


const update = async (
  id,
  data
) => {

  if (!id) {
    throw new Error(
      "Crop id is required."
    );
  }

  const crops =
    await getAll();

  const index =
    crops.findIndex(
      (crop) =>
        String(crop.id) ===
        String(id)
    );

  if (index === -1) {
    return null;
  }

  const updatedCrop = {

    ...crops[index],

    ...data,

    id: crops[index].id,

    updatedAt:
      new Date().toISOString()

  };

  crops[index] =
    updatedCrop;

  storageService.save(
    STORAGE_KEY,
    crops
  );

  return updatedCrop;

};


const remove = async (id) => {

  if (!id) {
    throw new Error(
      "Crop id is required."
    );
  }

  const crops =
    await getAll();

  const filtered =
    crops.filter(
      (crop) =>
        String(crop.id) !==
        String(id)
    );

  const deleted =
    filtered.length !==
    crops.length;

  if (deleted) {

    storageService.save(
      STORAGE_KEY,
      filtered
    );

  }

  return deleted;

};


const cropApi = Object.freeze({

  getAll,

  getById,

  create,

  update,

  delete: remove

});


export default cropApi;
