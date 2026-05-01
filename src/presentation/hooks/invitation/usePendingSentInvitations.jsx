// presentation/hooks/invitation/usePendingSentInvitations.js
import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { InvitationRepositoryImpl } from '../../../infraestructure/repositories/InvitationRepositoryImpl.js';
import { GetPendingSentInvitationsUseCase } from '../../../application/use-cases/invitation/GetPendingSentInvitationsUseCase.js';

const invitationRepository = new InvitationRepositoryImpl();
const getPendingSentUseCase = new GetPendingSentInvitationsUseCase(invitationRepository);

export function UsePendingSentInvitations(votationId = null) {
  const fetchInvitations = useCallback(
    ({ page, limit }) => {
      return getPendingSentUseCase.execute({ votationId, page, limit });
    },
    [votationId]
  );

  return UsePagination(fetchInvitations);
}