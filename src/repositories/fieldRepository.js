import { fieldService } from "../api/fieldService";

class FieldRepository {
  getAll() {
    return fieldService.getFields();
  }

  getById(id) {
    return this.getAll().find(field => field.id === id) || null;
  }

  create(field) {
    fieldService.addField(field);
    return field;
  }

  update(id, data) {
    fieldService.updateField(id, data);
    return this.getById(id);
  }

  delete(id) {
    fieldService.deleteField(id);
    return true;
  }
}

export const fieldRepository = new FieldRepository();
