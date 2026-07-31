// src/services/farmService.js


import storageService
  from "./storageService.js";



class FarmService {


  constructor() {

    this.key =
      "farms";

  }





  getAll() {

    return storageService.load(

      this.key,

      []

    );

  }





  getById(id) {


    if (!id) {

      return null;

    }


    const farms =
      this.getAll();



    return farms.find(

      farm =>

      String(farm.id) === String(id)

    );


  }





  create(data) {


    if (!data) {

      throw new Error(
        "Farm data is required"
      );

    }



    const farms =
      this.getAll();



    const farm = {


      id:
        Date.now(),


      ...data,


      createdAt:
        new Date().toISOString()


    };



    farms.push(
      farm
    );



    storageService.save(

      this.key,

      farms

    );



    return farm;


  }





  update(id,data) {


    const farms =
      this.getAll();



    const index =

      farms.findIndex(

        farm =>

        String(farm.id) === String(id)

      );



    if (index === -1) {


      throw new Error(

        "Farm not found"

      );


    }



    farms[index] = {


      ...farms[index],


      ...data,


      updatedAt:

        new Date().toISOString()


    };



    storageService.save(

      this.key,

      farms

    );



    return farms[index];


  }





  delete(id) {


    const farms =
      this.getAll();



    const exists =

      farms.some(

        farm =>

        String(farm.id) === String(id)

      );



    if (!exists) {


      throw new Error(

        "Farm not found"

      );


    }



    const filtered =

      farms.filter(

        farm =>

        String(farm.id) !== String(id)

      );



    storageService.save(

      this.key,

      filtered

    );



    return true;


  }





  count() {


    return this.getAll().length;


  }





  search(keyword) {


    const farms =
      this.getAll();



    if (!keyword) {

      return farms;

    }



    const search =

      keyword.toLowerCase();



    return farms.filter(

      farm =>

      farm.name

      ?.toLowerCase()

      .includes(search)

    );


  }


}



const farmService =
  new FarmService();



export default Object.freeze(
  farmService
);
