// src/controllers/pesticideController.js


import pesticideService
  from "../services/pesticideService.js";





class PesticideController {



  constructor() {


    this.service =
      pesticideService;


  }








  async getPesticides(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `PesticideController getPesticides failed: ${error.message}`

      );


    }


  }








  async getPesticideById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `PesticideController getPesticideById failed: ${error.message}`

      );


    }


  }








  async createPesticide(data){


    try{


      return await this.service.create(

        data

      );



    }catch(error){


      throw new Error(

        `PesticideController createPesticide failed: ${error.message}`

      );


    }


  }








  async updatePesticide(
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

        `PesticideController updatePesticide failed: ${error.message}`

      );


    }


  }








  async deletePesticide(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `PesticideController deletePesticide failed: ${error.message}`

      );


    }


  }








  async countPesticides(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `PesticideController countPesticides failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new PesticideController()

);
