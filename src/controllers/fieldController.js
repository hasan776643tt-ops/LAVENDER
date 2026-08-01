// src/controllers/fieldController.js


import fieldService
  from "../services/fieldService.js";





class FieldController {



  constructor() {


    this.service =
      fieldService;


  }








  async getFields(){


    try{


      return await this.service.getAll();



    }catch(error){


      throw new Error(

        `FieldController getFields failed: ${error.message}`

      );


    }


  }








  async getFieldById(id){


    try{


      return await this.service.getById(

        id

      );



    }catch(error){


      throw new Error(

        `FieldController getFieldById failed: ${error.message}`

      );


    }


  }








  async createField(fieldData){


    try{


      return await this.service.create(

        fieldData

      );



    }catch(error){


      throw new Error(

        `FieldController createField failed: ${error.message}`

      );


    }


  }








  async updateField(
    id,
    fieldData
  ){


    try{


      return await this.service.update(

        id,

        fieldData

      );



    }catch(error){


      throw new Error(

        `FieldController updateField failed: ${error.message}`

      );


    }


  }








  async deleteField(id){


    try{


      return await this.service.delete(

        id

      );



    }catch(error){


      throw new Error(

        `FieldController deleteField failed: ${error.message}`

      );


    }


  }








  async countFields(){


    try{


      return await this.service.count();



    }catch(error){


      throw new Error(

        `FieldController countFields failed: ${error.message}`

      );


    }


  }





}





export default Object.freeze(

  new FieldController()

);
