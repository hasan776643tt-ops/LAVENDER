// src/routes/cropRoutes.js


import cropController
  from "../controllers/cropController.js";





class CropRoutes {



  constructor(){


    this.controller =
      cropController;


  }








  async getCrops(){


    try{


      return await this.controller.getCrops();



    }catch(error){


      throw new Error(

        `CropRoutes getCrops failed: ${error.message}`

      );


    }


  }








  async getCropById(id){


    try{


      return await this.controller.getCropById(

        id

      );



    }catch(error){


      throw new Error(

        `CropRoutes getCropById failed: ${error.message}`

      );


    }


  }








  async createCrop(data){


    try{


      return await this.controller.createCrop(

        data

      );



    }catch(error){


      throw new Error(

        `CropRoutes createCrop failed: ${error.message}`

      );


    }


  }








  async updateCrop(id,data){


    try{


      return await this.controller.updateCrop(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `CropRoutes updateCrop failed: ${error.message}`

      );


    }


  }








  async deleteCrop(id){


    try{


      return await this.controller.deleteCrop(

        id

      );



    }catch(error){


      throw new Error(

        `CropRoutes deleteCrop failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new CropRoutes()

);
