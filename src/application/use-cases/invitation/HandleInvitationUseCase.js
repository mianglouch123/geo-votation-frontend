// application/use-cases/invitation/HandleInvitationUseCase.js
export class HandleInvitationUseCase {
  constructor(invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute = async ({ invitationId, action }) => {
    if (!invitationId) throw new Error('ID de invitación requerido');
    if (!action || !['ACCEPT', 'REJECT'].includes(action)) {
      throw new Error('Acción inválida. Debe ser ACCEPT o REJECT');
    }

    const response = await this.invitationRepository.handleInvitation(invitationId, action);

    return {
      data: response.data,
      message: response.message || `Invitación ${action === 'ACCEPT' ? 'aceptada' : 'rechazada'} correctamente`
    };
  };
}