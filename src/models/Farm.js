export class Farm {
  constructor({
    id = null,
    name = "",
    owner = "",
    area = 0,
    location = "",
    cropType = "",
    irrigationType = "",
    plantingDate = "",
    notes = "",
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.area = area;
    this.location = location;
    this.cropType = cropType;
    this.irrigationType = irrigationType;
    this.plantingDate = plantingDate;
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
      name: this.name,
      owner: this.owner,
      area: this.area,
      location: this.location,
      cropType: this.cropType,
      irrigationType: this.irrigationType,
      plantingDate: this.plantingDate,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
