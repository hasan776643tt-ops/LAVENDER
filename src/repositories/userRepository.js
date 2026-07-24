import { userService } from "../api/userService";

class UserRepository {
  getAll() {
    return userService.getUsers();
  }

  getById(id) {
    return this.getAll().find(user => user.id === id) || null;
  }

  create(user) {
    userService.addUser(user);
    return user;
  }

  update(id, data) {
    userService.updateUser(id, data);
    return this.getById(id);
  }

  delete(id) {
    userService.deleteUser(id);
    return true;
  }
}

export const userRepository = new UserRepository();
