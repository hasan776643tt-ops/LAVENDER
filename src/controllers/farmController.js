// src/controllers/farmController.js

import farmService
from "../services/farmService.js";



class FarmController {


constructor(){

 this.service =
 farmService;

}




async getAll(){

 try{

  return await this.service.getAll();

 }catch(error){

  throw new Error(
   `FarmController getAll failed: ${error.message}`
  );

 }

}




async getById(id){

 try{

  return await this.service.getById(id);

 }catch(error){

  throw new Error(
   `FarmController getById failed: ${error.message}`
  );

 }

}




async create(data){

 try{

  return await this.service.create(data);

 }catch(error){

  throw new Error(
   `FarmController create failed: ${error.message}`
  );

 }

}




async update(id,data){

 try{

  return await this.service.update(
   id,
   data
  );

 }catch(error){

  throw new Error(
   `FarmController update failed: ${error.message}`
  );

 }

}




async remove(id){

 try{

  return await this.service.delete(id);

 }catch(error){

  throw new Error(
   `FarmController remove failed: ${error.message}`
  );

 }

}




async count(){

 try{

  return await this.service.count();

 }catch(error){

  throw new Error(
   `FarmController count failed: ${error.message}`
  );

 }

}



}



export default Object.freeze(
 new FarmController()
);
