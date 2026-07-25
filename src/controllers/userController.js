import * as userRepository from "../repositories/userRepository";

export const getUsers = () => {
  return userRepository.getUsers();
};

export const getUserById = (id) => {
  return userRepository.getUserById(id);
};

export const createUser = (userData) => {
  return userRepository.createUser(userData);
};

export const updateUser = (id, userData) => {
  return userRepository.updateUser(id, userData);
};

export const deleteUser = (id) => {
  return userRepository.deleteUser(id);
};
