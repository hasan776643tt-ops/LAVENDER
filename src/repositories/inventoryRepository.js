// src/repositories/inventoryRepository.js

import storageService
  from "../services/storageService.js";


class InventoryRepository {


  constructor() {

    this.key = "inventory";

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



    const inventory =
      this.getAll();



    return inventory.find(

      item =>

      String(item.id) === String(id)

    ) || null;


  }





  create(inventoryData) {


    if (!inventoryData) {

      throw new Error(
        "Inventory data is required"
      );

    }



    const inventory =
      this.getAll();



    const item = {


      id:
        Date.now().toString(),


      ...inventoryData,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    inventory.push(
      item
    );



    storageService.save(

      this.key,

      inventory

    );



    return item;


  }





  update(id, data) {


    const inventory =
      this.getAll();



    const index =

      inventory.findIndex(

        item =>

        String(item.id) === String(id)

      );



    if (index === -1) {

      return null;

    }



    const updatedItem = {


      ...inventory[index],


      ...data,


      id:
        inventory[index].id,


      updatedAt:
        new Date().toISOString()


    };



    inventory[index] =
      updatedItem;



    storageService.save(

      this.key,

      inventory

    );



    return updatedItem;


  }





  delete(id) {


    const inventory =
      this.getAll();



    const filtered =

      inventory.filter(

        item =>

        String(item.id) !== String(id)

      );



    const deleted =

      filtered.length !== inventory.length;



    if (deleted) {


      storageService.save(

        this.key,

        filtered

      );


    }



    return deleted;


  }





  exists(id) {


    return Boolean(

      this.getById(id)

    );

  }





  count() {


    return this.getAll().length;


  }





}



export default Object.freeze(

  new InventoryRepository()

);
