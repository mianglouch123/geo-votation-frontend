// application/use-cases/search/SearchUseCase.js
export class SearchUseCase {
  constructor(searchRepository) {
    this.searchRepository = searchRepository;
  }

  execute = async ({ query, type = null, page = 1, limit = 10 }) => {
    if (!query || query.length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
    }

    const params = { q: query, page, limit };
    if (type) params.type = type;

    const response = await this.searchRepository.search(params);

    return {
      data: response.data,
      metadata: response.metadata,
      message: response.message
    };
  };
}