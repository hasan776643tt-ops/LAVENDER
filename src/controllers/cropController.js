// src/controllers/cropController.js


import cropService
  from "../services/cropService.js";





class CropController {



  constructor() {


    this.service =
      cropService;


  }








  async getCrops(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `CropController getCrops failed: ${error.message}`

      );


    }


  }








  async getCropById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `CropController getCropById failed: ${error.message}`

      );


    }


  }








  async createCrop(cropData){


    try{


      return await this.service.create(

        cropData

      );



    }catch(error){


      throw new Error(

        `CropController createCrop failed: ${error.message}`

      );


    }


  }








  async updateCrop(
    id,
    cropData
  ){


    try{


      return await this.service.update(

        id,

        cropData

      );



    }catch(error){


      throw new Error(

        `CropController updateCrop failed: ${error.message}`

      );


    }


  }








  async deleteCrop(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `CropController deleteCrop failed: ${error.message}`

      );


    }


  }








  async countCrops(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `CropController countCrops failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new CropController()

);
