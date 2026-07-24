export class Field {
  constructor({
    id = null,
    farmId = null,
    name = "",
    area = 0,
    cropType = "",
    soilType = "",
    irrigationType = "",
    location = "",
    notes = "",
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.farmId = farmId;
    this.name = name;
    this.area = area;
    this.cropType = cropType;
    this.soilType = soilType;
    this.irrigationType = irrigationType;
    this.location = location;
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
      farmId: this.farmId,
      name: this.name,
      area: this.area,
      cropType: this.cropType,
      soilType: this.soilType,
      irrigationType: this.irrigationType,
      location: this.location,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
