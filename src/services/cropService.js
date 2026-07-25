import cropRepository from "../repositories/cropRepository.js";


// جلب جميع المحاصيل
export const getCropsService = async () => {
  return await cropRepository.getAll();
};


// جلب محصول حسب الرقم
export const getCropByIdService = async (id) => {
  return await cropRepository.getById(id);
};


// إنشاء محصول جديد
export const createCropService = async (data) => {
  return await cropRepository.create(data);
};


// تعديل محصول
export const updateCropService = async (id, data) => {
  return await cropRepository.update(id, data);
};


// حذف محصول
export const deleteCropService = async (id) => {
  return await cropRepository.delete(id);
};
