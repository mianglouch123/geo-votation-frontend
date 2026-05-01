// application/use-cases/user/GetUserVotationsByRawUseCase.js
export class GetUserVotationsByRawUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute = async ({ types = null, page = 1, limit = 10, searchTerm = null }) => {
    const params = { page, limit };
    
    if (types && types.length > 0) {
      params.types = types;
    }
    
    if (searchTerm && searchTerm.trim()) {
      params.searchTerm = searchTerm.trim();
    }

    const response = await this.userRepository.getUserVotationsByRaw(params);

    return {
      data: response.data,
      message: response.message,
      metadata: response.metadata
    };
  };
}