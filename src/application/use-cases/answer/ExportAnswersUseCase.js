// application/use-cases/answer/ExportAnswersUseCase.js
export class ExportAnswersUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  execute = async ({ votationId, page = 1, limit = 1000 }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }

    const params = { page, limit };
    const response = await this.answerRepository.exportAnswers(votationId, params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}