// src/repositories/userRepository.js

import storageService
  from "../services/storageService.js";


class UserRepository {


  constructor(){

    this.key =
      "users";

  }




  getAll(){

    return storageService.load(
      this.key,
      []
    );

  }




  getById(id){

    return this.getAll().find(
      user =>
        user.id === id
    ) || null;

  }




  create(user){

    const users =
      this.getAll();


    users.push(
      user
    );


    storageService.save(
      this.key,
      users
    );


    return user;

  }




  update(
    id,
    data
  ){

    const users =
      this.getAll();


    const index =
      users.findIndex(
        user =>
          user.id === id
      );


    if(index === -1){

      return null;

    }


    users[index] = {

      ...users[index],

      ...data,

      updatedAt:
        new Date().toISOString()

    };


    storageService.save(
      this.key,
      users
    );


    return users[index];

  }




  delete(id){

    const users =
      this.getAll();


    const filtered =
      users.filter(
        user =>
          user.id !== id
      );


    storageService.save(
      this.key,
      filtered
    );


    return true;

  }




  exists(id){

    return this.getAll().some(
      user =>
        user.id === id
    );

  }




  count(){

    return this.getAll().length;

  }


}


export const userRepository =
  new UserRepository();


export default userRepository;
