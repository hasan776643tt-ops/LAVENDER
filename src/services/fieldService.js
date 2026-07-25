import * as fieldRepository from "../repositories/fieldRepository";

export const getAllFields = async () => {
  return await fieldRepository.getAllFields();
};

export const getFieldById = async (id) => {
  return await fieldRepository.getFieldById(id);
};

export const createField = async (fieldData) => {
  return await fieldRepository.createField(fieldData);
};

export const updateField = async (id, fieldData) => {
  return await fieldRepository.updateField(id, fieldData);
};

export const deleteField = async (id) => {
  return await fieldRepository.deleteField(id);
};
