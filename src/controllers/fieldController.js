import fieldRepository from "../repositories/fieldRepository.js";


// جلب كل الحقول
export const getFields = async (req, res) => {
  try {
    const fields = await fieldRepository.getAll();

    res.json(fields);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الحقول",
      error: error.message
    });
  }
};


// جلب حقل واحد
export const getFieldById = async (req, res) => {
  try {
    const field = await fieldRepository.getById(req.params.id);

    if (!field) {
      return res.status(404).json({
        message: "الحقل غير موجود"
      });
    }

    res.json(field);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ",
      error: error.message
    });
  }
};


// إنشاء حقل جديد
export const createField = async (req, res) => {
  try {
    const field = await fieldRepository.create(req.body);

    res.status(201).json(field);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الحقل",
      error: error.message
    });
  }
};


// تعديل حقل
export const updateField = async (req, res) => {
  try {
    const field = await fieldRepository.update(
      req.params.id,
      req.body
    );

    res.json(field);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء تعديل الحقل",
      error: error.message
    });
  }
};


// حذف حقل
export const deleteField = async (req, res) => {
  try {
    await fieldRepository.delete(req.params.id);

    res.json({
      message: "تم حذف الحقل بنجاح"
    });

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء حذف الحقل",
      error: error.message
    });
  }
};
