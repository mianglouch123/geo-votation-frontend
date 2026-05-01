import { useState, useEffect, useRef, useCallback } from 'react';

export function UsePagination(fetchFunction, initialPage = 1, initialLimit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasPrev: false,
    hasNext: false
  });

  // 🔥 Control de concurrencia
  const requestIdRef = useRef(0);

  const loadData = useCallback(async (page = pagination.page, limit = pagination.limit , extra = {}) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFunction({ page, limit });

      // ✅ Evita race condition
      if (requestId !== requestIdRef.current) return;

      const responseData = response?.data || [];

      setData(responseData);

      const paginationData =
        response.pagination ||
        response.data?.metadata?.pagination ||
        response.data?.pagination ||
        response.metadata?.pagination;

      if (paginationData) {
        setPagination(paginationData);
      } else {
        // ✅ usar responseData, no state viejo
        setPagination({
          page: 1,
          limit: responseData.length,
          total: responseData.length,
          totalPages: 1,
          hasPrev: false,
          hasNext: false
        });
      }

    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setError(err?.message || 'Error al cargar datos');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, pagination.page, pagination.limit]);

  // 🔥 Ahora reacciona si cambia fetchFunction (ej: read)
  useEffect(() => {
    loadData(initialPage, initialLimit);
  }, [loadData, initialPage, initialLimit]);

  const nextPage = () => {
    const next = pagination.page + 1;
    if (next <= pagination.totalPages) {
      loadData(next, pagination.limit);
    }
  };

  const prevPage = () => {
    const prev = pagination.page - 1;
    if (prev >= 1) {
      loadData(prev, pagination.limit);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.page) {
      loadData(page, pagination.limit);
    }
  };

  const refetch = () => {
    loadData(pagination.page, pagination.limit);
  };

  return {
    data,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refetch
  };
}