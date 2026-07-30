// src/controllers/userController.js

import userRepository from "../repositories/userRepository.js";


class UserController {


  constructor() {

    this.repository = userRepository;

  }



  async getUsers() {

    try {

      return await this.repository.getAll();

    } catch (error) {

      throw new Error(
        `UserController getUsers failed: ${error.message}`
      );

    }

  }




  async getUserById(id) {

    try {

      if (!id) {

        throw new Error(
          "User ID is required"
        );

      }


      const user =
        await this.repository.getById(id);


      if (!user) {

        throw new Error(
          "User not found"
        );

      }


      return user;


    } catch (error) {

      throw new Error(
        `UserController getUserById failed: ${error.message}`
      );

    }

  }




  async createUser(userData) {

    try {

      this.validateUser(userData);


      return await this.repository.create(
        userData
      );


    } catch (error) {

      throw new Error(
        `UserController createUser failed: ${error.message}`
      );

    }

  }




  async updateUser(id, userData) {

    try {

      if (!id) {

        throw new Error(
          "User ID is required"
        );

      }


      this.validateUser(userData);


      const user =
        await this.repository.update(
          id,
          userData
        );


      if (!user) {

        throw new Error(
          "User not found"
        );

      }


      return user;


    } catch (error) {

      throw new Error(
        `UserController updateUser failed: ${error.message}`
      );

    }

  }




  async deleteUser(id) {

    try {

      if (!id) {

        throw new Error(
          "User ID is required"
        );

      }


      const exists =
        await this.repository.exists(id);


      if (!exists) {

        throw new Error(
          "User not found"
        );

      }


      await this.repository.delete(id);


      return {

        success: true,

        message:
          "User deleted successfully"

      };


    } catch (error) {

      throw new Error(
        `UserController deleteUser failed: ${error.message}`
      );

    }

  }




  async countUsers() {

    try {

      return await this.repository.count();

    } catch (error) {

      throw new Error(
        `UserController countUsers failed: ${error.message}`
      );

    }

  }




  validateUser(user) {

    if (!user) {

      throw new Error(
        "User data is required"
      );

    }


    if (!user.name?.trim()) {

      throw new Error(
        "User name is required"
      );

    }


    if (!user.email?.trim()) {

      throw new Error(
        "User email is required"
      );

    }


    return true;

  }


}


export default Object.freeze(
  new UserController()
);
