// application/use-cases/answer/GetAnsweredVotationsUseCase.js
export class GetAnsweredVotationsUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  execute = async ({ userId, page = 1, limit = 10 }) => {
    if (!userId) throw new Error('ID de usuario requerido');

    const response = await this.answerRepository.getAnsweredVotations(userId, { page, limit });

    return {
      data: response.data,
      pagination: response.pagination,
      message: response.message
    };
  };
}