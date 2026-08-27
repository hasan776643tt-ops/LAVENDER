// src/hooks/useMap.js

import {
  useEffect,
  useState,
} from "react";

import mapService
  from "../services/mapService.js";

import farmService
  from "../services/farmService.js";

import {
  translate,
} from "../utils/translation";

import {
  useSettings,
} from "../context/SettingsContext";


export default function useMap() {

  // =========================================================
  // Settings / Language
  // =========================================================

  const {
    settings,
  } = useSettings();

  const language =
    settings?.language || "ar";


  // =========================================================
  // Translation
  // =========================================================

  const t = (key) =>
    translate(
      `map.${key}`,
      language
    );


  // =========================================================
  // Farms / Locations
  // =========================================================

  const [farms, setFarms] =
    useState([]);

  const [locations, setLocations] =
    useState([]);


  // =========================================================
  // Farm / Location Type
  // =========================================================

  const [farmId, setFarmId] =
    useState("");

  const [locationType, setLocationType] =
    useState("farm");


  // =========================================================
  // Location Mode
  // =========================================================

  const [locationMode, setLocationMode] =
    useState("gps");


  // =========================================================
  // Human-readable Location
  // =========================================================

  const [village, setVillage] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [placeName, setPlaceName] =
    useState("");


  // =========================================================
  // REAL Coordinates
  // =========================================================

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");


  // =========================================================
  // GPS Accuracy
  // =========================================================

  const [accuracy, setAccuracy] =
    useState("");


  // =========================================================
  // Location Time
  // =========================================================

  const [locationTime, setLocationTime] =
    useState("");


  // =========================================================
  // Location Source
  // =========================================================

  const [locationSource, setLocationSource] =
    useState("gps");


  // =========================================================
  // Notes
  // =========================================================

  const [notes, setNotes] =
    useState("");


  // =========================================================
  // Loading
  // =========================================================

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // Error Translation
  // =========================================================

  const getMapErrorMessage =
    (error) => {

      switch (error?.message) {

        case "MAP_DATA_REQUIRED":

          return t("saveError");


        case "MAP_FARM_REQUIRED":

          return t("farmRequired");


        case "MAP_COORDINATES_REQUIRED":

          return t("coordinatesRequired");


        case "MAP_ID_REQUIRED":

          return t("deleteError");


        case "MAP_GEOCODING_FAILED":

          return t("addressError");


        default:

          return t("saveError");

      }

    };


  // =========================================================
  // Load Farms + Locations
  // =========================================================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

      try {

        const [
          farmsData,
          locationsData,
        ] = await Promise.all([

          farmService.getAllFarms(),

          mapService.getAllLocations(),

        ]);


        if (!mounted) {

          return;

        }


        setFarms(

          Array.isArray(farmsData)
            ? farmsData
            : []

        );


        setLocations(

          Array.isArray(locationsData)
            ? locationsData
            : []

        );

      } catch (error) {

        console.error(
          "Failed to load map data:",
          error
        );


        if (mounted) {

          setFarms([]);

          setLocations([]);

        }

      }

    };


    loadData();


    return () => {

      mounted = false;

    };

  }, []);


  // =========================================================
  // Apply Location
  //
  // GPS / Manual
  //
  // الإحداثيات هي المصدر الحقيقي للموقع.
  // =========================================================

  const applyLocation =
    async ({
      latitude: selectedLatitude,
      longitude: selectedLongitude,
      accuracy: selectedAccuracy = null,
      source = "gps",
    }) => {

      const lat =
        Number(selectedLatitude);

      const lon =
        Number(selectedLongitude);


      // -------------------------------------------------------
      // Validate Coordinates
      // -------------------------------------------------------

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {

        throw new Error(
          "MAP_COORDINATES_REQUIRED"
        );

      }


      // -------------------------------------------------------
      // REAL coordinates
      // لا تقريب ولا تحويل
      // -------------------------------------------------------

      setLatitude(lat);

      setLongitude(lon);


      // -------------------------------------------------------
      // Accuracy
      // -------------------------------------------------------

      if (
        selectedAccuracy !== null &&
        selectedAccuracy !== undefined &&
        Number.isFinite(
          Number(selectedAccuracy)
        )
      ) {

        setAccuracy(
          Number(selectedAccuracy)
        );

      } else {

        setAccuracy("");

      }


      // -------------------------------------------------------
      // Source
      // -------------------------------------------------------

      setLocationSource(
        source
      );


      // -------------------------------------------------------
      // Time
      // -------------------------------------------------------

      const now =
        new Date();


      setLocationTime(

        now.toLocaleString(

          language === "tr"
            ? "tr-TR"
            : language === "en"
            ? "en-US"
            : "ar-SY"

        )

      );


      // =======================================================
      // Reverse Geocoding
      //
      // وصفي فقط.
      // لا يغير الإحداثيات.
      // =======================================================

      try {

        const address =
          await mapService.reverseGeocode(
            lat,
            lon,
            language
          );


        setVillage(

          address?.village ||
          address?.hamlet ||
          ""

        );


        setRegion(

          address?.region ||
          address?.district ||
          address?.state ||
          address?.province ||
          ""

        );


        setPlaceName(

          address?.displayName ||
          address?.nearestPlace ||
          ""

        );

      } catch (error) {

        console.warn(
          "Reverse geocoding failed:",
          error
        );


        // GPS remains valid.
        // فقط المعلومات الوصفية غير متوفرة.

        setVillage("");

        setRegion("");

        setPlaceName("");

      }

    };


  // =========================================================
  // Get Current GPS Location
  //
  // IMPORTANT
  //
  // المتصفح يستطيع طلب صلاحية الموقع.
  // لكنه لا يستطيع تشغيل مفتاح GPS في الهاتف بالقوة.
  //
  // لذلك:
  //
  // 1. نفحص دعم Geolocation.
  // 2. نفحص Permission API إن كان مدعومًا.
  // 3. إذا كانت الصلاحية denied نوضح للمستخدم المشكلة.
  // 4. إذا كانت prompt نطلب الموقع من المتصفح.
  // 5. إذا كانت granted نبدأ تحديد الموقع.
  // =========================================================

  const getCurrentLocation =
    async () => {

      // -------------------------------------------------------
      // Browser support
      // -------------------------------------------------------

      if (
        typeof navigator === "undefined" ||
        !navigator.geolocation
      ) {

        alert(
          t("locationError")
        );

        return;

      }


      // -------------------------------------------------------
      // منع الضغط المتكرر
      // -------------------------------------------------------

      if (loading) {

        return;

      }


      setLocationMode("gps");

      setLoading(true);


      try {

        // =====================================================
        // Permission API
        // =====================================================

        if (
          navigator.permissions &&
          typeof navigator.permissions.query ===
            "function"
        ) {

          try {

            const permission =
              await navigator.permissions.query({
                name: "geolocation",
              });


            // -------------------------------------------------
            // Permission permanently denied
            // -------------------------------------------------

            if (
              permission.state ===
              "denied"
            ) {

              alert(
                language === "en"
                  ? "Location permission is blocked. Please allow location permission for this website from your browser settings, then try again."
                  : language === "tr"
                  ? "Konum izni engellendi. Lütfen tarayıcı ayarlarından bu site için konum iznini etkinleştirin ve tekrar deneyin."
                  : "تم رفض صلاحية الموقع. يرجى السماح للموقع بالوصول إلى موقع الهاتف من إعدادات المتصفح، ثم حاول مرة أخرى."
              );

              setLoading(false);

              return;

            }

          } catch (permissionError) {

            // -------------------------------------------------
            // بعض المتصفحات لا تدعم Permission API بشكل كامل.
            // نكمل باستخدام getCurrentPosition.
            // -------------------------------------------------

            console.warn(
              "Location permission check unavailable:",
              permissionError
            );

          }

        }


        // =====================================================
        // Request browser / phone location
        // =====================================================

        navigator.geolocation.getCurrentPosition(

          // ===================================================
          // SUCCESS
          // ===================================================

          async (position) => {

            try {

              const {
                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                accuracy:
                  currentAccuracy,

              } = position.coords;


              // -----------------------------------------------
              // Apply original GPS coordinates
              // -----------------------------------------------

              await applyLocation({

                latitude:
                  currentLatitude,

                longitude:
                  currentLongitude,

                accuracy:
                  currentAccuracy,

                source:
                  "gps",

              });


              alert(
                t("locationSuccess")
              );

            } catch (error) {

              console.error(
                "GPS processing error:",
                error
              );


              alert(
                getMapErrorMessage(error)
              );

            } finally {

              setLoading(false);

            }

          },


          // ===================================================
          // ERROR
          // ===================================================

          (error) => {

            console.error(
              "GPS error:",
              error
            );


            let message;


            // -------------------------------------------------
            // PERMISSION_DENIED
            // -------------------------------------------------

            if (
              error?.code ===
              1
            ) {

              message =
                language === "en"
                  ? "Location permission was denied. Please allow location access for this website from the browser settings, then try again."
                  : language === "tr"
                  ? "Konum izni reddedildi. Lütfen tarayıcı ayarlarından bu site için konum erişimine izin verin ve tekrar deneyin."
                  : "تم رفض صلاحية الوصول إلى الموقع. يرجى السماح لهذا الموقع بالوصول إلى الموقع من إعدادات المتصفح، ثم المحاولة مرة أخرى.";

            }


            // -------------------------------------------------
            // POSITION_UNAVAILABLE
            //
            // غالبًا:
            // GPS مغلق
            // أو الهاتف لا يستطيع تحديد الموقع.
            // -------------------------------------------------

            else if (
              error?.code ===
              2
            ) {

              message =
                language === "en"
                  ? "Your phone could not determine your location. Please turn ON Location/GPS on your phone and try again."
                  : language === "tr"
                  ? "Telefonunuz konumunuzu belirleyemedi. Lütfen telefonunuzun Konum/GPS özelliğini açın ve tekrar deneyin."
                  : "تعذر تحديد موقع الهاتف. يرجى تشغيل «الموقع / GPS» في الهاتف ثم الضغط على تحديد الموقع مرة أخرى.";

            }


            // -------------------------------------------------
            // TIMEOUT
            // -------------------------------------------------

            else if (
              error?.code ===
              3
            ) {

              message =
                language === "en"
                  ? "Location detection timed out. Please turn ON Location/GPS, make sure you have a clear signal, and try again."
                  : language === "tr"
                  ? "Konum belirleme zaman aşımına uğradı. Lütfen Konum/GPS özelliğini açın ve tekrar deneyin."
                  : "انتهى وقت تحديد الموقع. يرجى تشغيل «الموقع / GPS» والتأكد من توفر إشارة جيدة ثم المحاولة مرة أخرى.";

            }


            // -------------------------------------------------
            // UNKNOWN
            // -------------------------------------------------

            else {

              message =
                t("locationError");

            }


            alert(message);


            setLoading(false);

          },


          // ===================================================
          // GPS OPTIONS
          // ===================================================

          {

            enableHighAccuracy:
              true,

            timeout:
              30000,

            maximumAge:
              0,

          }

        );

      } catch (error) {

        console.error(
          "Location request error:",
          error
        );


        alert(
          language === "en"
            ? "Unable to request your location. Please check your browser and phone location settings."
            : language === "tr"
            ? "Konum isteği yapılamadı. Lütfen tarayıcı ve telefon konum ayarlarınızı kontrol edin."
            : "تعذر طلب الموقع. يرجى التحقق من إعدادات الموقع في المتصفح والهاتف."
        );


        setLoading(false);

      }

    };


  // =========================================================
  // Manual Map Location
  // =========================================================

  const selectManualLocation =
    async (
      selectedLatitude,
      selectedLongitude
    ) => {

      try {

        setLoading(true);

        setLocationMode("manual");


        await applyLocation({

          latitude:
            selectedLatitude,

          longitude:
            selectedLongitude,

          accuracy:
            null,

          source:
            "manual",

        });

      } catch (error) {

        console.error(
          "Manual map location error:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Add Location
  // =========================================================

  const addLocation =
    async () => {

      // -------------------------------------------------------
      // Farm
      // -------------------------------------------------------

      if (!farmId) {

        alert(
          t("farmRequired")
        );

        return;

      }


      // -------------------------------------------------------
      // Coordinates
      // -------------------------------------------------------

      if (
        latitude === "" ||
        longitude === "" ||
        latitude === null ||
        longitude === null
      ) {

        alert(
          t("coordinatesRequired")
        );

        return;

      }


      const numericLatitude =
        Number(latitude);

      const numericLongitude =
        Number(longitude);


      if (
        !Number.isFinite(
          numericLatitude
        ) ||
        !Number.isFinite(
          numericLongitude
        )
      ) {

        alert(
          t("coordinatesRequired")
        );

        return;

      }


      // -------------------------------------------------------
      // Find Farm
      // -------------------------------------------------------

      const farm =
        farms.find(

          (item) =>
            String(item.id) ===
            String(farmId)

        );


      // =======================================================
      // Location Data
      // =======================================================

      const locationData = {

        farmId:
          String(farmId),


        farmName:
          farm?.name ||
          t("farm"),


        village:
          village.trim(),


        region:
          region.trim(),


        placeName:
          placeName.trim(),


        type:
          locationType,


        // -----------------------------------------------------
        // REAL coordinates
        // -----------------------------------------------------

        latitude:
          numericLatitude,


        longitude:
          numericLongitude,


        // -----------------------------------------------------
        // Accuracy
        // -----------------------------------------------------

        accuracy:

          accuracy !== "" &&
          accuracy !== null &&
          accuracy !== undefined

            ? Number(accuracy)

            : null,


        // -----------------------------------------------------
        // Source
        // -----------------------------------------------------

        source:
          locationSource,


        // -----------------------------------------------------
        // Notes
        // -----------------------------------------------------

        notes:
          notes.trim(),


        // -----------------------------------------------------
        // Timestamp
        // -----------------------------------------------------

        createdAt:
          new Date().toISOString(),


        status:
          "active",

      };


      // =====================================================
      // Save
      // =====================================================

      try {

        setLoading(true);


        const newLocation =
          await mapService.createLocation(
            locationData
          );


        if (newLocation) {

          setLocations(

            (current) => [

              ...current,
              newLocation,

            ]

          );

        }


        // ===================================================
        // Reset
        // ===================================================

        setFarmId("");

        setLocationMode("gps");

        setLocationType("farm");

        setVillage("");

        setRegion("");

        setPlaceName("");

        setLatitude("");

        setLongitude("");

        setAccuracy("");

        setLocationTime("");

        setLocationSource("gps");

        setNotes("");


        alert(
          t("saveSuccess")
        );

      } catch (error) {

        console.error(
          "Failed to create location:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Delete Location
  // =========================================================

  const deleteLocation =
    async (id) => {

      if (!id) {

        alert(
          t("deleteError")
        );

        return;

      }


      try {

        setLoading(true);


        const deleted =
          await mapService.deleteLocation(
            id
          );


        if (!deleted) {

          alert(
            t("deleteError")
          );

          return;

        }


        setLocations(

          (current) =>

            current.filter(

              (item) =>
                String(item.id) !==
                String(id)

            )

        );


        alert(
          t("deleteSuccess")
        );

      } catch (error) {

        console.error(
          "Failed to delete location:",
          error
        );


        alert(
          getMapErrorMessage(error)
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // Return
  // =========================================================

  return {

    farms,

    locations,


    farmId,

    setFarmId,


    locationType,

    setLocationType,


    locationMode,

    setLocationMode,


    village,

    setVillage,

    region,

    setRegion,

    placeName,

    setPlaceName,


    latitude,

    setLatitude,

    longitude,

    setLongitude,


    accuracy,

    locationTime,


    locationSource,


    notes,

    setNotes,


    loading,


    getCurrentLocation,

    selectManualLocation,

    addLocation,

    deleteLocation,

  };

}
