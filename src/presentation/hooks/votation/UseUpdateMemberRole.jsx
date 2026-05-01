// presentation/hooks/votation/UseUpdateMemberRole.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { UpdateMemberRoleUseCase } from '../../../application/use-cases/votation/UpdateMemberRoleUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const updateMemberRoleUseCase = new UpdateMemberRoleUseCase(votationRepository);

export function UseUpdateMemberRole(votationId) {
  const updateRole = useCallback(
    ({ userId, newRole }) => updateMemberRoleUseCase.execute({ votationId, userId, newRole }),
    [votationId]
  );

  return UseMutation(updateRole);
};

