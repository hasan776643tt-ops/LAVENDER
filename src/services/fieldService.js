import fieldRepository from "../repositories/fieldRepository.js";


// جلب جميع الحقول
export const getFieldsService = async () => {
  return await fieldRepository.getAll();
};


// جلب حقل حسب الرقم
export const getFieldByIdService = async (id) => {
  return await fieldRepository.getById(id);
};


// إنشاء حقل جديد
export const createFieldService = async (data) => {
  return await fieldRepository.create(data);
};


// تعديل حقل
export const updateFieldService = async (id, data) => {
  return await fieldRepository.update(id, data);
};


// حذف حقل
export const deleteFieldService = async (id) => {
  return await fieldRepository.delete(id);
};
