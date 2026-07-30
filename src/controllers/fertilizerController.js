import fertilizerRepository from "../repositories/fertilizerRepository.js";


class FertilizerController {

  constructor() {
    this.repository = fertilizerRepository;
  }


  async getAllFertilizers() {
    try {

      return await this.repository.getAll();

    } catch (error) {
      throw new Error(
        `Failed to get fertilizers: ${error.message}`
      );
    }
  }


  async getFertilizerById(id) {
    try {

      const fertilizer =
        await this.repository.getById(id);

      if (!fertilizer) {
        throw new Error("Fertilizer not found");
      }

      return fertilizer;

    } catch (error) {
      throw new Error(
        `Failed to get fertilizer: ${error.message}`
      );
    }
  }


  async createFertilizer(data) {
    try {

      this.validateFertilizer(data);

      return await this.repository.create(data);

    } catch (error) {
      throw new Error(
        `Failed to create fertilizer: ${error.message}`
      );
    }
  }


  async updateFertilizer(id, data) {
    try {

      this.validateFertilizer(data);

      return await this.repository.update(
        id,
        data
      );

    } catch (error) {
      throw new Error(
        `Failed to update fertilizer: ${error.message}`
      );
    }
  }


  async deleteFertilizer(id) {
    try {

      return await this.repository.delete(id);

    } catch (error) {
      throw new Error(
        `Failed to delete fertilizer: ${error.message}`
      );
    }
  }


  validateFertilizer(data) {

    if (!data) {
      throw new Error(
        "Fertilizer data is required"
      );
    }


    if (!data.name?.trim()) {
      throw new Error(
        "Fertilizer name is required"
      );
    }


    if (!data.type?.trim()) {
      throw new Error(
        "Fertilizer type is required"
      );
    }


    if (
      data.quantity == null ||
      Number(data.quantity) < 0
    ) {
      throw new Error(
        "Invalid fertilizer quantity"
      );
    }

    return true;
  }

}


export default Object.freeze(
  new FertilizerController()
);
