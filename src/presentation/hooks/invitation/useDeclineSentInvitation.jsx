// presentation/hooks/invitation/useDeclineSentInvitation.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { InvitationRepositoryImpl } from '../../../infraestructure/repositories/InvitationRepositoryImpl.js';
import { DeclineSentInvitationUseCase } from '../../../application/use-cases/invitation/DeclineSentInvitationUseCase.js';

const invitationRepository = new InvitationRepositoryImpl();
const declineSentUseCase = new DeclineSentInvitationUseCase(invitationRepository);

export function useDeclineSentInvitation() {
  const declineInvitation = useCallback(
    ({ invitationId }) => declineSentUseCase.execute({ invitationId }),
    []
  );

  return UseMutation(declineInvitation);
}