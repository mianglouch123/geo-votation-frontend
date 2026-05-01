// application/use-cases/invitation/GetPendingInvitationsUseCase.js
export class GetPendingInvitationsUseCase {
  constructor(invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute = async ({ page = 1, limit = 10 }) => {

    const params = { page, limit };
    const response = await this.invitationRepository.getPendingInvitations(params)

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}