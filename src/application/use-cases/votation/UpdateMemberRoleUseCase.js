// application/use-cases/votation/UpdateMemberRoleUseCase.js
export class UpdateMemberRoleUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId, userId, newRole }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }
    if (!newRole || !['ONLYREAD', 'EDIT'].includes(newRole)) {
      throw new Error('Rol inválido. Debe ser ONLYREAD o EDIT');
    }

    const response = await this.votationRepository.updateMemberRole(votationId, userId, newRole);

    return {
      success: true,
      data: response.data,
      message: response.message || 'Rol actualizado correctamente'
    };
  };
}