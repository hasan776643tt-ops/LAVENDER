import { cropRepository } from "../repositories/cropRepository";

class CropController {
  getCrops() {
    return cropRepository.getAll();
  }

  getCropById(id) {
    return cropRepository.getById(id);
  }

  createCrop(crop) {
    return cropRepository.create(crop);
  }

  updateCrop(id, data) {
    return cropRepository.update(id, data);
  }

  deleteCrop(id) {
    return cropRepository.delete(id);
  }
}

export const cropController = new CropController();
