// src/routes/cropRoutes.js

import cropController
  from "../controllers/cropController.js";

const cropRoutes = Object.freeze({

  getAll() {
    return cropController.getAll();
  },

  getById(id) {
    return cropController.getById(id);
  },

  getByFarmId(farmId) {
    return cropController.getByFarmId(
      farmId
    );
  },

  create(data) {
    return cropController.create(
      data
    );
  },

  update(id, data) {
    return cropController.update(
      id,
      data
    );
  },

  delete(id) {
    return cropController.delete(
      id
    );
  },

});

export default cropRoutes;
