// src/hooks/useFields.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import fieldService
  from "../services/fieldService.js";


// =========================================================
// LAVENDER — useFields
//
// مسؤول عن:
// 1. تحميل الحقول
// 2. إضافة حقل
// 3. تعديل حقل
// 4. حذف حقل
// 5. البحث في الحقول
// 6. إحصائيات الحقول
//
// Architecture:
//
// Fields.jsx
//     ↓
// useFields.js
//     ↓
// fieldService.js
//     ↓
// fieldRepository.js
//
// مهم:
// هذا الـ Hook لا يصل مباشرة إلى:
// DataModel
// storageService
// fieldRepository
//
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
          await fieldService.getAll();


        const fieldsData =
          Array.isArray(data)
            ? data
            : [];


        setFields(
          fieldsData
        );


        return fieldsData;

      } catch (err) {

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // =======================================================
  // Get Field By ID
  // =======================================================

  const getFieldById = useCallback(
    async (id) => {

      try {

        if (!id) {

          return null;

        }


        setError(null);


        return await fieldService.getById(
          id
        );

      } catch (err) {

        setError(err);

        throw err;

      }

    },
    []
  );


  // =======================================================
  // Add Field
  // =======================================================

  const addField = useCallback(
    async (data) => {

      try {

        setLoading(true);

        setError(null);


        const created =
          await fieldService.create(
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
          await fieldService.update(
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
    async (id) => {

      try {

        setLoading(true);

        setError(null);


        await fieldService.delete(
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


        return true;

      } catch (err) {

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


          return String(name)
            .toLowerCase()
            .includes(value);

        }
      );

    },
    [fields]
  );


  // =======================================================
  // Get Fields By Farm
  // =======================================================

  const getFieldsByFarm = useCallback(
    (
      farmId,
      items = fields
    ) => {

      if (!farmId) {

        return [];

      }


      const source =
        Array.isArray(items)
          ? items
          : [];


      return source.filter(
        (field) => {

          const fieldFarmId =
            field?.farmId ??
            field?.farm_id ??
            field?.farm?.id ??
            "";


          return (
            String(fieldFarmId) ===
            String(farmId)
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
  //
  // يتم تحميل الحقول مرة واحدة عند تشغيل Hook.
  // =======================================================

  useEffect(() => {

    let mounted = true;


    const loadInitialFields =
      async () => {

        try {

          setLoading(true);

          setError(null);


          const data =
            await fieldService.getAll();


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

    // العمليات الأساسية
    loadFields,
    getFieldById,
    addField,
    updateField,
    deleteField,

    // البحث
    searchFields,

    // الحقول حسب المزرعة
    getFieldsByFarm,

    // الإحصائيات
    getStatistics,
    statistics,

  };

}
