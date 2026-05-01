// presentation/hooks/votation/UseUpdateVotation.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { UpdateVotationUseCase } from '../../../application/use-cases/votation/UpdateVotationUseCase.js';


const votationRepository = new VotationRepositoryImpl();
const updateVotationUseCase = new UpdateVotationUseCase(votationRepository);

export function UseUpdateVotation() {
  const updateVotation = useCallback(async (votationData) => {
   return await updateVotationUseCase.execute(votationData);
  } , [])

  return UseMutation(updateVotation)
}

