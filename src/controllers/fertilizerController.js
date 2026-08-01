// src/controllers/fertilizerController.js


import fertilizerService
  from "../services/fertilizerService.js";





class FertilizerController {



  constructor() {


    this.service =
      fertilizerService;


  }








  async getAllFertilizers(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `FertilizerController getAllFertilizers failed: ${error.message}`

      );


    }


  }








  async getFertilizerById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `FertilizerController getFertilizerById failed: ${error.message}`

      );


    }


  }








  async createFertilizer(data){


    try{


      return await this.service.create(

        data

      );



    }catch(error){


      throw new Error(

        `FertilizerController createFertilizer failed: ${error.message}`

      );


    }


  }








  async updateFertilizer(
    id,
    data
  ){


    try{


      return await this.service.update(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `FertilizerController updateFertilizer failed: ${error.message}`

      );


    }


  }








  async deleteFertilizer(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `FertilizerController deleteFertilizer failed: ${error.message}`

      );


    }


  }








  async countFertilizers(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `FertilizerController countFertilizers failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new FertilizerController()

);
