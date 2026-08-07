// src/repositories/inventoryRepository.js


import {
  storageService
}
from "../storage";


import {
  createError
}
from "../utils/errorHandler.js";



class InventoryRepository {


  constructor() {

    this.key =
      "inventory";

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



    const items =

      await this.getAll();



    return (

      items.find(

        item =>

          String(item.id) === String(id)

      )

      ??

      null

    );


  }





  async create(data) {


    if (!data) {


      throw createError(

        "Inventory data is required",

        "INVENTORY_DATA_REQUIRED"

      );


    }



    const items =

      await this.getAll();



    const now =

      new Date().toISOString();



    const item = {


      id:

        crypto.randomUUID(),


      ...data,


      createdAt:

        now,


      updatedAt:

        now


    };



    items.push(item);



    await storageService.save(

      this.key,

      items

    );



    return item;


  }





  async update(
    id,
    changes
  ) {


    if (!id) {


      return null;


    }



    const items =

      await this.getAll();



    const index =

      items.findIndex(

        item =>

          String(item.id) === String(id)

      );



    if (index === -1) {


      return null;


    }



    const updatedItem = {


      ...items[index],


      ...changes,


      id:

        items[index].id,


      createdAt:

        items[index].createdAt,


      updatedAt:

        new Date().toISOString()


    };



    items[index] =

      updatedItem;



    await storageService.save(

      this.key,

      items

    );



    return updatedItem;


  }





  async delete(id) {


    if (!id) {


      return false;


    }



    const items =

      await this.getAll();



    const filtered =

      items.filter(

        item =>

          String(item.id) !== String(id)

      );



    const deleted =

      filtered.length !== items.length;



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


    const items =

      await this.getAll();



    return items.length;


  }


}





const inventoryRepository =

  new InventoryRepository();



export default Object.freeze(

  inventoryRepository

);
