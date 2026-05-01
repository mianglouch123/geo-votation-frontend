// presentation/hooks/user/UseUserVotationsByRaw.js
import { useState, useEffect, useCallback } from 'react';
import { UserRepositoryImpl } from '../../../infraestructure/repositories/UserRepositoryImpl.js';
import { GetUserVotationsByRawUseCase } from '../../../application/use-cases/user/GetUserVotationsByRawUseCase.js';

const userRepository = new UserRepositoryImpl();
const getUserVotationsByRawUseCase = new GetUserVotationsByRawUseCase(userRepository);

export function UseUserVotationsByRaw(types = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [page, setPage] = useState(1);

  const loadVotations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10
      };
      
      if (types) params.types = types;
      if (searchTerm) params.searchTerm = searchTerm;
      
      const response = await getUserVotationsByRawUseCase.execute(params);
      setData(response.data);
      setMetadata(response.metadata);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [types, page, searchTerm]);

  useEffect(() => {
    loadVotations();
  }, [loadVotations]);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (newPage) => setPage(newPage);
  const refetch = () => loadVotations();
  
  const updateSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm(null);
    setPage(1);
  };

  // Determinar si hay más páginas
  const hasNextPage = () => {
    if (!data) return false;
    // Verificar si algún tipo tiene más páginas
    for (const type of Object.keys(data)) {
      const typeData = data[type];
      if (typeData?.pagination && typeData.pagination.page < typeData.pagination.totalPages) {
        return true;
      }
    }
    return false;
  };

  const hasPrevPage = () => page > 1;

  return {
    data,
    loading,
    error,
    metadata,
    refetch,
    pagination: {
      page,
      totalPages: metadata?.global?.totalPages || 1,
      nextPage,
      prevPage,
      goToPage,
      hasNextPage: hasNextPage(),
      hasPrevPage: hasPrevPage()
    },
    searchTerm,
    updateSearch,
    clearSearch
  };
}