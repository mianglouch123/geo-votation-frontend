// application/use-cases/votation/RemoveMemberUseCase.js
export class RemoveMemberUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId, userId }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }

    const response = await this.votationRepository.removeMember(votationId, userId);

    return {
      data: response.data,
      message: response.message || 'Miembro eliminado correctamente'
    };
  };
}