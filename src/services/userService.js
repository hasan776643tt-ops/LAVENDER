import * as userRepository from "../repositories/userRepository";

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

export const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

export const createUser = async (userData) => {
  return await userRepository.createUser(userData);
};

export const updateUser = async (id, userData) => {
  return await userRepository.updateUser(id, userData);
};

export const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};
