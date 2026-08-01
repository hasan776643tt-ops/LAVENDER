// src/controllers/irrigationController.js


import irrigationService
  from "../services/irrigationService.js";





class IrrigationController {



  constructor() {


    this.service =
      irrigationService;


  }








  async getIrrigations(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `IrrigationController getIrrigations failed: ${error.message}`

      );


    }


  }








  async getIrrigationById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `IrrigationController getIrrigationById failed: ${error.message}`

      );


    }


  }








  async createIrrigation(data){


    try{


      return await this.service.create(

        data

      );



    }catch(error){


      throw new Error(

        `IrrigationController createIrrigation failed: ${error.message}`

      );


    }


  }








  async updateIrrigation(
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

        `IrrigationController updateIrrigation failed: ${error.message}`

      );


    }


  }








  async deleteIrrigation(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `IrrigationController deleteIrrigation failed: ${error.message}`

      );


    }


  }








  async countIrrigations(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `IrrigationController countIrrigations failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new IrrigationController()

);
