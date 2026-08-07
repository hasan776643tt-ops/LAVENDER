// src/repositories/farmRepository.js


import {
  storageService
}
from "../storage";



class FarmRepository {


  constructor() {


    this.key =
      "farms";


  }





  async getAll() {


    return storageService.load(

      this.key,

      []

    );


  }





  async getById(id) {


    if (!id) {


      return null;


    }



    const farms =

      await this.getAll();



    return (

      farms.find(

        farm =>

          String(farm.id) === String(id)

      )

      ??

      null

    );


  }





  async create(farmData) {


    const farms =

      await this.getAll();



    const now =

      new Date().toISOString();



    const farm = {


      id:

        crypto.randomUUID(),


      ...farmData,


      createdAt:

        now,


      updatedAt:

        now


    };



    farms.push(farm);



    await storageService.save(

      this.key,

      farms

    );



    return farm;


  }





  async update(
    id,
    data
  ) {


    const farms =

      await this.getAll();



    const index =

      farms.findIndex(

        farm =>

          String(farm.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updatedFarm = {


      ...farms[index],


      ...data,


      id:

        farms[index].id,


      createdAt:

        farms[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    farms[index] =

      updatedFarm;



    await storageService.save(

      this.key,

      farms

    );



    return updatedFarm;


  }





  async delete(id) {


    const farms =

      await this.getAll();



    const filtered =

      farms.filter(

        farm =>

          String(farm.id) !== String(id)

      );



    const deleted =

      filtered.length !== farms.length;



    if (deleted) {


      await storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  async exists(id) {


    return Boolean(

      await this.getById(id)

    );


  }





  async count() {


    const farms =

      await this.getAll();



    return farms.length;


  }


}





const farmRepository =

  new FarmRepository();



export default Object.freeze(

  farmRepository

);
