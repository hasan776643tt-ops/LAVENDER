import * as fieldRepository from "../repositories/fieldRepository";

export const getFields = () => {
  return fieldRepository.getFields();
};

export const getFieldById = (id) => {
  return fieldRepository.getFieldById(id);
};

export const createField = (fieldData) => {
  return fieldRepository.createField(fieldData);
};

export const updateField = (id, fieldData) => {
  return fieldRepository.updateField(id, fieldData);
};

export const deleteField = (id) => {
  return fieldRepository.deleteField(id);
};
