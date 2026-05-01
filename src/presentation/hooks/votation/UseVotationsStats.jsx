// presentation/hooks/votation/UseVotationStats.js
import { useState, useEffect } from 'react';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { GetVotationStatsUseCase } from '../../../application/use-cases/votation/GetVotationStatsUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const getStatsUseCase = new GetVotationStatsUseCase(votationRepository);

export function UseVotationStats(votationId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    if (!votationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getStatsUseCase.execute(votationId);
      setData(response.data);
    } catch (err) {
      setError(err.message || err?.response?.message || 'Error al obtener las estadísticas de la votación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [votationId]);

  return { data, loading, error, refetch: loadStats };
}