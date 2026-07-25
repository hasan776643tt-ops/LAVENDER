import * as cropRepository from "../repositories/cropRepository";

export const getAllCrops = async () => {
  return await cropRepository.getAllCrops();
};

export const getCropById = async (id) => {
  return await cropRepository.getCropById(id);
};

export const createCrop = async (cropData) => {
  return await cropRepository.createCrop(cropData);
};

export const updateCrop = async (id, cropData) => {
  return await cropRepository.updateCrop(id, cropData);
};

export const deleteCrop = async (id) => {
  return await cropRepository.deleteCrop(id);
};
