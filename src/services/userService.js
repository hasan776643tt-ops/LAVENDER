import userRepository from "../repositories/userRepository.js";


// جلب المستخدمين
export const getUsersService = async () => {
  return await userRepository.getAll();
};


// جلب مستخدم حسب الرقم
export const getUserByIdService = async (id) => {
  return await userRepository.getById(id);
};


// إنشاء مستخدم
export const createUserService = async (data) => {
  return await userRepository.create(data);
};


// تعديل مستخدم
export const updateUserService = async (id, data) => {
  return await userRepository.update(id, data);
};


// حذف مستخدم
export const deleteUserService = async (id) => {
  return await userRepository.delete(id);
};
