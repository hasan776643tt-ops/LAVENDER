// src/repositories/userRepository.js


import storageService
  from "../services/storageService.js";



class UserRepository {


  constructor() {

    this.key =
      "users";

  }



  async getAll() {

    try {

      return storageService.load(
        this.key,
        []
      );


    } catch(error) {

      throw new Error(
        `USER_GET_ALL_FAILED: ${error.message}`
      );

    }

  }



  async getById(id) {


    if (!id) {

      return null;

    }


    const users =
      await this.getAll();


    return users.find(

      user =>

      String(user.id) === String(id)

    ) || null;


  }



  async findByEmail(email) {


    if (!email) {

      return null;

    }


    const users =
      await this.getAll();


    return users.find(

      user =>

      user.email?.toLowerCase() ===
      email.toLowerCase()

    ) || null;


  }



  async create(data) {


    const users =
      await this.getAll();



    const user = {


      id:
        Date.now().toString(),


      ...data,


      createdAt:
        new Date().toISOString(),


      updatedAt:
        new Date().toISOString()


    };



    users.push(user);



    storageService.save(

      this.key,

      users

    );



    return user;


  }



  async update(id, data) {


    if (!id) {

      throw new Error(
        "USER_ID_REQUIRED"
      );

    }



    const users =
      await this.getAll();



    const index =
      users.findIndex(

        user =>

        String(user.id) === String(id)

      );



    if (index === -1) {

      return null;

    }



    const updatedUser = {


      ...users[index],


      ...data,


      id:
        users[index].id,


      updatedAt:
        new Date().toISOString()


    };



    users[index] =
      updatedUser;



    storageService.save(

      this.key,

      users

    );



    return updatedUser;


  }



  async delete(id) {


    if (!id) {

      return false;

    }



    const users =
      await this.getAll();



    const filtered =
      users.filter(

        user =>

        String(user.id) !== String(id)

      );



    const deleted =
      filtered.length !== users.length;



    if (deleted) {

      storageService.save(

        this.key,

        filtered

      );

    }



    return deleted;


  }



  async exists(id) {


    const user =
      await this.getById(id);



    return Boolean(user);


  }



  async count() {


    const users =
      await this.getAll();



    return users.length;


  }


}



export default Object.freeze(

  new UserRepository()

);
