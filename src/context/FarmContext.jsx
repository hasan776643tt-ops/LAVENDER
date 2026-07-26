import {
  createContext,
  useState,
  useEffect,
} from "react";


// إنشاء Context

export const FarmContext =
  createContext();



// قراءة البيانات

const loadData = (key, defaultValue = []) => {

  try {

    const saved =
      localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : defaultValue;

  } catch (error) {

    console.error(
      "Storage Error:",
      error
    );

    return defaultValue;

  }

};



// إنشاء رقم معرف

const createId = () => {

  return (
    Date.now() +
    Math.random()
      .toString(16)
      .slice(2)
  );

};



// إضافة بيانات

const addItem = (
  setter,
  item
) => {

  setter((prev) => [

    ...prev,

    {
      id: createId(),

      createdAt:
        new Date()
        .toISOString(),

      updatedAt:
        new Date()
        .toISOString(),

      ...item,
    }

  ]);

};



// حذف بيانات

const removeItem = (
  setter,
  id
) => {

  setter((prev) =>
    prev.filter(
      item =>
        item.id !== id
    )
  );

};



// تحديث بيانات

const updateItem = (
  setter,
  id,
  data
) => {

  setter((prev) =>

    prev.map(item =>

      item.id === id

      ?

      {

        ...item,

        ...data,

        updatedAt:
          new Date()
          .toISOString()

      }

      :

      item

    )

  );

};





export default function FarmProvider({

  children

}) {



  const [farms,setFarms] =
    useState(() =>
      loadData("farms")
    );


  const [fields,setFields] =
    useState(() =>
      loadData("fields")
    );


  const [crops,setCrops] =
    useState(() =>
      loadData("crops")
    );


  const [irrigations,setIrrigations] =
    useState(() =>
      loadData("irrigations")
    );


  const [fertilizers,setFertilizers] =
    useState(() =>
      loadData("fertilizers")
    );


  const [pesticides,setPesticides] =
    useState(() =>
      loadData("pesticides")
    );


  const [diseases,setDiseases] =
    useState(() =>
      loadData("diseases")
    );


  const [expenses,setExpenses] =
    useState(() =>
      loadData("expenses")
    );


  const [locations,setLocations] =
    useState(() =>
      loadData("locations")
    );


  const [users,setUsers] =
    useState(() =>
      loadData("users")
    );


  const [consultations,setConsultations] =
    useState(() =>
      loadData("consultations")
    );


  const [aiQuestions,setAiQuestions] =
    useState(() =>
      loadData("aiQuestions")
    );


  const [settings,setSettings] =
    useState(() =>
      loadData(
        "settings",
        {
          theme:"light",
          language:"ar",
          notifications:true
        }
      )
    );





  // حفظ تلقائي

  useEffect(() => {


    const data = {

      farms,

      fields,

      crops,

      irrigations,

      fertilizers,

      pesticides,

      diseases,

      expenses,

      locations,

      users,

      consultations,

      aiQuestions,

      settings,

    };


    Object.entries(data)
      .forEach(([key,value]) => {


        localStorage.setItem(

          key,

          JSON.stringify(value)

        );


      });


  },[

    farms,

    fields,

    crops,

    irrigations,

    fertilizers,

    pesticides,

    diseases,

    expenses,

    locations,

    users,

    consultations,

    aiQuestions,

    settings

  ]);





  return (

    <FarmContext.Provider

      value={{

        // البيانات

        farms,
        fields,
        crops,
        irrigations,
        fertilizers,
        pesticides,
        diseases,
        expenses,
        locations,
        users,
        consultations,
        aiQuestions,
        settings,



        // التحكم

        setFarms,
        setFields,
        setCrops,
        setIrrigations,
        setFertilizers,
        setPesticides,
        setDiseases,
        setExpenses,
        setLocations,
        setUsers,
        setConsultations,
        setAiQuestions,
        setSettings,



        // أدوات جاهزة

        addFarm:
          (data)=>
          addItem(
            setFarms,
            data
          ),


        deleteFarm:
          (id)=>
          removeItem(
            setFarms,
            id
          ),


        updateFarm:
          (id,data)=>
          updateItem(
            setFarms,
            id,
            data
          ),



        addExpense:
          (data)=>
          addItem(
            setExpenses,
            data
          ),


        deleteExpense:
          (id)=>
          removeItem(
            setExpenses,
            id
          ),


        updateExpense:
          (id,data)=>
          updateItem(
            setExpenses,
            id,
            data
          ),



      }}

    >

      {children}

    </FarmContext.Provider>

  );


}
