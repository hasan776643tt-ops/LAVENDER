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

    settings: Object.freeze({
      title: "إعدادات النظام",
      global: "الإعدادات العالمية",
      measurement: "وحدات القياس",
      systemLocation: "النظام والموقع",
      information: "معلومات LAVENDER",
      description:
        "نظام إدارة زراعي ذكي عالمي",
      notifications: "تفعيل الإشعارات",
      gps: "تفعيل GPS",
      reset: "إعادة الإعدادات الافتراضية"
    }),

    contact: Object.freeze({
      title: "تواصل معنا",
      name: "الاسم",
      namePlaceholder: "اكتب اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "example@email.com",
      message: "الرسالة",
      messagePlaceholder: "اكتب رسالتك هنا",
      send: "إرسال",
      required: "يرجى تعبئة جميع الحقول.",
      invalidEmail:
        "يرجى إدخال بريد إلكتروني صحيح.",
      success:
        "تم إرسال رسالتك وحفظها بنجاح.",
      saveError:
        "تعذر حفظ الرسالة. حاول مرة أخرى."
    }),

    country: Object.freeze({
      SY: "سوريا",
      TR: "تركيا",
      SA: "السعودية",
      AE: "الإمارات",
      US: "الولايات المتحدة",
      FR: "فرنسا"
    }),

    currency: Object.freeze({
      SYP: "الليرة السورية",
      TRY: "الليرة التركية",
      SAR: "الريال السعودي",
      AED: "الدرهم الإماراتي",
      USD: "الدولار الأمريكي",
      EUR: "اليورو"
    }),

    unit: Object.freeze({
      dunum: "دونم",
      hectare: "هكتار",
      acre: "فدان",
      sqm: "متر مربع",
      kg: "كيلوغرام",
      ton: "طن",
      liter: "لتر",
      cubic_meter: "متر مكعب"
    }),

    footer: Object.freeze({
      description:
        "نظام إدارة المزارع الذكية",
      management:
        "إدارة المحاصيل والري والتقارير الزراعية",
      rights:
        "جميع الحقوق محفوظة"
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

    settings: Object.freeze({
      title: "System Settings",
      global: "Global Settings",
      measurement: "Measurement Units",
      systemLocation:
        "System & Location",
      information:
        "LAVENDER Information",
      description:
        "A global smart agricultural management system",
      notifications:
        "Enable Notifications",
      gps: "Enable GPS",
      reset:
        "Reset Default Settings"
    }),

    contact: Object.freeze({
      title: "Contact Us",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder:
        "example@email.com",
      message: "Message",
      messagePlaceholder:
        "Write your message here",
      send: "Send",
      required:
        "Please fill in all fields.",
      invalidEmail:
        "Please enter a valid email address.",
      success:
        "Your message was sent and saved successfully.",
      saveError:
        "Unable to save the message. Please try again."
    }),

    country: Object.freeze({
      SY: "Syria",
      TR: "Turkey",
      SA: "Saudi Arabia",
      AE: "United Arab Emirates",
      US: "United States",
      FR: "France"
    }),

    currency: Object.freeze({
      SYP: "Syrian Pound",
      TRY: "Turkish Lira",
      SAR: "Saudi Riyal",
      AED: "UAE Dirham",
      USD: "US Dollar",
      EUR: "Euro"
    }),

    unit: Object.freeze({
      dunum: "Dunum",
      hectare: "Hectare",
      acre: "Acre",
      sqm: "Square Meter",
      kg: "Kilogram",
      ton: "Ton",
      liter: "Liter",
      cubic_meter:
        "Cubic Meter"
    }),

    footer: Object.freeze({
      description:
        "Smart Farm Management System",
      management:
        "Crop, irrigation, and agricultural report management",
      rights:
        "All rights reserved"
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
      engineer:
        "Ziraat Mühendisi",
      reports: "Raporlar",
      harvest: "Hasat",
      inventory: "Stok",
      expenses: "Giderler",
      settings: "Ayarlar"
    }),

    home: Object.freeze({
      title:
        "Akıllı Çiftlik Yönetimi",
      description:
        "Çiftlikleri, ürünleri, sulamayı ve gübreleri yönetmek için akıllı sistem.",
      start: "Başla",
      login: "Giriş Yap",
      services: "Hizmetler"
    }),

    settings: Object.freeze({
      title: "Sistem Ayarları",
      global: "Genel Ayarlar",
      measurement:
        "Ölçü Birimleri",
      systemLocation:
        "Sistem ve Konum",
      information:
        "LAVENDER Bilgileri",
      description:
        "Küresel akıllı tarım yönetim sistemi",
      notifications:
        "Bildirimleri Etkinleştir",
      gps: "GPS'yi Etkinleştir",
      reset:
        "Varsayılan Ayarları Sıfırla"
    }),

    contact: Object.freeze({
      title: "Bize Ulaşın",
      name: "Ad",
      namePlaceholder:
        "Adınızı yazın",
      email: "E-posta",
      emailPlaceholder:
        "example@email.com",
      message: "Mesaj",
      messagePlaceholder:
        "Mesajınızı buraya yazın",
      send: "Gönder",
      required:
        "Lütfen tüm alanları doldurun.",
      invalidEmail:
        "Lütfen geçerli bir e-posta adresi girin.",
      success:
        "Mesajınız başarıyla gönderildi ve kaydedildi.",
      saveError:
        "Mesaj kaydedilemedi. Lütfen tekrar deneyin."
    }),

    country: Object.freeze({
      SY: "Suriye",
      TR: "Türkiye",
      SA: "Suudi Arabistan",
      AE:
        "Birleşik Arap Emirlikleri",
      US:
        "Amerika Birleşik Devletleri",
      FR: "Fransa"
    }),

    currency: Object.freeze({
      SYP: "Suriye Lirası",
      TRY: "Türk Lirası",
      SAR: "Suudi Riyali",
      AED: "BAE Dirhemi",
      USD: "ABD Doları",
      EUR: "Euro"
    }),

    unit: Object.freeze({
      dunum: "Dönüm",
      hectare: "Hektar",
      acre: "Akre",
      sqm: "Metrekare",
      kg: "Kilogram",
      ton: "Ton",
      liter: "Litre",
      cubic_meter:
        "Metreküp"
    }),

    footer: Object.freeze({
      description:
        "Akıllı Çiftlik Yönetim Sistemi",
      management:
        "Ürün, sulama ve tarımsal rapor yönetimi",
      rights:
        "Tüm hakları saklıdır"
    })

  })

});


// =========================
// Nested Translation
// =========================

const getNestedValue = (
  source,
  key
) => {

  return key
    .split(".")
    .reduce(
      (value, part) =>
        value?.[part],
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
