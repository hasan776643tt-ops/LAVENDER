// src/services/userService.js


import userRepository
  from "../repositories/userRepository.js";



const success = (
  data,
  message = "Success"
) => ({

  success: true,

  message,

  data

});



const failure = (
  message,
  error = null
) => ({

  success: false,

  message,

  error

});





// جلب جميع المستخدمين

export const getUsersService =
async () => {

  try {

    const users =
      await userRepository.getAll();


    return success(
      users,
      "Users loaded successfully"
    );


  } catch (error) {


    return failure(
      "Failed to load users",
      error.message
    );


  }

};





// جلب مستخدم حسب المعرف

export const getUserByIdService =
async (id) => {

  try {

    const user =
      await userRepository.getById(
        id
      );


    return success(
      user,
      "User loaded successfully"
    );


  } catch (error) {


    return failure(
      "Failed to load user",
      error.message
    );


  }

};





// إنشاء مستخدم جديد

export const createUserService =
async (userData) => {


  try {


    if(
      !userData.name
    ){

      return failure(
        "User name is required"
      );

    }



    const user =
      await userRepository.create(
        userData
      );



    return success(
      user,
      "User created successfully"
    );



  } catch (error) {


    return failure(
      "Failed to create user",
      error.message
    );


  }

};





// تعديل مستخدم

export const updateUserService =
async (
  id,
  userData
) => {


  try {


    const user =
      await userRepository.update(
        id,
        userData
      );



    return success(
      user,
      "User updated successfully"
    );



  } catch (error) {


    return failure(
      "Failed to update user",
      error.message
    );


  }

};





// حذف مستخدم

export const deleteUserService =
async (id) => {


  try {


    await userRepository.delete(
      id
    );



    return success(
      null,
      "User deleted successfully"
    );



  } catch (error) {


    return failure(
      "Failed to delete user",
      error.message
    );


  }

};
