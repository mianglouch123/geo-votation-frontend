// application/use-cases/votation/GetViewVotationUseCase.js
import { Votation } from '../../../domain/entities/votation/Votation.js';
export class GetViewVotationUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId }) => {
    if (!votationId) {
      throw new Error('ID de votación requerido');
    }

    const response = await this.votationRepository.getViewVotation(votationId);

    return {
      data: response.data,
      message: response.message
    };
  };
}