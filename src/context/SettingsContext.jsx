// src/context/SettingsContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";


// =========================
// Constants
// =========================

const STORAGE_KEY =
  "lavender-settings";


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

    areaUnit: "dunum",

    weightUnit: "kg",

    waterUnit: "liter",

    theme: "light",

    notifications: true,

    gps: true

  });


// =========================
// Normalize Saved Settings
// =========================

function normalizeSettings(saved) {

  if (!saved || typeof saved !== "object") {
    return { ...defaultSettings };
  }

  return {

    ...defaultSettings,

    ...saved,

    areaUnit:
      saved.areaUnit === "دونم"
        ? "dunum"
        : saved.areaUnit || defaultSettings.areaUnit,

    weightUnit:
      saved.weightUnit === "كغ"
        ? "kg"
        : saved.weightUnit || defaultSettings.weightUnit,

    waterUnit:
      saved.waterUnit === "لتر"
        ? "liter"
        : saved.waterUnit || defaultSettings.waterUnit

  };

}


// =========================
// Load Settings
// =========================

function loadSettings() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return { ...defaultSettings };
    }

    return normalizeSettings(
      JSON.parse(saved)
    );

  } catch (error) {

    console.error(
      "Settings loading failed:",
      error
    );

    return { ...defaultSettings };

  }

}


// =========================
// Provider
// =========================

export function SettingsProvider({
  children
}) {

  const [settings, setSettings] =
    useState(loadSettings);


  // =========================
  // Persist Settings
  // =========================

  useEffect(() => {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

    } catch (error) {

      console.error(
        "Settings storage failed:",
        error
      );

    }

  }, [settings]);


  // =========================
  // Actions
  // =========================

  const updateSetting =
    (key, value) => {

      setSettings(
        previous => ({

          ...previous,

          [key]: value

        })
      );

    };


  const updateSettings =
    (newSettings) => {

      setSettings(
        previous => ({

          ...previous,

          ...newSettings

        })
      );

    };


  const resetSettings =
    () => {

      setSettings({
        ...defaultSettings
      });

    };


  // =========================
  // Context Value
  // =========================

  const value = useMemo(
    () => ({

      settings,

      updateSetting,

      updateSettings,

      resetSettings

    }),
    [settings]
  );


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

export function useSettings() {

  const context =
    useContext(
      SettingsContext
    );

  if (!context) {

    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );

  }

  return context;

}


// =========================
// Exports
// =========================

export {
  SettingsContext,
  defaultSettings
};
