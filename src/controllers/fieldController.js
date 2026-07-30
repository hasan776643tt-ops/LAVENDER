import fieldRepository from "../repositories/fieldRepository.js";


class FieldController {

  constructor() {
    this.repository = fieldRepository;
  }


  async getFields() {
    try {
      return await this.repository.getAll();

    } catch (error) {
      throw new Error(`Failed to get fields: ${error.message}`);
    }
  }


  async getFieldById(id) {
    try {

      const field = await this.repository.getById(id);

      if (!field) {
        throw new Error("Field not found");
      }

      return field;

    } catch (error) {
      throw new Error(`Failed to get field: ${error.message}`);
    }
  }


  async createField(field) {
    try {

      return await this.repository.create(field);

    } catch (error) {
      throw new Error(`Failed to create field: ${error.message}`);
    }
  }


  async updateField(id, data) {
    try {

      return await this.repository.update(id, data);

    } catch (error) {
      throw new Error(`Failed to update field: ${error.message}`);
    }
  }


  async deleteField(id) {
    try {

      return await this.repository.delete(id);

    } catch (error) {
      throw new Error(`Failed to delete field: ${error.message}`);
    }
  }

}


export default Object.freeze(new FieldController());
