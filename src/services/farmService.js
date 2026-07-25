import * as farmRepository from "../repositories/farmRepository";

export const getAllFarms = async () => {
  return await farmRepository.getAllFarms();
};

export const getFarmById = async (id) => {
  return await farmRepository.getFarmById(id);
};

export const createFarm = async (farmData) => {
  return await farmRepository.createFarm(farmData);
};

export const updateFarm = async (id, farmData) => {
  return await farmRepository.updateFarm(id, farmData);
};

export const deleteFarm = async (id) => {
  return await farmRepository.deleteFarm(id);
};
