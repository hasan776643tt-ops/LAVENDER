// src/routes/engineerRoutes.js


import engineerController
  from "../controllers/engineerController.js";





class EngineerRoutes {



  constructor(){


    this.controller =
      engineerController;


  }








  async getAll(){


    try{


      return await this.controller.getAllEngineers();



    }catch(error){


      throw new Error(

        `EngineerRoutes getAll failed: ${error.message}`

      );


    }


  }








  async getById(id){


    try{


      return await this.controller.getEngineerById(

        id

      );



    }catch(error){


      throw new Error(

        `EngineerRoutes getById failed: ${error.message}`

      );


    }


  }








  async create(data){


    try{


      return await this.controller.createEngineer(

        data

      );



    }catch(error){


      throw new Error(

        `EngineerRoutes create failed: ${error.message}`

      );


    }


  }








  async update(id,data){


    try{


      return await this.controller.updateEngineer(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `EngineerRoutes update failed: ${error.message}`

      );


    }


  }








  async delete(id){


    try{


      return await this.controller.deleteEngineer(

        id

      );



    }catch(error){


      throw new Error(

        `EngineerRoutes delete failed: ${error.message}`

      );


    }


  }








  async search(keyword){


    try{


      return await this.controller.searchEngineers(

        keyword

      );



    }catch(error){


      throw new Error(

        `EngineerRoutes search failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new EngineerRoutes()

);
