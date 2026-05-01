// application/use-cases/votation/GetResultsUseCase.js
export class GetResultsUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId, page = 1, limit = 10, questionId = null }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }

    const params = {};
    
    if (questionId) {
      // ✅ Si hay questionId, solo enviamos ese parámetro
      params.questionId = questionId;
    } else {
      // ✅ Si no, enviamos paginación
      params.page = page;
      params.limit = limit;
    }

    const results = await this.votationRepository.getResults(votationId, params);
    
    return {
      success: true,
      votationId,
      ...(questionId ? { questionId } : {}),
      data: results.data,
      ...(results.pagination && { pagination: results.pagination })
    };
  };
}