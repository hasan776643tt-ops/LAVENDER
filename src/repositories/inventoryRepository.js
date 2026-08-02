
// src/repositories/inventoryRepository.js


import storageService
from "../services/storageService.js";



class InventoryRepository {



constructor(){

  this.key =
  "inventory";

}




async getAll(){

  return storageService.load(
    this.key,
    []
  );

}




async getById(id){


  if(!id){

    return null;

  }



  const inventory =
  await this.getAll();



  return (
    inventory.find(

      item =>

      String(item.id)
      ===
      String(id)

    )
    || null
  );


}




async create(inventoryData){


  if(!inventoryData){

    throw new Error(
      "Inventory data is required"
    );

  }



  const inventory =
  await this.getAll();



  const item = {


    id:
    Date.now().toString(),


    ...inventoryData,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  inventory.push(item);



  storageService.save(

    this.key,

    inventory

  );



  return item;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Inventory id is required"
    );

  }



  const inventory =
  await this.getAll();



  const index =
  inventory.findIndex(

    item =>

    String(item.id)
    ===
    String(id)

  );



  if(index === -1){

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




async delete(id){


  const inventory =
  await this.getAll();



  const filtered =
  inventory.filter(

    item =>

    String(item.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== inventory.length;



  if(deleted){


    storageService.save(

      this.key,

      filtered

    );


  }



  return deleted;


}




async exists(id){

  return Boolean(
    await this.getById(id)
  );

}




async count(){


  const inventory =
  await this.getAll();


  return inventory.length;


}



}



export default Object.freeze(
  new InventoryRepository()
);
