// src/services/userService.js

import userRepository
  from "../repositories/userRepository.js";


import userValidator
  from "../validators/userValidator.js";


class UserService {


  constructor() {

    this.repository =
      userRepository;


    this.validator =
      userValidator;

  }


  async getAll() {

    return this.repository.getAll();

  }


  async getById(id) {

    if (!id) {

      throw new Error(
        "USER_ID_REQUIRED"
      );

    }


    const user =
      await this.repository.getById(id);


    if (!user) {

      throw new Error(
        "USER_NOT_FOUND"
      );

    }


    return user;

  }


  async create(data) {

    this.validator.validate(
      data
    );


    return this.repository.create(
      data
    );

  }


  async update(id, data) {

    if (!id) {

      throw new Error(
        "USER_ID_REQUIRED"
      );

    }


    this.validator.validate(
      data
    );


    const updated =
      await this.repository.update(
        id,
        data
      );


    if (!updated) {

      throw new Error(
        "USER_NOT_FOUND"
      );

    }


    return updated;

  }


  async delete(id) {

    if (!id) {

      throw new Error(
        "USER_ID_REQUIRED"
      );

    }


    const deleted =
      await this.repository.delete(id);


    if (!deleted) {

      throw new Error(
        "USER_NOT_FOUND"
      );

    }


    return true;

  }


  async exists(id) {

    if (!id) {

      return false;

    }


    const user =
      await this.repository.getById(id);


    return Boolean(user);

  }


  async count() {

    const users =
      await this.repository.getAll();


    return users.length;

  }


}


export default Object.freeze(
  new UserService()
);
