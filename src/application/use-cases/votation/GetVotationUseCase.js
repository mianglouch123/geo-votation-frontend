// application/use-cases/votation/GetVotationsUseCase.js
import { Votation } from "../../../domain/entities/votation/Votation.js";

export class GetVotationsUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ page = 1, limit = 10, votationId = null } = {}) => {
    const params = {};

    if (votationId) {
      params.votationId = votationId;
    } else {
      params.page = page;
      params.limit = limit;
    }

    const response = await this.votationRepository.getAll(params);

    if (votationId) {
      return {
        data: Votation.fromAPI(response.data).toJSON(),
        message: response.message
      };
    }

    return {
      data: response.data.map(v => Votation.fromAPI(v).toJSON()),
      message: response.message,
      pagination: response.metadata?.pagination
    };
  };
}