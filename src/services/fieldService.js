// src/services/fieldService.js

import fieldRepository from "../repositories/fieldRepository.js";


class FieldService {


  constructor() {
    this.repository = fieldRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error("Field id is required");
    }


    const field =
      await this.repository.getById(id);


    if (!field) {
      throw new Error("Field not found");
    }


    return field;

  }


  async create(fieldData) {

    this.validateField(fieldData);


    return this.repository.create(
      fieldData
    );

  }


  async update(id, fieldData) {

    if (!id) {
      throw new Error("Field id is required");
    }


    this.validateField(fieldData);


    const updatedField =
      await this.repository.update(
        id,
        fieldData
      );


    if (!updatedField) {
      throw new Error("Field not found");
    }


    return updatedField;

  }


  async delete(id) {

    if (!id) {
      throw new Error("Field id is required");
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error("Field not found");
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error("Field id is required");
    }


    return this.repository.exists(id);

  }


  validateField(field) {

    if (!field) {
      throw new Error(
        "Field data is required"
      );
    }


    if (!field.name?.trim()) {
      throw new Error(
        "Field name is required"
      );
    }


    return true;

  }

}


const fieldService =
new FieldService();


export default Object.freeze(
  fieldService
);
