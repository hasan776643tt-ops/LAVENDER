// src/hooks/useFields.js

import {
  useCallback,
  useState,
} from "react";

import fieldService
  from "../services/fieldService.js";


// =========================================================
// LAVENDER — useFields
//
// المسؤول عن إدارة الحقول داخل الواجهة.
//
// Architecture:
//
// Fields.jsx / Crops.jsx
//        ↓
// useFields.js
//        ↓
// fieldService.js
//        ↓
// fieldRepository.js
//        ↓
// storageService
//
// هذا الـ Hook لا يصل مباشرة إلى:
// - DataModel
// - storageService
// - fieldRepository
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

      setLoading(true);
      setError(null);


      try {

        const data =
          await fieldService.getAll();


        const result =
          Array.isArray(data)
            ? data
            : [];


        setFields(result);


        return result;

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

      if (!id) {

        return null;

      }


      setError(null);


      try {

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

      setLoading(true);
      setError(null);


      try {

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

      setLoading(true);
      setError(null);


      try {

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

      setLoading(true);
      setError(null);


      try {

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
          .trim()
          .toLowerCase();


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
      items
    ) => {

      if (!farmId) {

        return [];

      }


      const source =
        Array.isArray(items)
          ? items
          : fields;


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
    (items) => {

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
    getStatistics(fields);


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

    // حسب المزرعة
    getFieldsByFarm,

    // الإحصائيات
    getStatistics,
    statistics,

  };

}
