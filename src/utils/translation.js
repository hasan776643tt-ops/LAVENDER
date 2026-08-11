// src/utils/translation.js

const translations = Object.freeze({

  // =====================================================
  // Arabic
  // =====================================================

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

    contact: Object.freeze({
      title: "تواصل معنا",
      name: "الاسم",
      namePlaceholder: "اكتب اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "example@email.com",
      message: "الرسالة",
      messagePlaceholder: "اكتب رسالتك هنا",
      submit: "إرسال",
      required: "يرجى تعبئة جميع الحقول.",
      invalidEmail:
        "يرجى إدخال بريد إلكتروني صحيح.",
      success:
        "تم إرسال رسالتك وحفظها بنجاح.",
      saveError:
        "تعذر حفظ الرسالة. حاول مرة أخرى."
    }),

    map: Object.freeze({
      title: "نظام المواقع الذكي",
      newLocation: "تسجيل موقع جديد",
      selectFarm: "اختر المزرعة",
      farm: "مزرعة",
      field: "حقل",
      waterSource: "مصدر مياه",
      getLocation: "تحديد GPS",
      locating: "جاري تحديد الموقع...",
      latitude: "خط العرض",
      longitude: "خط الطول",
      accuracy: "الدقة",
      recordingTime: "وقت التسجيل",
      notes: "ملاحظات الموقع",
      save: "حفظ الموقع",
      savedLocations: "المواقع المحفوظة",
      type: "النوع",
      openGoogleMaps: "فتح في Google Maps",
      delete: "حذف",
      meter: "متر"
    }),

    dashboard: Object.freeze({
      title: "لوحة التحكم الذكية",
      description:
        "نظام إدارة ومراقبة المزرعة",
      loading: "جاري تحميل بيانات المزرعة...",
      loadingTitle: "تحميل البيانات",
      errorTitle: "خطأ",
      health: "صحة المزرعة",
      healthDescription: "مؤشر الحالة الزراعية",
      financial: "التحليل المالي",
      totalExpenses: "إجمالي المصاريف:",
      recordsCount: "عدد السجلات:",
      alerts: "التنبيهات الذكية",
      statistics: "مؤشرات النظام",
      systemStatus: "حالة LAVENDER",
      farms: "المزارع",
      farmsInfo: "إجمالي المزارع",
      fields: "الحقول",
      fieldsInfo: "الحقول المسجلة",
      crops: "المحاصيل",
      cropsInfo: "المحاصيل الحالية",
      expenses: "المصروفات",
      expensesInfo: "سجلات المصروفات",
      harvest: "الحصاد",
      harvestInfo: "عمليات الحصاد",
      inventory: "المخزون",
      inventoryInfo: "مواد المخزون",
      noFarms: "لم تتم إضافة أي مزرعة بعد.",
      noFields: "لم تتم إضافة أي حقل بعد.",
      noCrops: "لم تتم إضافة أي محصول بعد.",
      emptyInventory:
        "المخزون فارغ، أضف المواد الزراعية.",
      noExpenses: "لا توجد سجلات مصروفات.",
      allDataAvailable:
        "جميع البيانات الأساسية موجودة.",
      crudActive: "نظام CRUD الزراعي فعال",
      localStorage: "البيانات محفوظة محلياً",
      harvestConnected: "Harvest متصل بالخدمة",
      inventoryConnected:
        "Inventory متصل بالخدمة",
      servicesConnected:
        "Dashboard يستخدم Services",
      cloudReady:
        "البنية جاهزة للتطوير السحابي"
    }),

    reports: Object.freeze({
      title: "التقارير الذكية المتقدمة",
      description:
        "تحليل شامل لأداء المزرعة",
      performance: "مؤشرات الأداء",
      operations: "إجمالي العمليات الزراعية",
      health: "صحة المزرعة",
      healthDescription:
        "مؤشر الحالة الزراعية الذكية",
      financial: "التقرير المالي",
      totalExpenses: "إجمالي المصاريف:",
      averageExpense: "متوسط المصروف:",
      financialRecords: "عدد العمليات المالية:",
      cropsAnalysis: "تحليل المحاصيل",
      topCrop: "أكثر محصول:",
      cropCount: "عدد المحاصيل:",
      advice: "التوصيات الذكية",
      futureActivities: "الأنشطة المستقبلية",
      consultations: "الاستشارات:",
      aiQuestions: "أسئلة AI:",
      harvest: "الحصاد:",
      systemReadiness: "جاهزية النظام",
      connectedData:
        "البيانات الزراعية مترابطة",
      chartsReady:
        "جاهز للرسوم البيانية",
      pdfReady:
        "جاهز لتصدير PDF",
      aiReady:
        "جاهز للذكاء الاصطناعي",
      cloudReady:
        "جاهز للقاعدة السحابية",
      generatePdf: "إنشاء تقرير PDF",
      noCrop: "لا يوجد"
    }),

    settings: Object.freeze({
      title: "إعدادات النظام",
      global: "الإعدادات العالمية",
      measurement: "وحدات القياس",
      systemLocation: "النظام والموقع",
      notifications: "تفعيل الإشعارات",
      gps: "تفعيل GPS",
      information: "معلومات LAVENDER",
      description:
        "نظام إدارة زراعي ذكي عالمي",
      reset: "إعادة الإعدادات الافتراضية"
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
      cubic_meter: "متر مكعب",
      celsius: "مئوية",
      meter: "متر",
      kilometer: "كيلومتر"
    })
  }),


  // =====================================================
  // English
  // =====================================================

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

    contact: Object.freeze({
      title: "Contact Us",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "example@email.com",
      message: "Message",
      messagePlaceholder: "Write your message here",
      submit: "Send",
      required: "Please fill in all fields.",
      invalidEmail:
        "Please enter a valid email address.",
      success:
        "Your message was sent and saved successfully.",
      saveError:
        "Unable to save the message. Please try again."
    }),

    map: Object.freeze({
      title: "Smart Location System",
      newLocation: "Register New Location",
      selectFarm: "Select Farm",
      farm: "Farm",
      field: "Field",
      waterSource: "Water Source",
      getLocation: "Get GPS Location",
      locating: "Getting location...",
      latitude: "Latitude",
      longitude: "Longitude",
      accuracy: "Accuracy",
      recordingTime: "Recording Time",
      notes: "Location Notes",
      save: "Save Location",
      savedLocations: "Saved Locations",
      type: "Type",
      openGoogleMaps: "Open in Google Maps",
      delete: "Delete",
      meter: "meter"
    }),

    dashboard: Object.freeze({
      title: "Smart Dashboard",
      description:
        "Farm management and monitoring system",
      loading: "Loading farm data...",
      loadingTitle: "Loading Data",
      errorTitle: "Error",
      health: "Farm Health",
      healthDescription: "Agricultural health indicator",
      financial: "Financial Analysis",
      totalExpenses: "Total Expenses:",
      recordsCount: "Number of Records:",
      alerts: "Smart Alerts",
      statistics: "System Statistics",
      systemStatus: "LAVENDER Status",
      farms: "Farms",
      farmsInfo: "Total farms",
      fields: "Fields",
      fieldsInfo: "Registered fields",
      crops: "Crops",
      cropsInfo: "Current crops",
      expenses: "Expenses",
      expensesInfo: "Expense records",
      harvest: "Harvest",
      harvestInfo: "Harvest operations",
      inventory: "Inventory",
      inventoryInfo: "Inventory items",
      noFarms: "No farms have been added yet.",
      noFields: "No fields have been added yet.",
      noCrops: "No crops have been added yet.",
      emptyInventory:
        "Inventory is empty. Add agricultural materials.",
      noExpenses: "No expense records found.",
      allDataAvailable:
        "All essential data is available.",
      crudActive: "Agricultural CRUD system is active",
      localStorage: "Data is stored locally",
      harvestConnected:
        "Harvest is connected to the service",
      inventoryConnected:
        "Inventory is connected to the service",
      servicesConnected:
        "Dashboard uses Services",
      cloudReady:
        "Architecture is ready for cloud development"
    }),

    reports: Object.freeze({
      title: "Advanced Smart Reports",
      description:
        "Comprehensive analysis of farm performance",
      performance: "Performance Indicators",
      operations: "Total Agricultural Operations",
      health: "Farm Health",
      healthDescription:
        "Smart agricultural health indicator",
      financial: "Financial Report",
      totalExpenses: "Total Expenses:",
      averageExpense: "Average Expense:",
      financialRecords: "Financial Records:",
      cropsAnalysis: "Crop Analysis",
      topCrop: "Top Crop:",
      cropCount: "Number of Crops:",
      advice: "Smart Recommendations",
      futureActivities: "Future Activities",
      consultations: "Consultations:",
      aiQuestions: "AI Questions:",
      harvest: "Harvest:",
      systemReadiness: "System Readiness",
      connectedData:
        "Agricultural data is connected",
      chartsReady:
        "Ready for charts",
      pdfReady:
        "Ready for PDF export",
      aiReady:
        "Ready for artificial intelligence",
      cloudReady:
        "Ready for cloud database",
      generatePdf: "Generate PDF Report",
      noCrop: "None"
    }),

    settings: Object.freeze({
      title: "System Settings",
      global: "Global Settings",
      measurement: "Measurement Units",
      systemLocation: "System & Location",
      notifications: "Enable Notifications",
      gps: "Enable GPS",
      information: "LAVENDER Information",
      description:
        "A global smart agricultural management system",
      reset: "Reset Default Settings"
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
      cubic_meter: "Cubic Meter",
      celsius: "Celsius",
      meter: "Meter",
      kilometer: "Kilometer"
    })
  }),


  // =====================================================
  // Turkish
  // =====================================================

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

    contact: Object.freeze({
      title: "Bize Ulaşın",
      name: "Ad",
      namePlaceholder: "Adınızı yazın",
      email: "E-posta",
      emailPlaceholder: "example@email.com",
      message: "Mesaj",
      messagePlaceholder: "Mesajınızı buraya yazın",
      submit: "Gönder",
      required: "Lütfen tüm alanları doldurun.",
      invalidEmail:
        "Lütfen geçerli bir e-posta adresi girin.",
      success:
        "Mesajınız başarıyla gönderildi ve kaydedildi.",
      saveError:
        "Mesaj kaydedilemedi. Lütfen tekrar deneyin."
    }),

    map: Object.freeze({
      title: "Akıllı Konum Sistemi",
      newLocation: "Yeni Konum Kaydet",
      selectFarm: "Çiftlik Seçin",
      farm: "Çiftlik",
      field: "Tarla",
      waterSource: "Su Kaynağı",
      getLocation: "GPS Konumunu Al",
      locating: "Konum belirleniyor...",
      latitude: "Enlem",
      longitude: "Boylam",
      accuracy: "Doğruluk",
      recordingTime: "Kayıt Zamanı",
      notes: "Konum Notları",
      save: "Konumu Kaydet",
      savedLocations: "Kayıtlı Konumlar",
      type: "Tür",
      openGoogleMaps: "Google Maps'te Aç",
      delete: "Sil",
      meter: "metre"
    }),

    dashboard: Object.freeze({
      title: "Akıllı Kontrol Paneli",
      description:
        "Çiftlik yönetim ve izleme sistemi",
      loading: "Çiftlik verileri yükleniyor...",
      loadingTitle: "Veriler Yükleniyor",
      errorTitle: "Hata",
      health: "Çiftlik Sağlığı",
      healthDescription: "Tarımsal sağlık göstergesi",
      financial: "Finansal Analiz",
      totalExpenses: "Toplam Giderler:",
      recordsCount: "Kayıt Sayısı:",
      alerts: "Akıllı Uyarılar",
      statistics: "Sistem İstatistikleri",
      systemStatus: "LAVENDER Durumu",
      farms: "Çiftlikler",
      farmsInfo: "Toplam çiftlikler",
      fields: "Tarlalar",
      fieldsInfo: "Kayıtlı tarlalar",
      crops: "Ürünler",
      cropsInfo: "Mevcut ürünler",
      expenses: "Giderler",
      expensesInfo: "Gider kayıtları",
      harvest: "Hasat",
      harvestInfo: "Hasat işlemleri",
      inventory: "Stok",
      inventoryInfo: "Stok malzemeleri",
      noFarms: "Henüz çiftlik eklenmedi.",
      noFields: "Henüz tarla eklenmedi.",
      noCrops: "Henüz ürün eklenmedi.",
      emptyInventory:
        "Stok boş. Tarımsal malzemeler ekleyin.",
      noExpenses: "Gider kaydı bulunmuyor.",
      allDataAvailable:
        "Tüm temel veriler mevcut.",
      crudActive: "Tarımsal CRUD sistemi aktif",
      localStorage: "Veriler yerel olarak saklanıyor",
      harvestConnected:
        "Hasat servise bağlı",
      inventoryConnected:
        "Stok servise bağlı",
      servicesConnected:
        "Kontrol paneli Services kullanıyor",
      cloudReady:
        "Mimari bulut geliştirmeye hazır"
    }),

    reports: Object.freeze({
      title: "Gelişmiş Akıllı Raporlar",
      description:
        "Çiftlik performansının kapsamlı analizi",
      performance: "Performans Göstergeleri",
      operations: "Toplam Tarımsal İşlemler",
      health: "Çiftlik Sağlığı",
      healthDescription:
        "Akıllı tarımsal sağlık göstergesi",
      financial: "Finansal Rapor",
      totalExpenses: "Toplam Giderler:",
      averageExpense: "Ortalama Gider:",
      financialRecords: "Finansal Kayıtlar:",
      cropsAnalysis: "Ürün Analizi",
      topCrop: "En Çok Bulunan Ürün:",
      cropCount: "Ürün Sayısı:",
      advice: "Akıllı Öneriler",
      futureActivities: "Gelecek Aktiviteler",
      consultations: "Danışmanlıklar:",
      aiQuestions: "AI Soruları:",
      harvest: "Hasat:",
      systemReadiness: "Sistem Hazırlığı",
      connectedData:
        "Tarımsal veriler bağlantılı",
      chartsReady:
        "Grafiklere hazır",
      pdfReady:
        "PDF dışa aktarmaya hazır",
      aiReady:
        "Yapay zekaya hazır",
      cloudReady:
        "Bulut veritabanına hazır",
      generatePdf: "PDF Raporu Oluştur",
      noCrop: "Yok"
    }),

    settings: Object.freeze({
      title: "Sistem Ayarları",
      global: "Genel Ayarlar",
      measurement: "Ölçü Birimleri",
      systemLocation: "Sistem ve Konum",
      notifications: "Bildirimleri Etkinleştir",
      gps: "GPS'yi Etkinleştir",
      information: "LAVENDER Bilgileri",
      description:
        "Küresel akıllı tarım yönetim sistemi",
      reset: "Varsayılan Ayarları Sıfırla"
    }),

    country: Object.freeze({
      SY: "Suriye",
      TR: "Türkiye",
      SA: "Suudi Arabistan",
      AE: "Birleşik Arap Emirlikleri",
      US: "Amerika Birleşik Devletleri",
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
      cubic_meter: "Metreküp",
      celsius: "Santigrat",
      meter: "Metre",
      kilometer: "Kilometre"
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
