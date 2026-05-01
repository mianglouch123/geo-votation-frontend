// presentation/hooks/invitation/useHandleInvitation.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { InvitationRepositoryImpl } from '../../../infraestructure/repositories/InvitationRepositoryImpl.js';
import { HandleInvitationUseCase } from '../../../application/use-cases/invitation/HandleInvitationUseCase.js';

const invitationRepository = new InvitationRepositoryImpl();
const handleInvitationUseCase = new HandleInvitationUseCase(invitationRepository);

export function UseHandleInvitation() {
  const handleInvitation = useCallback(
    ({ invitationId, action }) => handleInvitationUseCase.execute({ invitationId, action }),
    []
  );

  return UseMutation(handleInvitation);
}