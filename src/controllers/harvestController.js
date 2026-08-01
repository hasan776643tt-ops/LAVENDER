// src/controllers/harvestController.js

import harvestService
  from "../services/harvestService.js";



class HarvestController {


  constructor() {

    this.service =
      harvestService;

  }





  async getHarvests() {


    try {


      return await this.service.getAll();



    } catch(error) {


      throw new Error(

        `HarvestController getHarvests failed: ${error.message}`

      );


    }


  }





  async getHarvestById(id) {


    try {


      return await this.service.getById(

        id

      );



    } catch(error) {


      throw new Error(

        `HarvestController getHarvestById failed: ${error.message}`

      );


    }


  }





  async createHarvest(harvestData) {


    try {


      return await this.service.create(

        harvestData

      );



    } catch(error) {


      throw new Error(

        `HarvestController createHarvest failed: ${error.message}`

      );


    }


  }





  async updateHarvest(
    id,
    harvestData
  ) {


    try {


      return await this.service.update(

        id,

        harvestData

      );



    } catch(error) {


      throw new Error(

        `HarvestController updateHarvest failed: ${error.message}`

      );


    }


  }





  async deleteHarvest(id) {


    try {


      return await this.service.delete(

        id

      );



    } catch(error) {


      throw new Error(

        `HarvestController deleteHarvest failed: ${error.message}`

      );


    }


  }





  async countHarvests() {


    try {


      return await this.service.count();



    } catch(error) {


      throw new Error(

        `HarvestController countHarvests failed: ${error.message}`

      );


    }


  }





}



export default Object.freeze(

  new HarvestController()

);
