// src/controllers/farmController.js


import farmService
  from "../services/farmService.js";





class FarmController {



  constructor() {


    this.service =
      farmService;


  }








  async getFarms(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `FarmController getFarms failed: ${error.message}`

      );


    }


  }








  async getFarmById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `FarmController getFarmById failed: ${error.message}`

      );


    }


  }








  async createFarm(farmData){


    try{


      return await this.service.create(

        farmData

      );



    }catch(error){


      throw new Error(

        `FarmController createFarm failed: ${error.message}`

      );


    }


  }








  async updateFarm(
    id,
    farmData
  ){


    try{


      return await this.service.update(

        id,

        farmData

      );



    }catch(error){


      throw new Error(

        `FarmController updateFarm failed: ${error.message}`

      );


    }


  }








  async deleteFarm(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `FarmController deleteFarm failed: ${error.message}`

      );


    }


  }








  async countFarms(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `FarmController countFarms failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new FarmController()

);
