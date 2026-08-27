// src/hooks/useFields.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import fieldService
  from "../services/fieldService.js";


export default function useFields() {

  const [
    fields,
    setFields,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState(null);


  const loadFields = useCallback(
    async () => {

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

        setError(err);

        throw err;

      } finally {

        setLoading(false);

      }

    },
    []
  );


  const getFieldById = useCallback(
    async (id) => {

      if (!id) {
        return null;
      }

      try {

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
            (current) => [
              ...current,
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
            (current) =>
              current.map(
                (field) => {

                  const fieldId =
                    field?.id ??
                    field?._id ??
                    field?.fieldId;

                  return (
                    String(fieldId) ===
                    String(id)
                  )
                    ? updated
                    : field;

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


  const deleteField = useCallback(
    async (id) => {

      try {

        setLoading(true);
        setError(null);

        await fieldService.delete(id);

        setFields(
          (current) =>
            current.filter(
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


  const getFieldsByFarm =
    useCallback(
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


  const getStatistics =
    useCallback(
      (items) => {

        const source =
          Array.isArray(items)
            ? items
            : fields;

        return {
          total: source.length,
        };

      },
      [fields]
    );


  const statistics =
    getStatistics(fields);


  useEffect(() => {

    let mounted = true;


    const initialize =
      async () => {

        try {

          setLoading(true);
          setError(null);

          const data =
            await fieldService.getAll();

          if (!mounted) {
            return;
          }

          setFields(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (err) {

          if (mounted) {
            setError(err);
          }

        } finally {

          if (mounted) {
            setLoading(false);
          }

        }

      };


    initialize();


    return () => {

      mounted = false;

    };

  }, []);


  return {

    fields,

    loading,

    error,

    loadFields,

    getFieldById,

    addField,

    updateField,

    deleteField,

    searchFields,

    getFieldsByFarm,

    getStatistics,

    statistics,

  };

}
