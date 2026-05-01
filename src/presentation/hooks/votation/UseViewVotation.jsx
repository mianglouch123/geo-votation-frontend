// presentation/hooks/votation/UseViewVotation.js
import { useState, useEffect, useCallback } from 'react';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { GetViewVotationUseCase } from '../../../application/use-cases/votation/GetViewVotationUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const getViewVotationUseCase = new GetViewVotationUseCase(votationRepository);

export function UseViewVotation(votationId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVotation = useCallback(async () => {
    if (!votationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getViewVotationUseCase.execute({ votationId });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [votationId]);

  useEffect(() => {
    loadVotation();
  }, [loadVotation]);

  const refetch = () => loadVotation();

  return { data, loading, error, refetch };
}