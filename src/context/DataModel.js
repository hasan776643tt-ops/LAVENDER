/* =================================
   LAVENDER Smart Farm
   Global Data Model
================================= */


// إنشاء رقم معرف موحد

export const createId = () =>
  Date.now();



// تاريخ التحديث

export const createTimestamp = () =>
  new Date().toISOString();




// النموذج الرئيسي للبيانات

export const DataModel = {


  // معلومات النظام

  system: {

    appName:
      "LAVENDER Smart Farm",

    version:
      "1.0.0",

    createdAt:
      createTimestamp(),

    updatedAt:
      createTimestamp()

  },




  // المستخدمون

  users: [],



  // المزارع

  farms: [],



  // الحقول

  fields: [],



  // المحاصيل

  crops: [],



  // الري

  irrigations: [],



  // التسميد

  fertilizers: [],



  // المبيدات

  pesticides: [],



  // الأمراض الزراعية

  diseases: [],



  // الطقس

  weather: [],



  // المهندسون الزراعيون

  engineers: [],



  // الاستشارات

  consultations: [],



  // المصاريف

  expenses: [],



  // التقارير

  reports: [],



  // الإعدادات

  settings: {

    language:
      "ar",

    theme:
      "light",

    notifications:
      true

  },



  // الذكاء الاصطناعي

  ai: {

    enabled:
      true,

    recommendations: [],

    lastAnalysis:
      ""

  },



  // سجل العمليات

  logs: []

};





// إضافة عنصر لأي قسم

export const addItem = (
  collection,
  item
)=>{

  return [

    ...collection,

    {

      id:
        createId(),

      createdAt:
        createTimestamp(),

      ...item

    }

  ];

};





// حذف عنصر

export const removeItem = (
  collection,
  id
)=>{

  return collection.filter(
    item =>
      item.id !== id
  );

};





// تحديث عنصر

export const updateItem = (
  collection,
  id,
  updates
)=>{

  return collection.map(
    item =>

      item.id === id

      ?

      {

        ...item,

        ...updates,

        updatedAt:
          createTimestamp()

      }

      :

      item

  );

};
