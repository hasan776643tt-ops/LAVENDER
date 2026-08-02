
// src/repositories/diseaseRepository.js


import storageService
from "../services/storageService.js";



class DiseaseRepository {



constructor(){

  this.key =
  "diseases";

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



  const diseases =
  await this.getAll();



  return (
    diseases.find(

      disease =>

      String(disease.id)
      ===
      String(id)

    )
    || null
  );


}




async create(data){


  if(!data){

    throw new Error(
      "Disease data is required"
    );

  }



  const diseases =
  await this.getAll();



  const disease = {


    id:
    Date.now().toString(),


    ...data,


    createdAt:
    new Date().toISOString(),


    updatedAt:
    new Date().toISOString()


  };



  diseases.push(
    disease
  );



  storageService.save(

    this.key,

    diseases

  );



  return disease;


}




async update(id,data){


  if(!id){

    throw new Error(
      "Disease id is required"
    );

  }



  const diseases =
  await this.getAll();



  const index =
  diseases.findIndex(

    disease =>

    String(disease.id)
    ===
    String(id)

  );



  if(index === -1){

    return null;

  }




  const updated = {


    ...diseases[index],


    ...data,


    id:
    diseases[index].id,


    updatedAt:
    new Date().toISOString()


  };



  diseases[index] =
  updated;



  storageService.save(

    this.key,

    diseases

  );



  return updated;


}




async delete(id){


  const diseases =
  await this.getAll();



  const filtered =
  diseases.filter(

    disease =>

    String(disease.id)
    !==
    String(id)

  );



  const deleted =
  filtered.length !== diseases.length;



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


  const diseases =
  await this.getAll();


  return diseases.length;


}



}



export default Object.freeze(
  new DiseaseRepository()
);
