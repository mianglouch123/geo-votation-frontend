// presentation/hooks/votation/UseVotations.js
import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { VotationRepositoryImpl } from '../../../infrastructure/repositories/VotationRepositoryImpl.js';
import { GetVotationsUseCase } from '../../../application/use-cases/votation/GetVotationUseCase.js'

const votationRepository = new VotationRepositoryImpl();
const getVotationsUseCase = new GetVotationsUseCase(votationRepository);

export function UseVotations(initialPage = 1, initialLimit = 10) {
  // ✅ Sin dependencias, se crea una vez
  const fetchVotations = useCallback(async ({ page, limit }) => {
    return await getVotationsUseCase.execute({ page, limit });
  }, []);

  return UsePagination(fetchVotations, initialPage, initialLimit);
}