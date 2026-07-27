import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const defaultSettings = {
  language: "ar",
  country: "SY",
  currency: "SYP",
  areaUnit: "دونم",
  weightUnit: "كغ",
  waterUnit: "لتر",
  theme: "light",
  notifications: true,
  gps: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("lavender-settings");

    return savedSettings
      ? JSON.parse(savedSettings)
      : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(
      "lavender-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}
