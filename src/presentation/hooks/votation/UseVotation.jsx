// presentation/hooks/votation/UseVotation.js
import { useCallback , useMemo } from 'react';
import { UseSingleResource } from '../common/UseSingleResource.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { GetVotationsUseCase } from '../../../application/use-cases/votation/GetVotationUseCase.js';

export function UseVotation(votationId) {
  const votationRepository = useMemo(() => new VotationRepositoryImpl(), []);
  const getVotationsUseCase = useMemo(
    () => new GetVotationsUseCase(votationRepository),
    [votationRepository]
  );

  const fetchVotation = useCallback(async (id) => {
    return await getVotationsUseCase.execute({ votationId: id });
  }, [getVotationsUseCase]);

  return UseSingleResource(fetchVotation, votationId);
}