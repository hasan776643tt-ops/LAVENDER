// src/utils/translation.js

const translations = Object.freeze({
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
    })
  })
});


const getNestedValue = (source, key) => {
  return key
    .split(".")
    .reduce(
      (value, part) =>
        value?.[part],
      source
    );
};


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
