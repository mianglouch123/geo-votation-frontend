export class CloseVotationUseCase {
 constructor(votationRepository) {
  this.votationRepository = votationRepository;
 }

  execute = async (id) => {
   if(!id) {
	throw new Error('El ID de la votación es requerido');
   }
   const response = await this.votationRepository.close(id);
   return {
	  success: true,
      votationId : id,
	  message: response.message || 'Votación cerrada correctamente',
	  data: response.data
	};
 }

}