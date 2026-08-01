// src/controllers/diseaseController.js


import diseaseService
  from "../services/diseaseService.js";





class DiseaseController {



  constructor() {


    this.service =
      diseaseService;


  }








  async getDiseases(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `DiseaseController getDiseases failed: ${error.message}`

      );


    }


  }








  async getDiseaseById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `DiseaseController getDiseaseById failed: ${error.message}`

      );


    }


  }








  async createDisease(data){


    try{


      return await this.service.create(

        data

      );



    }catch(error){


      throw new Error(

        `DiseaseController createDisease failed: ${error.message}`

      );


    }


  }








  async updateDisease(
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

        `DiseaseController updateDisease failed: ${error.message}`

      );


    }


  }








  async deleteDisease(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `DiseaseController deleteDisease failed: ${error.message}`

      );


    }


  }








  async countDiseases(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `DiseaseController countDiseases failed: ${error.message}`

      );


    }


  }








  async searchDiseases(keyword){


    try{


      return await this.service.search(

        keyword

      );



    }catch(error){


      throw new Error(

        `DiseaseController searchDiseases failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new DiseaseController()

);
