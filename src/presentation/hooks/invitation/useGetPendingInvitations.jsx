// presentation/hooks/invitation/usePendingInvitations.js
import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { InvitationRepositoryImpl } from '../../../infraestructure/repositories/InvitationRepositoryImpl';
import { GetPendingInvitationsUseCase } from '../../../application/use-cases/invitation/GetPendingInvitationsUseCase.js';

const invitationRepository = new InvitationRepositoryImpl();
const getPendingInvitationsUseCase = new GetPendingInvitationsUseCase(invitationRepository);

export function UsePendingInvitations() {
  const fetchPendingInvitations = useCallback(async ({ page , limit }) => {
   return await getPendingInvitationsUseCase.execute({ page , limit });
 } , [])

  return UsePagination(fetchPendingInvitations);
}