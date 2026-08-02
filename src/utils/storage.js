// src/utils/storage.js


// ===============================
// LAVENDER Storage Manager
// ===============================


const PREFIX =
  "lavender_";




// ===============================
// Create Storage Key
// ===============================

const createKey = (key) => {

  return PREFIX + key;

};




// ===============================
// Save Data
// حفظ البيانات
// ===============================

export const saveData = (
  key,
  data
) => {

  try {

    if(
      typeof localStorage === "undefined"
    ){

      return false;

    }


    localStorage.setItem(

      createKey(key),

      JSON.stringify(data)

    );


    return true;


  } catch(error) {


    console.error(
      "LAVENDER Storage Save Error:",
      error
    );


    return false;

  }

};




// ===============================
// Get Data
// قراءة البيانات
// ===============================

export const getData = (

  key,

  defaultValue = null

) => {


  try {


    if(
      typeof localStorage === "undefined"
    ){

      return defaultValue;

    }



    const data =

      localStorage.getItem(
        createKey(key)
      );



    return data

      ? JSON.parse(data)

      : defaultValue;



  } catch(error) {


    console.error(
      "LAVENDER Storage Read Error:",
      error
    );


    return defaultValue;


  }

};




// ===============================
// Remove Data
// حذف بيانات
// ===============================

export const removeData = (
  key
) => {


  if(
    typeof localStorage !== "undefined"
  ){

    localStorage.removeItem(
      createKey(key)
    );

  }

};




// ===============================
// Clear LAVENDER Storage
// مسح بيانات التطبيق فقط
// ===============================

export const clearStorage = () => {


  if(
    typeof localStorage === "undefined"
  ){

    return;

  }



  Object.keys(
    localStorage
  )
  .filter(
    key =>
    key.startsWith(PREFIX)
  )
  .forEach(
    key =>
    localStorage.removeItem(key)
  );


};




// ===============================
// Update Data
// تحديث بيانات
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
