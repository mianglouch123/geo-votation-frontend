// presentation/hooks/votation/UseRemoveMember.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { RemoveMemberUseCase } from '../../../application/use-cases/votation/RemoveMemberUseCase.js';
const votationRepository = new VotationRepositoryImpl();
const removeMemberUseCase = new RemoveMemberUseCase(votationRepository);

export function UseRemoveMember(votationId) {
  const removeMember = useCallback(
    ({ userId }) => removeMemberUseCase.execute({ votationId, userId }),
    [votationId]
  );

  return UseMutation(removeMember);
}
