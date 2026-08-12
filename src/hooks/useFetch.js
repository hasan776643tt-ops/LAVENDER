// src/hooks/useFetch.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export default function useFetch(
  fetchFunction,
  dependencies = []
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async () => {
      if (typeof fetchFunction !== "function") {
        const validationError = new Error(
          "useFetch requires a fetch function"
        );

        setError(validationError);
        throw validationError;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction();

        setData(result);

        return result;
      } catch (err) {
        const normalizedError =
          err instanceof Error
            ? err
            : new Error(
                String(err || "حدث خطأ أثناء جلب البيانات")
              );

        setError(normalizedError);

        throw normalizedError;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, ...dependencies]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await fetchData();
      } catch {
        if (!mounted) {
          return;
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  const refresh = useCallback(
    async () => {
      return fetchData();
    },
    [fetchData]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    reset,
  };
}
