import farmRepository from "../repositories/farmRepository.js";

class FarmController {

  constructor() {
    this.repository = farmRepository;
  }


  async getFarms() {
    try {
      return await this.repository.getAll();
    } catch (error) {
      throw new Error(`Failed to get farms: ${error.message}`);
    }
  }


  async getFarmById(id) {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      throw new Error(`Failed to get farm: ${error.message}`);
    }
  }


  async createFarm(farm) {
    try {
      return await this.repository.create(farm);
    } catch (error) {
      throw new Error(`Failed to create farm: ${error.message}`);
    }
  }


  async updateFarm(id, data) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new Error(`Failed to update farm: ${error.message}`);
    }
  }


  async deleteFarm(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete farm: ${error.message}`);
    }
  }

}


export default Object.freeze(new FarmController());
