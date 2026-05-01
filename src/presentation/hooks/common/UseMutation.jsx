import { useState, useRef, useCallback } from 'react';

export function UseMutation(mutationFunction, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { onSuccess, onError } = options;

  // 🔥 control de concurrencia
  const requestIdRef = useRef(0);

  const execute = useCallback(async (...args) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await mutationFunction(...args);

      // ✅ solo la última mutación puede afectar estado
      if (requestId !== requestIdRef.current) return;

      setData(response);
      onSuccess?.(response);

      return response;

    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setError(getErrorMessage(err));
      onError?.(getErrorMessage(err));

      throw err;

    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [mutationFunction, onSuccess, onError]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

function getErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;
  return 'Error inesperado';
}

  return {
    execute,
    loading,
    error,
    data,
    reset
  };
}