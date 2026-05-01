import { Votation } from '../../../domain/entities/votation/Votation.js';


export class DeleteVotationUseCase {
constructor(votationRepository) {
	this.votationRepository = votationRepository;
  }

  execute = async(votationId) => {
   if(!votationId) {
    throw new Error('El ID de la votación es requerido');
   }
   const response = await this.votationRepository.delete(votationId);
   return {
      success: true,
      message: response.message || 'Votación eliminada correctamente',
      data: {
        id: votationId
      }
    };
  };

}