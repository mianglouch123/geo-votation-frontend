// presentation/hooks/votation/UseDuplicateVotation.js
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { DuplicateVotationUseCase } from '../../../application/use-cases/votation/DuplicateVotationUseCase.js';
const votationRepository = new VotationRepositoryImpl();
const duplicateVotationUseCase = new DuplicateVotationUseCase(votationRepository);

export function UseDuplicateVotation() {

  const duplicateVotation = useCallback(async ({ id , data }) => {
   return await duplicateVotationUseCase.execute({ votationId : id , data })
 } , []);

  return UseMutation(duplicateVotation)
}