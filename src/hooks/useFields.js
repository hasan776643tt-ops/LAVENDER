// src/hooks/useFields.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import fieldService
  from "../services/fieldService.js";


export default function useFields() {

  const [fields, setFields] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);


  // =========================
  // Load Fields
  // =========================

  const loadFields =
    useCallback(async () => {

      try {

        setLoading(true);
        setError(null);


        const data =
          await fieldService.getAll();


        const result =
          Array.isArray(data)
            ? data
            : [];


        setFields(result);


        return result;


      } catch (err) {

        console.error(
          "useFields loadFields error:",
          err
        );


        setError(
          err?.message ||
          "تعذر تحميل الحقول."
        );


        setFields([]);


        return [];


      } finally {

        setLoading(false);

      }

    }, []);


  // =========================
  // Add Field
  // =========================

  const addField =
    useCallback(async (fieldData) => {

      try {

        setLoading(true);
        setError(null);


        const created =
          await fieldService.create(
            fieldData
          );


        await loadFields();


        return created;


      } catch (err) {

        console.error(
          "useFields addField error:",
          err
        );


        setError(
          err?.message ||
          "تعذر إضافة الحقل."
        );


        throw err;


      } finally {

        setLoading(false);

      }

    }, [
      loadFields,
    ]);


  // =========================
  // Update Field
  // =========================

  const updateField =
    useCallback(
      async (
        id,
        fieldData
      ) => {

        try {

          setLoading(true);
          setError(null);


          const updated =
            await fieldService.update(
              id,
              fieldData
            );


          await loadFields();


          return updated;


        } catch (err) {

          console.error(
            "useFields updateField error:",
            err
          );


          setError(
            err?.message ||
            "تعذر تعديل الحقل."
          );


          throw err;


        } finally {

          setLoading(false);

        }

      },
      [
        loadFields,
      ]
    );


  // =========================
  // Delete Field
  // =========================

  const deleteField =
    useCallback(async (id) => {

      try {

        setLoading(true);
        setError(null);


        const result =
          await fieldService.delete(
            id
          );


        await loadFields();


        return result;


      } catch (err) {

        console.error(
          "useFields deleteField error:",
          err
        );


        setError(
          err?.message ||
          "تعذر حذف الحقل."
        );


        throw err;


      } finally {

        setLoading(false);

      }

    }, [
      loadFields,
    ]);


  // =========================
  // Search Fields
  // =========================

  const searchFields =
    useCallback(
      async (query = "") => {

        try {

          setError(null);


          const data =
            await fieldService.getAll();


          const allFields =
            Array.isArray(data)
              ? data
              : [];


          const normalizedQuery =
            String(query)
              .trim()
              .toLowerCase();


          if (!normalizedQuery) {

            return allFields;

          }


          return allFields.filter(
            (field) => {

              const name =
                String(
                  field?.name || ""
                ).toLowerCase();


              const soilType =
                String(
                  field?.soilType ||
                  field?.soil_type ||
                  ""
                ).toLowerCase();


              const crop =
                String(
                  field?.crop || ""
                ).toLowerCase();


              return (
                name.includes(
                  normalizedQuery
                ) ||
                soilType.includes(
                  normalizedQuery
                ) ||
                crop.includes(
                  normalizedQuery
                )
              );

            }
          );


        } catch (err) {

          console.error(
            "useFields searchFields error:",
            err
          );


          setError(
            err?.message ||
            "تعذر البحث في الحقول."
          );


          return [];

        }

      },
      []
    );


  // =========================
  // Initial Load
  // =========================

  useEffect(() => {

    loadFields();

  }, [
    loadFields,
  ]);


  // =========================
  // Return
  // =========================

  return {

    fields,

    loading,

    error,

    loadFields,

    addField,

    updateField,

    deleteField,

    searchFields,

  };

}
