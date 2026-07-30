import userRepository from "../repositories/userRepository.js";

class UserController {

  async getUsers() {
    try {
      return await userRepository.getAll();

    } catch (error) {
      throw new Error(
        `Failed to get users: ${error.message}`
      );
    }
  }


  async getUserById(id) {
    try {

      const user =
        await userRepository.getById(id);

      if (!user) {
        throw new Error(
          "User not found"
        );
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

      return await userRepository.create(
        userData
      );

    } catch (error) {
      throw new Error(
        `Failed to create user: ${error.message}`
      );
    }
  }


  async updateUser(
    id,
    userData
  ) {
    try {

      const user =
        await userRepository.update(
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
        `Failed to update user: ${error.message}`
      );
    }
  }


  async deleteUser(id) {
    try {

      const deleted =
        await userRepository.delete(id);

      if (!deleted) {
        throw new Error(
          "User not found"
        );
      }

      return {
        success: true,
        message:
          "User deleted successfully"
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
