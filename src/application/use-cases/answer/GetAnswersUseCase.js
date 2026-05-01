// application/use-cases/answer/GetAnswersUseCase.js
export class GetAnswersUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  execute = async ({ 
    votationId, 
    page = 1, 
    limit = 10, 
    questionId = null, 
    userId = null, 
    searchEmail = undefined,
    searchPage = 1      // ← NUEVO
  }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }

    const params = { page, limit };
    if (questionId) params.questionId = questionId;
    if (searchEmail) {
      params.searchEmail = searchEmail;
      params.searchPage = searchPage;  // ← NUEVO
    } else if (userId) {
      params.userId = userId;
    }

    const response = await this.answerRepository.getAnswers(votationId, params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}