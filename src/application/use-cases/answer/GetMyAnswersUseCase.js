// application/use-cases/answer/GetMyAnswersUseCase.js
export class GetMyAnswersUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  execute = async ({ votationId, userId, page = 1, limit = 10 }) => {
    if (!votationId) throw new Error('ID de votación requerido');

    const response = await this.answerRepository.getMyAnswers(votationId, userId, { page, limit });

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}