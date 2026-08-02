// src/services/cropService.js

import cropRepository from "../repositories/cropRepository.js";


class CropService {


  constructor() {
    this.repository = cropRepository;
  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {
      throw new Error("Crop id is required");
    }


    const crop =
      await this.repository.getById(id);


    if (!crop) {
      throw new Error("Crop not found");
    }


    return crop;

  }


  async create(cropData) {

    this.validateCrop(cropData);


    return this.repository.create(
      cropData
    );

  }


  async update(id, cropData) {

    if (!id) {
      throw new Error("Crop id is required");
    }


    this.validateCrop(cropData);


    const updatedCrop =
      await this.repository.update(
        id,
        cropData
      );


    if (!updatedCrop) {
      throw new Error("Crop not found");
    }


    return updatedCrop;

  }


  async delete(id) {

    if (!id) {
      throw new Error("Crop id is required");
    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {
      throw new Error("Crop not found");
    }


    return true;

  }


  async count() {

    return this.repository.count();

  }


  async exists(id) {

    if (!id) {
      throw new Error("Crop id is required");
    }


    return this.repository.exists(id);

  }


  validateCrop(crop) {

    if (!crop) {
      throw new Error(
        "Crop data is required"
      );
    }


    if (!crop.name?.trim()) {
      throw new Error(
        "Crop name is required"
      );
    }


    return true;

  }

}


const cropService =
new CropService();


export default Object.freeze(
  cropService
);
