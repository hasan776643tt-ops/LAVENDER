export class Crop {
  constructor({
    id = null,
    fieldId = null,
    name = "",
    season = "",
    quantity = 0,
    plantingDate = "",
    harvestDate = "",
    irrigationType = "",
    fertilizerType = "",
    pesticideType = "",
    status = "active",
    notes = "",
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.fieldId = fieldId;
    this.name = name;
    this.season = season;
    this.quantity = quantity;
    this.plantingDate = plantingDate;
    this.harvestDate = harvestDate;
    this.irrigationType = irrigationType;
    this.fertilizerType = fertilizerType;
    this.pesticideType = pesticideType;
    this.status = status;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  update(data = {}) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      fieldId: this.fieldId,
      name: this.name,
      season: this.season,
      quantity: this.quantity,
      plantingDate: this.plantingDate,
      harvestDate: this.harvestDate,
      irrigationType: this.irrigationType,
      fertilizerType: this.fertilizerType,
      pesticideType: this.pesticideType,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
