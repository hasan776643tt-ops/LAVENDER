// src/controllers/inventoryController.js

import inventoryService
  from "../services/inventoryService.js";



class InventoryController {


  constructor() {

    this.service =
      inventoryService;

  }





  async getInventory() {


    try {


      return await this.service.getAll();



    } catch(error) {


      throw new Error(

        `InventoryController getInventory failed: ${error.message}`

      );


    }


  }





  async getInventoryById(id) {


    try {


      return await this.service.getById(

        id

      );



    } catch(error) {


      throw new Error(

        `InventoryController getInventoryById failed: ${error.message}`

      );


    }


  }





  async createInventory(inventoryData) {


    try {


      return await this.service.create(

        inventoryData

      );



    } catch(error) {


      throw new Error(

        `InventoryController createInventory failed: ${error.message}`

      );


    }


  }





  async updateInventory(
    id,
    inventoryData
  ) {


    try {


      return await this.service.update(

        id,

        inventoryData

      );



    } catch(error) {


      throw new Error(

        `InventoryController updateInventory failed: ${error.message}`

      );


    }


  }





  async deleteInventory(id) {


    try {


      return await this.service.delete(

        id

      );



    } catch(error) {


      throw new Error(

        `InventoryController deleteInventory failed: ${error.message}`

      );


    }


  }





  async countInventory() {


    try {


      return await this.service.count();



    } catch(error) {


      throw new Error(

        `InventoryController countInventory failed: ${error.message}`

      );


    }


  }





}



export default Object.freeze(

  new InventoryController()

);
