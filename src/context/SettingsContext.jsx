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

const normalizeSettings = (saved) => {

  if (!saved || typeof saved !== "object") {
    return defaultSettings;
  }

  return {

    ...defaultSettings,

    ...saved,

    // دعم القيم القديمة
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

};


// =========================
// Provider
// =========================

export function SettingsProvider({
  children
}) {

  const [settings, setSettings] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            "lavender-settings"
          );

        if (!saved) {
          return defaultSettings;
        }

        const parsed =
          JSON.parse(saved);

        return normalizeSettings(parsed);

      } catch (error) {

        console.error(
          "Settings loading failed:",
          error
        );

        return defaultSettings;

      }

    });


  // =========================
  // Save Settings
  // =========================

  useEffect(() => {

    try {

      localStorage.setItem(
        "lavender-settings",
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

export function useSettings() {

  const context =
    useContext(SettingsContext);


  if (!context) {

    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );

  }


  return context;

}
