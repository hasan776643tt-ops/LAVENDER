// src/services/diseaseService.js


import diseaseRepository
  from "../repositories/diseaseRepository.js";



class DiseaseService {



  constructor() {

    this.repository =
      diseaseRepository;

  }





  async getAll() {


    try {


      return await this.repository.getAll();



    } catch(error) {


      throw new Error(
        `DiseaseService getAll failed: ${error.message}`
      );


    }


  }





  async getById(id) {


    try {


      if (!id) {


        throw new Error(
          "Disease ID is required"
        );


      }



      const disease =

        await this.repository.getById(id);




      if (!disease) {


        throw new Error(
          "Disease not found"
        );


      }




      return disease;



    } catch(error) {


      throw new Error(
        `DiseaseService getById failed: ${error.message}`
      );


    }


  }





  async create(data) {


    try {


      this.validateDisease(data);



      return await this.repository.create(
        data
      );



    } catch(error) {


      throw new Error(
        `DiseaseService create failed: ${error.message}`
      );


    }


  }





  async update(id,data) {


    try {


      if (!id) {


        throw new Error(
          "Disease ID is required"
        );


      }



      this.validateDisease(data);



      const disease =

        await this.repository.update(
          id,
          data
        );




      if (!disease) {


        throw new Error(
          "Disease not found"
        );


      }




      return disease;



    } catch(error) {


      throw new Error(
        `DiseaseService update failed: ${error.message}`
      );


    }


  }





  async delete(id) {


    try {


      if (!id) {


        throw new Error(
          "Disease ID is required"
        );


      }




      const exists =

        await this.repository.exists(id);




      if (!exists) {


        throw new Error(
          "Disease not found"
        );


      }




      await this.repository.delete(id);



      return {


        success:true,


        message:
          "Disease deleted successfully"


      };



    } catch(error) {


      throw new Error(
        `DiseaseService delete failed: ${error.message}`
      );


    }


  }





  async count() {


    try {


      return await this.repository.count();



    } catch(error) {


      throw new Error(
        `DiseaseService count failed: ${error.message}`
      );


    }


  }





  async search(keyword) {


    try {


      const diseases =

        await this.repository.getAll();




      if (!keyword) {


        return diseases;


      }




      const search =

        keyword.toLowerCase();




      return diseases.filter(

        disease =>


          disease.name
          ?.toLowerCase()
          .includes(search)


          ||

          disease.crop
          ?.toLowerCase()
          .includes(search)


          ||

          disease.category
          ?.toLowerCase()
          .includes(search)


          ||

          disease.symptoms
          ?.toLowerCase()
          .includes(search)


      );



    } catch(error) {


      throw new Error(
        `DiseaseService search failed: ${error.message}`
      );


    }


  }





  validateDisease(data) {


    if (!data) {


      throw new Error(
        "Disease data is required"
      );


    }




    if (!data.name?.trim()) {


      throw new Error(
        "Disease name is required"
      );


    }



    return true;


  }



}



export default Object.freeze(

  new DiseaseService()

);
