import { useState, useEffect, useRef, useCallback } from 'react';

export function UseSingleResource(fetchFunction, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 control de concurrencia
  const requestIdRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!id) {
      setData(null); // 🔥 limpiar data
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(id);

      // ✅ evita race condition
      if (requestId !== requestIdRef.current) return;

      setData(response?.data ?? null);

    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setError(err?.message || 'Error al cargar recurso');

    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, id]);

  useEffect(() => {
    if(!id) return;
    loadData();
  }, [loadData, id]);

const refetch = useCallback(() => {
  loadData();
}, [loadData]);


  return {
    data,
    loading,
    error,
    refetch
  };
}