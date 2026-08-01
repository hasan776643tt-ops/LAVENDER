// src/routes/farmRoutes.js


import farmController
  from "../controllers/farmController.js";





class FarmRoutes {



  constructor(){


    this.controller =
      farmController;


  }








  async getFarms(){


    try{


      return await this.controller.getFarms();



    }catch(error){


      throw new Error(

        `FarmRoutes getFarms failed: ${error.message}`

      );


    }


  }








  async getFarmById(id){


    try{


      return await this.controller.getFarmById(

        id

      );



    }catch(error){


      throw new Error(

        `FarmRoutes getFarmById failed: ${error.message}`

      );


    }


  }








  async createFarm(data){


    try{


      return await this.controller.createFarm(

        data

      );



    }catch(error){


      throw new Error(

        `FarmRoutes createFarm failed: ${error.message}`

      );


    }


  }








  async updateFarm(id,data){


    try{


      return await this.controller.updateFarm(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `FarmRoutes updateFarm failed: ${error.message}`

      );


    }


  }








  async deleteFarm(id){


    try{


      return await this.controller.deleteFarm(

        id

      );



    }catch(error){


      throw new Error(

        `FarmRoutes deleteFarm failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new FarmRoutes()

);
