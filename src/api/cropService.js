// src/services/cropService.js

import cropRepository
  from "../repositories/cropRepository.js";


class CropService {


  constructor() {

    this.repository =
      cropRepository;

  }




  async getAll() {

    return this.repository.getAll();

  }




  async getById(id) {


    if (!id) {

      throw new Error(
        "Crop id is required"
      );

    }


    const crop =
      await this.repository.getById(id);



    if (!crop) {

      throw new Error(
        "Crop not found"
      );

    }


    return crop;

  }




  async create(data) {


    this.validateCrop(data);



    return this.repository.create(
      data
    );

  }




  async update(id,data) {


    if (!id) {

      throw new Error(
        "Crop id is required"
      );

    }



    this.validateCrop(data);



    const updatedCrop =
      await this.repository.update(
        id,
        data
      );



    if (!updatedCrop) {

      throw new Error(
        "Crop not found"
      );

    }


    return updatedCrop;

  }




  async delete(id) {


    if (!id) {

      throw new Error(
        "Crop id is required"
      );

    }



    const deleted =
      await this.repository.delete(id);



    if (!deleted) {

      throw new Error(
        "Crop not found"
      );

    }


    return true;

  }




  async count() {

    return this.repository.count();

  }




  async exists(id) {


    if (!id) {

      throw new Error(
        "Crop id is required"
      );

    }


    return this.repository.exists(id);

  }




  async search(keyword) {


    const crops =
      await this.repository.getAll();



    if (!keyword) {

      return crops;

    }



    const search =
      keyword.toLowerCase();



    return crops.filter(
      crop =>

        crop.name
        ?.toLowerCase()
        .includes(search)

        ||

        crop.type
        ?.toLowerCase()
        .includes(search)

    );

  }




  validateCrop(data) {


    if (!data) {

      throw new Error(
        "Crop data is required"
      );

    }



    if (!data.name?.trim()) {

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
