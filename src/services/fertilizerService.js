// src/services/fertilizerService.js


import fertilizerRepository
  from "../repositories/fertilizerRepository.js";



class FertilizerService {



  constructor(){

    this.repository =
      fertilizerRepository;

  }






  async getAll(){

    try{


      return await this.repository.getAll();



    }catch(error){


      throw new Error(
        `FertilizerService getAll failed: ${error.message}`
      );


    }

  }








  async getById(id){

    try{


      if(!id){

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      const fertilizer =
        await this.repository.getById(id);




      if(!fertilizer){

        throw new Error(
          "Fertilizer not found"
        );

      }



      return fertilizer;



    }catch(error){


      throw new Error(
        `FertilizerService getById failed: ${error.message}`
      );


    }

  }









  async create(data){


    try{


      this.validate(data);



      return await this.repository.create(
        data
      );



    }catch(error){


      throw new Error(
        `FertilizerService create failed: ${error.message}`
      );


    }

  }









  async update(id,data){


    try{


      if(!id){

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      this.validate(data);



      const fertilizer =
        await this.repository.update(
          id,
          data
        );




      if(!fertilizer){

        throw new Error(
          "Fertilizer not found"
        );

      }



      return fertilizer;



    }catch(error){


      throw new Error(
        `FertilizerService update failed: ${error.message}`
      );


    }

  }









  async delete(id){


    try{


      if(!id){

        throw new Error(
          "Fertilizer ID is required"
        );

      }



      const exists =
        await this.repository.exists(id);




      if(!exists){

        throw new Error(
          "Fertilizer not found"
        );

      }



      await this.repository.delete(
        id
      );




      return {


        success:true,


        message:
        "Fertilizer deleted successfully"


      };



    }catch(error){


      throw new Error(
        `FertilizerService delete failed: ${error.message}`
      );


    }

  }









  async count(){


    try{


      return await this.repository.count();



    }catch(error){


      throw new Error(
        `FertilizerService count failed: ${error.message}`
      );


    }

  }









  validate(data){



    if(!data){


      throw new Error(
        "Fertilizer data is required"
      );


    }





    if(!data.name?.trim()){


      throw new Error(
        "Fertilizer name is required"
      );


    }





    return true;


  }



}




export default Object.freeze(
  new FertilizerService()
);
