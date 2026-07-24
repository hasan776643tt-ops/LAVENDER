import { cropService } from "../api/cropService";

class CropRepository {
  getAll() {
    return cropService.getCrops();
  }

  getById(id) {
    return this.getAll().find(crop => crop.id === id) || null;
  }

  create(crop) {
    cropService.addCrop(crop);
    return crop;
  }

  update(id, data) {
    cropService.updateCrop(id, data);
    return this.getById(id);
  }

  delete(id) {
    cropService.deleteCrop(id);
    return true;
  }
}

export const cropRepository = new CropRepository();
