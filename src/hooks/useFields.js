// src/hooks/useFields.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import fieldService from "../services/fieldService.js";


// =========================================================
// LAVENDER — useFields
// =========================================================
// مسؤول عن:
//
// 1. تحميل الحقول
// 2. إضافة حقل
// 3. تعديل حقل
// 4. حذف حقل
// 5. البحث في الحقول
// 6. إحصائيات الحقول
//
// المسار:
//
// Fields.jsx / Crops.jsx
//        ↓
// useFields.js
//        ↓
// fieldService.js
//        ↓
// fieldRepository.js
//
// مهم:
// - لا يستخدم FarmContext
// - لا يصل مباشرة إلى DataModel
// - لا يحتوي على GPS
// - لا يحتوي على Nominatim
// - لا يحتوي على useGeoLocation
// =========================================================


export default function useFields() {


  // =======================================================
  // Fields
  // =======================================================

  const [
    fields,
    setFields,
  ] = useState([]);


  // =======================================================
  // Loading
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =======================================================
  // Error
  // =======================================================

  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // Load Fields
  // =======================================================

  const loadFields = useCallback(
    async () => {

      try {

        setLoading(true);
        setError(null);


        const data =
          await fieldService.getAllFields();


        const fieldsData =
          Array.isArray(data)
            ? data
            : [];


        setFields(
          fieldsData
        );


        return fieldsData;

      } catch (err) {

        console.error(
          "useFields loadFields error:",
          err
        );


        setError(err);


        return [];

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Add Field
  // =======================================================

  const addField = useCallback(
    async (
      data
    ) => {

      try {

        setLoading(true);
        setError(null);


        const created =
          await fieldService.createField(
            data
          );


        if (created) {

          setFields(
            (currentFields) => [

              ...currentFields,

              created,

            ]
          );

        }


        return created;

      } catch (err) {

        console.error(
          "useFields addField error:",
          err
        );


        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Update Field
  // =======================================================

  const updateField = useCallback(
    async (
      id,
      data
    ) => {

      try {

        setLoading(true);
        setError(null);


        const updated =
          await fieldService.updateField(
            id,
            data
          );


        if (updated) {

          setFields(
            (currentFields) =>

              currentFields.map(
                (field) => {

                  const fieldId =
                    field?.id ??
                    field?._id ??
                    field?.fieldId;


                  if (
                    String(fieldId) ===
                    String(id)
                  ) {

                    return updated;

                  }


                  return field;

                }
              )

          );

        }


        return updated;

      } catch (err) {

        console.error(
          "useFields updateField error:",
          err
        );


        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Delete Field
  // =======================================================

  const deleteField = useCallback(
    async (
      id
    ) => {

      try {

        setLoading(true);
        setError(null);


        const deleted =
          await fieldService.deleteField(
            id
          );


        setFields(
          (currentFields) =>

            currentFields.filter(
              (field) => {

                const fieldId =
                  field?.id ??
                  field?._id ??
                  field?.fieldId;


                return (
                  String(fieldId) !==
                  String(id)
                );

              }
            )

        );


        return deleted;

      } catch (err) {

        console.error(
          "useFields deleteField error:",
          err
        );


        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Search Fields
  // =======================================================

  const searchFields = useCallback(
    (
      items,
      text = ""
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : fields;


      const value =
        String(text)
          .toLowerCase()
          .trim();


      if (!value) {

        return source;

      }


      return source.filter(
        (field) => {

          const name =
            field?.name ??
            field?.fieldName ??
            field?.title ??
            "";


          const farmId =
            field?.farmId ??
            field?.farm_id ??
            field?.farm?.id ??
            "";


          return (

            String(name)
              .toLowerCase()
              .includes(value)

            ||

            String(farmId)
              .toLowerCase()
              .includes(value)

          );

        }
      );

    },
    [fields]
  );


  // =======================================================
  // Statistics
  // =======================================================

  const getStatistics = useCallback(
    (
      items
    ) => {

      const source =
        Array.isArray(items)
          ? items
          : fields;


      return {

        total:
          source.length,


        active:
          source.filter(
            (field) =>
              field?.status ===
              "active"
          ).length,


        inactive:
          source.filter(
            (field) =>
              field?.status ===
              "inactive"
          ).length,

      };

    },
    [fields]
  );


  // =======================================================
  // Current Statistics
  // =======================================================

  const statistics =
    getStatistics(
      fields
    );


  // =======================================================
  // Initial Load
  // =======================================================

  useEffect(() => {

    let mounted = true;


    const loadInitialFields =
      async () => {

        try {

          setLoading(true);
          setError(null);


          const data =
            await fieldService.getAllFields();


          if (!mounted) {

            return;

          }


          const fieldsData =
            Array.isArray(data)
              ? data
              : [];


          setFields(
            fieldsData
          );

        } catch (err) {

          if (!mounted) {

            return;

          }


          console.error(
            "useFields initial load error:",
            err
          );


          setError(err);

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadInitialFields();


    return () => {

      mounted = false;

    };

  }, []);


  // =======================================================
  // Return
  // =======================================================

  return {

    // البيانات
    fields,

    // الحالة
    loading,
    error,

    // العمليات
    loadFields,
    addField,
    updateField,
    deleteField,

    // البحث
    searchFields,

    // الإحصائيات
    getStatistics,
    statistics,

  };

}
