// src/services/pesticideService.js


import pesticideRepository
  from "../repositories/pesticideRepository.js";



class PesticideService {



  constructor() {

    this.repository =
      pesticideRepository;

  }





  async getAll() {


    try {


      return await this.repository.getAll();



    } catch(error) {


      throw new Error(
        `PesticideService getAll failed: ${error.message}`
      );


    }


  }





  async getById(id) {


    try {


      if (!id) {


        throw new Error(
          "Pesticide ID is required"
        );


      }



      const pesticide =

        await this.repository.getById(id);




      if (!pesticide) {


        throw new Error(
          "Pesticide not found"
        );


      }




      return pesticide;



    } catch(error) {


      throw new Error(
        `PesticideService getById failed: ${error.message}`
      );


    }


  }





  async create(data) {


    try {


      this.validate(data);



      return await this.repository.create(
        data
      );



    } catch(error) {


      throw new Error(
        `PesticideService create failed: ${error.message}`
      );


    }


  }





  async update(id,data) {


    try {


      if (!id) {


        throw new Error(
          "Pesticide ID is required"
        );


      }



      this.validate(data);



      const pesticide =

        await this.repository.update(
          id,
          data
        );




      if (!pesticide) {


        throw new Error(
          "Pesticide not found"
        );


      }




      return pesticide;



    } catch(error) {


      throw new Error(
        `PesticideService update failed: ${error.message}`
      );


    }


  }





  async delete(id) {


    try {


      if (!id) {


        throw new Error(
          "Pesticide ID is required"
        );


      }




      const exists =

        await this.repository.exists(id);




      if (!exists) {


        throw new Error(
          "Pesticide not found"
        );


      }




      await this.repository.delete(id);



      return {


        success:true,


        message:
          "Pesticide deleted successfully"


      };



    } catch(error) {


      throw new Error(
        `PesticideService delete failed: ${error.message}`
      );


    }


  }





  async count() {


    try {


      return await this.repository.count();



    } catch(error) {


      throw new Error(
        `PesticideService count failed: ${error.message}`
      );


    }


  }





  async search(keyword) {


    try {


      const pesticides =

        await this.repository.getAll();




      if (!keyword) {


        return pesticides;


      }




      const search =

        keyword.toLowerCase();




      return pesticides.filter(

        pesticide =>


          pesticide.name
          ?.toLowerCase()
          .includes(search)


          ||

          pesticide.type
          ?.toLowerCase()
          .includes(search)


          ||

          pesticide.crop
          ?.toLowerCase()
          .includes(search)


      );



    } catch(error) {


      throw new Error(
        `PesticideService search failed: ${error.message}`
      );


    }


  }





  validate(data) {


    if (!data) {


      throw new Error(
        "Pesticide data is required"
      );


    }




    if (!data.name?.trim()) {


      throw new Error(
        "Pesticide name is required"
      );


    }



    return true;


  }



}



export default Object.freeze(

  new PesticideService()

);
