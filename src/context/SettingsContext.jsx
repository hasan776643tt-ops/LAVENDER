// src/context/SettingsContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";


// =========================
// Context
// =========================

const SettingsContext =
  createContext(null);



// =========================
// Default Settings
// =========================

const defaultSettings =
Object.freeze({

  language: "ar",

  country: "SY",

  currency: "SYP",

  areaUnit: "دونم",

  weightUnit: "كغ",

  waterUnit: "لتر",

  theme: "light",

  notifications: true,

  gps: true

});



// =========================
// Provider
// =========================

export function SettingsProvider({
  children
}) {


const [settings,setSettings] =
useState(()=>{


  try {


    const saved =
      localStorage.getItem(
        "lavender-settings"
      );


    return saved
      ? JSON.parse(saved)
      : defaultSettings;


  } catch(error) {


    return defaultSettings;


  }


});




// =========================
// Save Settings
// =========================

useEffect(()=>{


 try {


  localStorage.setItem(

    "lavender-settings",

    JSON.stringify(settings)

  );


 } catch(error) {


  console.error(
    "Settings storage failed:",
    error
  );


 }


},[settings]);




// =========================
// Actions
// =========================


const updateSetting =
(
 key,
 value
)=>{


 setSettings(
  previous => ({

    ...previous,

    [key]: value

  })
 );


};




const updateSettings =
(newSettings)=>{


 setSettings(
  previous => ({

    ...previous,

    ...newSettings

  })
 );


};





const resetSettings =
()=>{


 setSettings(
  defaultSettings
 );


};




// =========================
// Context Value
// =========================

const value = {

 settings,

 updateSetting,

 updateSettings,

 resetSettings

};





return (

<SettingsContext.Provider
 value={value}
>

{children}

</SettingsContext.Provider>

);


}



// =========================
// Hook
// =========================

export function useSettings(){


const context =
useContext(SettingsContext);



if(!context){


 throw new Error(
  "useSettings must be used inside SettingsProvider"
 );


}



return context;


}
