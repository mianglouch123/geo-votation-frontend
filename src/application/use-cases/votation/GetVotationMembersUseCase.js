// application/use-cases/votation/GetVotationMembersUseCase.js
export class GetVotationMembersUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ 
    votationId, 
    page = 1, 
    limit = 10, 
    searchEmail = undefined,
    searchPage = 1
  }) => {
    if (!votationId) {
      throw new Error('El ID de la votación es requerido');
    }

    const params = { page, limit };
    
    if (searchEmail) {
      params.searchEmail = searchEmail;
      params.searchPage = searchPage;
    }

    const response = await this.votationRepository.getMembers(votationId, params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message,
      searchMetadata: response.searchMetadata
    };
  };
}