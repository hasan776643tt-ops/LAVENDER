// src/utils/translation.js

const translations = Object.freeze({

  // =========================================================
  // العربية
  // =========================================================

  ar: Object.freeze({

    // =======================================================
    // القائمة الرئيسية
    // =======================================================

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
      users: "المستخدمون",
      settings: "الإعدادات"
    }),

    // =======================================================
    // الصفحة الرئيسية
    // =======================================================

    home: Object.freeze({
      title:
        "إدارة المزارع الذكية",

      description:
        "نظام ذكي لإدارة المزارع والمحاصيل والري والأسمدة.",

      start:
        "ابدأ الآن",

      login:
        "تسجيل دخول",

      services:
        "الخدمات"
    }),

    // =======================================================
    // التواصل
    // =======================================================

    contact: Object.freeze({
      title:
        "تواصل معنا",

      name:
        "الاسم",

      namePlaceholder:
        "اكتب اسمك",

      email:
        "البريد الإلكتروني",

      emailPlaceholder:
        "example@email.com",

      message:
        "الرسالة",

      messagePlaceholder:
        "اكتب رسالتك هنا",

      send:
        "إرسال",

      required:
        "يرجى تعبئة جميع الحقول.",

      invalidEmail:
        "يرجى إدخال بريد إلكتروني صحيح.",

      success:
        "تم إرسال رسالتك وحفظها بنجاح.",

      saveError:
        "تعذر حفظ الرسالة. حاول مرة أخرى."
    }),

    // =======================================================
    // الإعدادات
    // =======================================================

    settings: Object.freeze({
      title:
        "إعدادات النظام",

      global:
        "الإعدادات العالمية",

      measurement:
        "وحدات القياس",

      systemLocation:
        "النظام والموقع",

      information:
        "معلومات LAVENDER",

      description:
        "نظام إدارة زراعي ذكي عالمي",

      notifications:
        "تفعيل الإشعارات",

      gps:
        "تفعيل GPS",

      reset:
        "إعادة الإعدادات الافتراضية"
    }),

    // =======================================================
    // اللغة
    // =======================================================

    language: Object.freeze({
      ar:
        "العربية",

      en:
        "الإنجليزية",

      tr:
        "التركية"
    }),

    // =======================================================
    // الدول
    // =======================================================

    country: Object.freeze({
      SY:
        "سوريا",

      TR:
        "تركيا",

      SA:
        "السعودية",

      AE:
        "الإمارات",

      US:
        "الولايات المتحدة",

      FR:
        "فرنسا"
    }),

    // =======================================================
    // العملات
    // =======================================================

    currency: Object.freeze({
      SYP:
        "الليرة السورية",

      TRY:
        "الليرة التركية",

      SAR:
        "الريال السعودي",

      AED:
        "الدرهم الإماراتي",

      USD:
        "الدولار الأمريكي",

      EUR:
        "اليورو"
    }),

    // =======================================================
    // وحدات القياس
    // =======================================================

    unit: Object.freeze({
      dunum:
        "دونم",

      hectare:
        "هكتار",

      acre:
        "فدان",

      sqm:
        "متر مربع",

      kg:
        "كيلوغرام",

      ton:
        "طن",

      liter:
        "لتر",

      cubic_meter:
        "متر مكعب"
    }),

    // =======================================================
    // الخريطة
    // =======================================================

    map: Object.freeze({

      title:
        "خريطة المزرعة",

      addLocation:
        "إضافة موقع",

      selectFarm:
        "اختر المزرعة",

      farm:
        "المزرعة",

      field:
        "الحقل",

      waterSource:
        "مصدر المياه",

      // =====================================================
      // معلومات الموقع
      // =====================================================

      village:
        "اسم القرية",

      region:
        "اسم المنطقة",

      placeName:
        "اسم المكان",

      villagePlaceholder:
        "اكتب اسم القرية",

      regionPlaceholder:
        "اكتب اسم المنطقة",

      placeNamePlaceholder:
        "اكتب اسم المكان",

      // =====================================================
      // GPS
      // =====================================================

      getGPS:
        "تحديد موقعي الحالي",

      locating:
        "جارٍ تحديد الموقع...",

      locationDetected:
        "تم تحديد الموقع بنجاح.",

      latitude:
        "خط العرض",

      longitude:
        "خط الطول",

      accuracy:
        "دقة الموقع",

      meters:
        "متر",

      locationTime:
        "وقت تحديد الموقع",

      // =====================================================
      // الملاحظات
      // =====================================================

      notes:
        "ملاحظات",

      notesPlaceholder:
        "اكتب ملاحظات حول الموقع",

      // =====================================================
      // الحفظ
      // =====================================================

      save:
        "حفظ الموقع",

      savedLocations:
        "المواقع المحفوظة",

      type:
        "نوع الموقع",

      openGoogleMaps:
        "فتح في خرائط Google",

      delete:
        "حذف الموقع",

      noLocations:
        "لا توجد مواقع محفوظة حتى الآن.",

      // =====================================================
      // الرسائل
      // =====================================================

      locationSuccess:
        "تم تحديد الموقع بنجاح.",

      locationError:
        "تعذر تحديد موقعك الحالي.",

      permissionDenied:
        "تم رفض صلاحية الوصول إلى الموقع.",

      positionUnavailable:
        "معلومات الموقع غير متاحة.",

      locationTimeout:
        "انتهت مهلة تحديد الموقع.",

      farmRequired:
        "يرجى اختيار المزرعة أولاً.",

      coordinatesRequired:
        "يرجى تحديد الموقع قبل الحفظ.",

      saveSuccess:
        "تم حفظ الموقع بنجاح.",

      saveError:
        "تعذر حفظ الموقع.",

      deleteSuccess:
        "تم حذف الموقع بنجاح.",

      deleteError:
        "تعذر حذف الموقع."
    }),

    // =======================================================
    // الحصاد
    // =======================================================

    harvest: Object.freeze({

      title:
        "إدارة الحصاد",

      addHarvest:
        "إضافة حصاد",

      editHarvest:
        "تعديل الحصاد",

      selectFarm:
        "اختر المزرعة",

      selectField:
        "اختر الحقل",

      selectCrop:
        "اختر المحصول",

      selectFarmFirst:
        "اختر المزرعة أولاً",

      selectFieldFirst:
        "اختر الحقل أولاً",

      noFields:
        "لا توجد حقول لهذه المزرعة",

      noCrops:
        "لا توجد محاصيل لهذا الحقل",

      quantity:
        "كمية الحصاد",

      quantityPlaceholder:
        "أدخل كمية الحصاد",

      quality:
        "جودة المحصول",

      qualityPlaceholder:
        "أدخل جودة المحصول",

      harvestDate:
        "تاريخ الحصاد",

      notes:
        "ملاحظات",

      notesPlaceholder:
        "اكتب ملاحظات حول عملية الحصاد",

      save:
        "إضافة الحصاد",

      update:
        "حفظ التعديل",

      cancel:
        "إلغاء التعديل",

      edit:
        "تعديل",

      delete:
        "حذف",

      saving:
        "جاري الحفظ...",

      statistics:
        "إحصائيات الحصاد",

      operationsCount:
        "عدد عمليات الحصاد",

      totalProduction:
        "إجمالي الإنتاج",

      record:
        "سجل الحصاد",

      noRecords:
        "لا توجد عمليات حصاد مسجلة حتى الآن.",

      farmName:
        "المزرعة",

      fieldName:
        "الحقل",

      cropName:
        "المحصول",

      kg:
        "كغ",

      unknownFarm:
        "مزرعة غير معروفة",

      unknownField:
        "حقل غير معروف",

      unknownCrop:
        "محصول غير معروف",

      farmRequired:
        "يرجى اختيار المزرعة.",

      fieldRequired:
        "يرجى اختيار الحقل.",

      cropRequired:
        "يرجى اختيار المحصول.",

      quantityRequired:
        "يرجى إدخال كمية حصاد صحيحة.",

      managementUnavailable:
        "إدارة الحصاد غير متاحة.",

      saveError:
        "تعذر حفظ عملية الحصاد.",

      deleteConfirm:
        "هل تريد حذف عملية الحصاد؟",

      deleteError:
        "تعذر حذف عملية الحصاد.",

      success:
        "تم حفظ عملية الحصاد بنجاح."
    }),

    // =======================================================
    // التذييل
    // =======================================================

    footer: Object.freeze({

      description:
        "نظام إدارة المزارع الذكية",

      management:
        "إدارة المحاصيل والري والتقارير الزراعية",

      rights:
        "جميع الحقوق محفوظة"
    })

  }),

  // =========================================================
  // English
  // =========================================================

  en: Object.freeze({

    // =======================================================
    // Main Menu
    // =======================================================

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
      users: "Users",
      settings: "Settings"
    }),

    // =======================================================
    // Home
    // =======================================================

    home: Object.freeze({
      title:
        "Smart Farm Management",

      description:
        "A smart system for managing farms, crops, irrigation, and fertilizers.",

      start:
        "Get Started",

      login:
        "Login",

      services:
        "Services"
    }),

    // =======================================================
    // Contact
    // =======================================================

    contact: Object.freeze({
      title:
        "Contact Us",

      name:
        "Name",

      namePlaceholder:
        "Enter your name",

      email:
        "Email",

      emailPlaceholder:
        "example@email.com",

      message:
        "Message",

      messagePlaceholder:
        "Write your message here",

      send:
        "Send",

      required:
        "Please fill in all fields.",

      invalidEmail:
        "Please enter a valid email address.",

      success:
        "Your message was sent and saved successfully.",

      saveError:
        "Unable to save the message. Please try again."
    }),

    // =======================================================
    // Settings
    // =======================================================

    settings: Object.freeze({
      title:
        "System Settings",

      global:
        "Global Settings",

      measurement:
        "Measurement Units",

      systemLocation:
        "System & Location",

      information:
        "LAVENDER Information",

      description:
        "A global smart agricultural management system",

      notifications:
        "Enable Notifications",

      gps:
        "Enable GPS",

      reset:
        "Reset Default Settings"
    }),

    // =======================================================
    // Language
    // =======================================================

    language: Object.freeze({
      ar:
        "Arabic",

      en:
        "English",

      tr:
        "Turkish"
    }),

    // =======================================================
    // Countries
    // =======================================================

    country: Object.freeze({
      SY:
        "Syria",

      TR:
        "Turkey",

      SA:
        "Saudi Arabia",

      AE:
        "United Arab Emirates",

      US:
        "United States",

      FR:
        "France"
    }),

    // =======================================================
    // Currency
    // =======================================================

    currency: Object.freeze({
      SYP:
        "Syrian Pound",

      TRY:
        "Turkish Lira",

      SAR:
        "Saudi Riyal",

      AED:
        "UAE Dirham",

      USD:
        "US Dollar",

      EUR:
        "Euro"
    }),

    // =======================================================
    // Units
    // =======================================================

    unit: Object.freeze({
      dunum:
        "Dunum",

      hectare:
        "Hectare",

      acre:
        "Acre",

      sqm:
        "Square Meter",

      kg:
        "Kilogram",

      ton:
        "Ton",

      liter:
        "Liter",

      cubic_meter:
        "Cubic Meter"
    }),

    // =======================================================
    // Map
    // =======================================================

    map: Object.freeze({

      title:
        "Farm Map",

      addLocation:
        "Add Location",

      selectFarm:
        "Select Farm",

      farm:
        "Farm",

      field:
        "Field",

      waterSource:
        "Water Source",

      // =====================================================
      // Location Information
      // =====================================================

      village:
        "Village Name",

      region:
        "Region Name",

      placeName:
        "Place Name",

      villagePlaceholder:
        "Enter village name",

      regionPlaceholder:
        "Enter region name",

      placeNamePlaceholder:
        "Enter place name",

      // =====================================================
      // GPS
      // =====================================================

      getGPS:
        "Get My Current Location",

      locating:
        "Locating...",

      locationDetected:
        "Location detected successfully.",

      latitude:
        "Latitude",

      longitude:
        "Longitude",

      accuracy:
        "Location Accuracy",

      meters:
        "meters",

      locationTime:
        "Location Time",

      // =====================================================
      // Notes
      // =====================================================

      notes:
        "Notes",

      notesPlaceholder:
        "Write notes about the location",

      // =====================================================
      // Save
      // =====================================================

      save:
        "Save Location",

      savedLocations:
        "Saved Locations",

      type:
        "Location Type",

      openGoogleMaps:
        "Open in Google Maps",

      delete:
        "Delete Location",

      noLocations:
        "No saved locations yet.",

      // =====================================================
      // Messages
      // =====================================================

      locationSuccess:
        "Location detected successfully.",

      locationError:
        "Unable to detect your current location.",

      permissionDenied:
        "Location permission was denied.",

      positionUnavailable:
        "Location information is unavailable.",

      locationTimeout:
        "Location request timed out.",

      farmRequired:
        "Please select a farm first.",

      coordinatesRequired:
        "Please determine the location before saving.",

      saveSuccess:
        "Location saved successfully.",

      saveError:
        "Unable to save the location.",

      deleteSuccess:
        "Location deleted successfully.",

      deleteError:
        "Unable to delete the location."
    }),

    // =======================================================
    // Harvest
    // =======================================================

    harvest: Object.freeze({

      title:
        "Harvest Management",

      addHarvest:
        "Add Harvest",

      editHarvest:
        "Edit Harvest",

      selectFarm:
        "Select Farm",

      selectField:
        "Select Field",

      selectCrop:
        "Select Crop",

      selectFarmFirst:
        "Select the farm first",

      selectFieldFirst:
        "Select the field first",

      noFields:
        "No fields for this farm",

      noCrops:
        "No crops for this field",

      quantity:
        "Harvest Quantity",

      quantityPlaceholder:
        "Enter harvest quantity",

      quality:
        "Crop Quality",

      qualityPlaceholder:
        "Enter crop quality",

      harvestDate:
        "Harvest Date",

      notes:
        "Notes",

      notesPlaceholder:
        "Write notes about the harvest",

      save:
        "Add Harvest",

      update:
        "Save Changes",

      cancel:
        "Cancel Edit",

      edit:
        "Edit",

      delete:
        "Delete",

      saving:
        "Saving...",

      statistics:
        "Harvest Statistics",

      operationsCount:
        "Harvest Operations",

      totalProduction:
        "Total Production",

      record:
        "Harvest Records",

      noRecords:
        "No harvest operations recorded yet.",

      farmName:
        "Farm",

      fieldName:
        "Field",

      cropName:
        "Crop",

      kg:
        "kg",

      unknownFarm:
        "Unknown Farm",

      unknownField:
        "Unknown Field",

      unknownCrop:
        "Unknown Crop",

      farmRequired:
        "Please select a farm.",

      fieldRequired:
        "Please select a field.",

      cropRequired:
        "Please select a crop.",

      quantityRequired:
        "Please enter a valid harvest quantity.",

      managementUnavailable:
        "Harvest management is unavailable.",

      saveError:
        "Unable to save the harvest operation.",

      deleteConfirm:
        "Do you want to delete this harvest operation?",

      deleteError:
        "Unable to delete the harvest operation.",

      success:
        "Harvest operation saved successfully."
    }),

    // =======================================================
    // Footer
    // =======================================================

    footer: Object.freeze({

      description:
        "Smart Farm Management System",

      management:
        "Crop, irrigation, and agricultural report management",

      rights:
        "All rights reserved"
    })

  }),

  // =========================================================
  // Türkçe
  // =========================================================

  tr: Object.freeze({

    // =======================================================
    // Ana Menü
    // =======================================================

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
      users: "Kullanıcılar",
      settings: "Ayarlar"
    }),

    // =======================================================
    // Ana Sayfa
    // =======================================================

    home: Object.freeze({
      title:
        "Akıllı Çiftlik Yönetimi",

      description:
        "Çiftlikleri, ürünleri, sulamayı ve gübreleri yönetmek için akıllı sistem.",

      start:
        "Başla",

      login:
        "Giriş Yap",

      services:
        "Hizmetler"
    }),

    // =======================================================
    // İletişim
    // =======================================================

    contact: Object.freeze({
      title:
        "Bize Ulaşın",

      name:
        "Ad",

      namePlaceholder:
        "Adınızı yazın",

      email:
        "E-posta",

      emailPlaceholder:
        "example@email.com",

      message:
        "Mesaj",

      messagePlaceholder:
        "Mesajınızı buraya yazın",

      send:
        "Gönder",

      required:
        "Lütfen tüm alanları doldurun.",

      invalidEmail:
        "Lütfen geçerli bir e-posta adresi girin.",

      success:
        "Mesajınız başarıyla gönderildi ve kaydedildi.",

      saveError:
        "Mesaj kaydedilemedi. Lütfen tekrar deneyin."
    }),

    // =======================================================
    // Ayarlar
    // =======================================================

    settings: Object.freeze({
      title:
        "Sistem Ayarları",

      global:
        "Genel Ayarlar",

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

      gps:
        "GPS'yi Etkinleştir",

      reset:
        "Varsayılan Ayarları Sıfırla"
    }),

    // =======================================================
    // Dil
    // =======================================================

    language: Object.freeze({
      ar:
        "Arapça",

      en:
        "İngilizce",

      tr:
        "Türkçe"
    }),

    // =======================================================
    // Ülkeler
    // =======================================================

    country: Object.freeze({
      SY:
        "Suriye",

      TR:
        "Türkiye",

      SA:
        "Suudi Arabistan",

      AE:
        "Birleşik Arap Emirlikleri",

      US:
        "Amerika Birleşik Devletleri",

      FR:
        "Fransa"
    }),

    // =======================================================
    // Para Birimleri
    // =======================================================

    currency: Object.freeze({
      SYP:
        "Suriye Lirası",

      TRY:
        "Türk Lirası",

      SAR:
        "Suudi Riyali",

      AED:
        "BAE Dirhemi",

      USD:
        "ABD Doları",

      EUR:
        "Euro"
    }),

    // =======================================================
    // Ölçü Birimleri
    // =======================================================

    unit: Object.freeze({
      dunum:
        "Dönüm",

      hectare:
        "Hektar",

      acre:
        "Akre",

      sqm:
        "Metrekare",

      kg:
        "Kilogram",

      ton:
        "Ton",

      liter:
        "Litre",

      cubic_meter:
        "Metreküp"
    }),

    // =======================================================
    // Harita
    // =======================================================

    map: Object.freeze({

      title:
        "Çiftlik Haritası",

      addLocation:
        "Konum Ekle",

      selectFarm:
        "Çiftlik Seç",

      farm:
        "Çiftlik",

      field:
        "Tarla",

      waterSource:
        "Su Kaynağı",

      // =====================================================
      // Konum Bilgileri
      // =====================================================

      village:
        "Köy Adı",

      region:
        "Bölge Adı",

      placeName:
        "Yer Adı",

      villagePlaceholder:
        "Köy adını yazın",

      regionPlaceholder:
        "Bölge adını yazın",

      placeNamePlaceholder:
        "Yer adını yazın",

      // =====================================================
      // GPS
      // =====================================================

      getGPS:
        "Mevcut Konumumu Belirle",

      locating:
        "Konum belirleniyor...",

      locationDetected:
        "Konum başarıyla belirlendi.",

      latitude:
        "Enlem",

      longitude:
        "Boylam",

      accuracy:
        "Konum Doğruluğu",

      meters:
        "metre",

      locationTime:
        "Konum Zamanı",

      // =====================================================
      // Notlar
      // =====================================================

      notes:
        "Notlar",

      notesPlaceholder:
        "Konum hakkında not yazın",

      // =====================================================
      // Kaydet
      // =====================================================

      save:
        "Konumu Kaydet",

      savedLocations:
        "Kayıtlı Konumlar",

      type:
        "Konum Türü",

      openGoogleMaps:
        "Google Haritalar'da Aç",

      delete:
        "Konumu Sil",

      noLocations:
        "Henüz kayıtlı konum yok.",

      // =====================================================
      // Mesajlar
      // =====================================================

      locationSuccess:
        "Konum başarıyla belirlendi.",

      locationError:
        "Mevcut konumunuz belirlenemedi.",

      permissionDenied:
        "Konum erişim izni reddedildi.",

      positionUnavailable:
        "Konum bilgileri kullanılamıyor.",

      locationTimeout:
        "Konum belirleme zaman aşımına uğradı.",

      farmRequired:
        "Lütfen önce bir çiftlik seçin.",

      coordinatesRequired:
        "Kaydetmeden önce konumu belirleyin.",

      saveSuccess:
        "Konum başarıyla kaydedildi.",

      saveError:
        "Konum kaydedilemedi.",

      deleteSuccess:
        "Konum başarıyla silindi.",

      deleteError:
        "Konum silinemedi."
    }),

    // =======================================================
    // Hasat
    // =======================================================

    harvest: Object.freeze({

      title:
        "Hasat Yönetimi",

      addHarvest:
        "Hasat Ekle",

      editHarvest:
        "Hasadı Düzenle",

      selectFarm:
        "Çiftlik Seç",

      selectField:
        "Tarla Seç",

      selectCrop:
        "Ürün Seç",

      selectFarmFirst:
        "Önce çiftliği seçin",

      selectFieldFirst:
        "Önce tarlayı seçin",

      noFields:
        "Bu çiftlik için tarla bulunamadı",

      noCrops:
        "Bu tarla için ürün bulunamadı",

      quantity:
        "Hasat Miktarı",

      quantityPlaceholder:
        "Hasat miktarını girin",

      quality:
        "Ürün Kalitesi",

      qualityPlaceholder:
        "Ürün kalitesini girin",

      harvestDate:
        "Hasat Tarihi",

      notes:
        "Notlar",

      notesPlaceholder:
        "Hasat işlemi hakkında not yazın",

      save:
        "Hasat Ekle",

      update:
        "Değişiklikleri Kaydet",

      cancel:
        "Düzenlemeyi İptal Et",

      edit:
        "Düzenle",

      delete:
        "Sil",

      saving:
        "Kaydediliyor...",

      statistics:
        "Hasat İstatistikleri",

      operationsCount:
        "Hasat İşlemleri",

      totalProduction:
        "Toplam Üretim",

      record:
        "Hasat Kayıtları",

      noRecords:
        "Henüz kayıtlı hasat işlemi yok.",

      farmName:
        "Çiftlik",

      fieldName:
        "Tarla",

      cropName:
        "Ürün",

      kg:
        "kg",

      unknownFarm:
        "Bilinmeyen Çiftlik",

      unknownField:
        "Bilinmeyen Tarla",

      unknownCrop:
        "Bilinmeyen Ürün",

      farmRequired:
        "Lütfen bir çiftlik seçin.",

      fieldRequired:
        "Lütfen bir tarla seçin.",

      cropRequired:
        "Lütfen bir ürün seçin.",

      quantityRequired:
        "Lütfen geçerli bir hasat miktarı girin.",

      managementUnavailable:
        "Hasat yönetimi kullanılamıyor.",

      saveError:
        "Hasat işlemi kaydedilemedi.",

      deleteConfirm:
        "Bu hasat işlemini silmek istiyor musunuz?",

      deleteError:
        "Hasat işlemi silinemedi.",

      success:
        "Hasat işlemi başarıyla kaydedildi."
    }),

    // =======================================================
    // Alt Bilgi
    // =======================================================

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


// =========================================================
// Nested Translation
// =========================================================

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


// =========================================================
// Translate
// =========================================================

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
