import farmRepository from "../repositories/farmRepository.js";


// جلب جميع المزارع
export const getFarmsService = async () => {
  return await farmRepository.getAll();
};


// جلب مزرعة حسب الرقم
export const getFarmByIdService = async (id) => {
  return await farmRepository.getById(id);
};


// إنشاء مزرعة جديدة
export const createFarmService = async (data) => {
  return await farmRepository.create(data);
};


// تعديل مزرعة
export const updateFarmService = async (id, data) => {
  return await farmRepository.update(id, data);
};


// حذف مزرعة
export const deleteFarmService = async (id) => {
  return await farmRepository.delete(id);
};
