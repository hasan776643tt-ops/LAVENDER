// src/utils/storage.js


// ===============================
// Local Storage Manager
// ===============================


// حفظ بيانات
export const saveData = (
  key,
  data
) => {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return true;

  } catch(error) {

    console.error(
      "Storage Save Error:",
      error
    );

    return false;

  }

};



// ===============================
// قراءة بيانات
// ===============================

export const getData = (
  key,
  defaultValue = []
) => {

  try {

    const data =
      localStorage.getItem(key);


    return data
      ? JSON.parse(data)
      : defaultValue;


  } catch(error) {

    console.error(
      "Storage Read Error:",
      error
    );

    return defaultValue;

  }

};



// ===============================
// حذف بيانات
// ===============================

export const removeData = (
  key
) => {

  localStorage.removeItem(
    key
  );

};



// ===============================
// مسح كل التخزين
// ===============================

export const clearStorage = () => {

  localStorage.clear();

};



// ===============================
// تحديث عنصر
// ===============================

export const updateData = (
  key,
  callback
) => {

  const oldData =
    getData(
      key,
      []
    );


  const newData =
    callback(oldData);


  saveData(
    key,
    newData
  );


  return newData;

};
