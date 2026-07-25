import userRepository from "../repositories/userRepository.js";


// جلب جميع المستخدمين
export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAll();

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب المستخدمين",
      error: error.message
    });
  }
};


// جلب مستخدم واحد
export const getUserById = async (req, res) => {
  try {
    const user = await userRepository.getById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "المستخدم غير موجود"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ",
      error: error.message
    });
  }
};


// إنشاء مستخدم جديد
export const createUser = async (req, res) => {
  try {
    const user = await userRepository.create(req.body);

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء المستخدم",
      error: error.message
    });
  }
};


// تعديل مستخدم
export const updateUser = async (req, res) => {
  try {
    const user = await userRepository.update(
      req.params.id,
      req.body
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء تعديل المستخدم",
      error: error.message
    });
  }
};


// حذف مستخدم
export const deleteUser = async (req, res) => {
  try {
    await userRepository.delete(req.params.id);

    res.json({
      message: "تم حذف المستخدم بنجاح"
    });

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء حذف المستخدم",
      error: error.message
    });
  }
};
