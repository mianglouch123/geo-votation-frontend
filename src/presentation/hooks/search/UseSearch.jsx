// presentation/hooks/search/UseSearch.js
import { useState, useCallback } from 'react';
import { SearchRepositoryImpl } from '../../../infrastructure/repositories/SearchRepositoryImpl.js';
import { SearchUseCase } from '../../../application/use-cases/search/SearchUseCase.js';

const searchRepository = new SearchRepositoryImpl();
const searchUseCase = new SearchUseCase(searchRepository);

export function UseSearch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const search = useCallback(async ({ query, type = null, page = 1, limit = 10 }) => {
    if (!query || query.length < 2) {
      setError('El término de búsqueda debe tener al menos 2 caracteres');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await searchUseCase.execute({ query, type, page, limit });
      setData(response.data);
      setMetadata(response.metadata);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setMetadata(null);
  };

  return { data, loading, error, metadata, search, reset };
}