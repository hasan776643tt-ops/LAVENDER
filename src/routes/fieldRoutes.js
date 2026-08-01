// src/routes/fieldRoutes.js


import fieldController
  from "../controllers/fieldController.js";





class FieldRoutes {



  constructor(){


    this.controller =
      fieldController;


  }








  async getFields(){


    try{


      return await this.controller.getFields();



    }catch(error){


      throw new Error(

        `FieldRoutes getFields failed: ${error.message}`

      );


    }


  }








  async getFieldById(id){


    try{


      return await this.controller.getFieldById(

        id

      );



    }catch(error){


      throw new Error(

        `FieldRoutes getFieldById failed: ${error.message}`

      );


    }


  }








  async createField(data){


    try{


      return await this.controller.createField(

        data

      );



    }catch(error){


      throw new Error(

        `FieldRoutes createField failed: ${error.message}`

      );


    }


  }








  async updateField(id,data){


    try{


      return await this.controller.updateField(

        id,

        data

      );



    }catch(error){


      throw new Error(

        `FieldRoutes updateField failed: ${error.message}`

      );


    }


  }








  async deleteField(id){


    try{


      return await this.controller.deleteField(

        id

      );



    }catch(error){


      throw new Error(

        `FieldRoutes deleteField failed: ${error.message}`

      );


    }


  }



}





export default Object.freeze(

  new FieldRoutes()

);
