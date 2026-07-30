import cropRepository from "../repositories/cropRepository.js";


class CropController {

  constructor() {
    this.repository = cropRepository;
  }


  async getCrops() {
    try {
      return await this.repository.getAll();

    } catch (error) {
      throw new Error(`Failed to get crops: ${error.message}`);
    }
  }


  async getCropById(id) {
    try {

      const crop = await this.repository.getById(id);

      if (!crop) {
        throw new Error("Crop not found");
      }

      return crop;

    } catch (error) {
      throw new Error(`Failed to get crop: ${error.message}`);
    }
  }


  async createCrop(crop) {
    try {
      return await this.repository.create(crop);

    } catch (error) {
      throw new Error(`Failed to create crop: ${error.message}`);
    }
  }


  async updateCrop(id, data) {
    try {
      return await this.repository.update(id, data);

    } catch (error) {
      throw new Error(`Failed to update crop: ${error.message}`);
    }
  }


  async deleteCrop(id) {
    try {
      return await this.repository.delete(id);

    } catch (error) {
      throw new Error(`Failed to delete crop: ${error.message}`);
    }
  }

}


export default Object.freeze(new CropController());
