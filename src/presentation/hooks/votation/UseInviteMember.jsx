// presentation/hooks/votation/UseInviteMember.js
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl';
import { InviteMemberUseCase } from '../../../application/use-cases/votation/InviteMemberUseCase.js'
import { useCallback } from 'react';

const votationRepository = new VotationRepositoryImpl();
const inviteMemberUseCase = new InviteMemberUseCase(votationRepository);

export function UseInviteMember(votationId) {
 const inviteMember = useCallback(({ email, role }) => {
  inviteMemberUseCase.execute({ votationId , email , role })
} , [votationId]);

return UseMutation(inviteMember);
}
