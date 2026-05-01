// application/use-cases/invitation/GetPendingSentInvitationsUseCase.js
export class GetPendingSentInvitationsUseCase {
  constructor(invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute = async ({ votationId = null, page = 1, limit = 10 }) => {
    const params = { page, limit };
    if (votationId) params.votationId = votationId;

    const response = await this.invitationRepository.getPendingSent(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}