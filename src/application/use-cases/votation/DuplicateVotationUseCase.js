// application/use-cases/votation/DuplicateVotationUseCase.js
export class DuplicateVotationUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId , data }) => {
    if (!votationId) {
      throw new Error('El ID de la votación es requerido');
    }
    
    // ✅ CORREGIDO: Verificar que al menos UNO de los campos requeridos esté presente
    if (!data?.newClosesAt) {
      throw new Error('Se requiere la nueva fecha de cierre para duplicar la votación');
    }

    if(!data?.newSubject) {
      throw new Error('Se requiere el nuevo asunto para duplicar la votación');
    }
    if(!data?.newDescription) {
	  throw new Error('Se requiere la nueva descripción para duplicar la votación');
	}

    const response = await this.votationRepository.duplicate(votationId, data);
    
    return {
      success: true,
      message: response.message || 'Votación duplicada correctamente',
      data: response.data
    };
  };
}