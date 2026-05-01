// application/use-cases/invitation/DeclineSentInvitationUseCase.js
export class DeclineSentInvitationUseCase {
  constructor(invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute = async ({ invitationId }) => {
    if (!invitationId) {
      throw new Error('ID de invitación requerido');
    }

    const response = await this.invitationRepository.declineSent(invitationId);

    return {
      data: response.data,
      message: response.message || 'Invitación revocada correctamente'
    };
  };
}