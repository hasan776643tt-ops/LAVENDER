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
        `Failed to get users: ${error.message}`
      );
    }
  }


  async getUserById(id) {
    try {

      const user =
        await this.repository.getById(id);

      if (!user) {
        throw new Error("User not found");
      }

      return user;

    } catch (error) {
      throw new Error(
        `Failed to get user: ${error.message}`
      );
    }
  }


  async createUser(userData) {
    try {

      return await this.repository.create(
        userData
      );

    } catch (error) {
      throw new Error(
        `Failed to create user: ${error.message}`
      );
    }
  }


  async updateUser(id, userData) {
    try {

      const user =
        await this.repository.update(
          id,
          userData
        );

      if (!user) {
        throw new Error("User not found");
      }

      return user;

    } catch (error) {
      throw new Error(
        `Failed to update user: ${error.message}`
      );
    }
  }


  async deleteUser(id) {
    try {

      const deleted =
        await this.repository.delete(id);

      if (!deleted) {
        throw new Error("User not found");
      }

      return {
        success: true,
        message: "User deleted successfully"
      };

    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error.message}`
      );
    }
  }

}


export default Object.freeze(
  new UserController()
);
