// presentation/hooks/user/UseUserRole.js
import { useState, useEffect, useCallback } from 'react';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { GetUserRoleUseCase } from '../../../application/use-cases/votation/GetUserRoleUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const getUserRoleUseCase = new GetUserRoleUseCase(votationRepository);

export function UseUserRole(votationId) {
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({
    canEdit: false,
    canInvite: false,
    canManageMembers: false,
    canTransfer: false,
    canDelete: false,
    canClose: false,
    canDuplicate: false,
    isOwner: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserRole = useCallback(async () => {
    if (!votationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await getUserRoleUseCase.execute({ votationId });
      
      if (response.success) {
        setRole(response.data.role);
        setPermissions({
          canEdit: response.data.canEdit,
          canInvite: response.data.canInvite,
          canManageMembers: response.data.canManageMembers,
          canTransfer: response.data.canTransfer,
          canDelete: response.data.canDelete,
          canClose: response.data.canClose,
          canDuplicate: response.data.canDuplicate,
          isOwner: response.data.isOwner
        });
      }
    } catch (err) {
      setError(err?.response?.message || 'Error al obtener el rol del usuario');
    } finally {
      setLoading(false);
    }
  }, [votationId]);

  useEffect(() => {
    loadUserRole();
  }, [loadUserRole]);

  const refetch = () => loadUserRole();

  return { role, permissions, loading, error, refetch };
}