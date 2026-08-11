// src/utils/translation.js

const translations = Object.freeze({

  // =========================
  // العربية
  // =========================

  ar: Object.freeze({

    menu: Object.freeze({
      dashboard: "لوحة التحكم",
      farms: "المزارع",
      fields: "الحقول",
      crops: "المحاصيل",
      irrigation: "الري",
      fertilizers: "الأسمدة",
      pesticides: "المبيدات",
      diseases: "الأمراض",
      weather: "الطقس",
      map: "الخريطة",
      ai: "الذكاء الاصطناعي",
      engineer: "المهندس الزراعي",
      reports: "التقارير",
      harvest: "الحصاد",
      inventory: "المخزون",
      expenses: "المصروفات",
      settings: "الإعدادات"
    }),

    home: Object.freeze({
      title: "إدارة المزارع الذكية",
      description:
        "نظام ذكي لإدارة المزارع والمحاصيل والري والأسمدة.",
      start: "ابدأ الآن",
      login: "تسجيل دخول",
      services: "الخدمات"
    }),

    footer: Object.freeze({
      description: "نظام إدارة المزارع الذكية",
      management:
        "إدارة المحاصيل والري والتقارير الزراعية",
      rights: "جميع الحقوق محفوظة"
    })

  }),


  // =========================
  // English
  // =========================

  en: Object.freeze({

    menu: Object.freeze({
      dashboard: "Dashboard",
      farms: "Farms",
      fields: "Fields",
      crops: "Crops",
      irrigation: "Irrigation",
      fertilizers: "Fertilizers",
      pesticides: "Pesticides",
      diseases: "Diseases",
      weather: "Weather",
      map: "Map",
      ai: "Artificial Intelligence",
      engineer: "Agricultural Engineer",
      reports: "Reports",
      harvest: "Harvest",
      inventory: "Inventory",
      expenses: "Expenses",
      settings: "Settings"
    }),

    home: Object.freeze({
      title: "Smart Farm Management",
      description:
        "A smart system for managing farms, crops, irrigation, and fertilizers.",
      start: "Get Started",
      login: "Login",
      services: "Services"
    }),

    footer: Object.freeze({
      description: "Smart Farm Management System",
      management:
        "Crop, irrigation, and agricultural report management",
      rights: "All rights reserved"
    })

  }),


  // =========================
  // Türkçe
  // =========================

  tr: Object.freeze({

    menu: Object.freeze({
      dashboard: "Kontrol Paneli",
      farms: "Çiftlikler",
      fields: "Tarlalar",
      crops: "Ürünler",
      irrigation: "Sulama",
      fertilizers: "Gübreler",
      pesticides: "Pestisitler",
      diseases: "Hastalıklar",
      weather: "Hava Durumu",
      map: "Harita",
      ai: "Yapay Zeka",
      engineer: "Ziraat Mühendisi",
      reports: "Raporlar",
      harvest: "Hasat",
      inventory: "Stok",
      expenses: "Giderler",
      settings: "Ayarlar"
    }),

    home: Object.freeze({
      title: "Akıllı Çiftlik Yönetimi",
      description:
        "Çiftlikleri, ürünleri, sulamayı ve gübreleri yönetmek için akıllı sistem.",
      start: "Başla",
      login: "Giriş Yap",
      services: "Hizmetler"
    }),

    footer: Object.freeze({
      description: "Akıllı Çiftlik Yönetim Sistemi",
      management:
        "Ürün, sulama ve tarımsal rapor yönetimi",
      rights: "Tüm hakları saklıdır"
    })

  })

});


// =========================
// Get Nested Translation
// =========================

const getNestedValue = (source, key) => {

  return key
    .split(".")
    .reduce(
      (value, part) => value?.[part],
      source
    );

};


// =========================
// Translate
// =========================

export function translate(
  key,
  language = "ar"
) {

  const languageTranslations =
    translations[language] ||
    translations.ar;

  const value =
    getNestedValue(
      languageTranslations,
      key
    );

  return value ?? key;

}


export default translate;
