export class GetVotationStatsUseCase {
 constructor(votationRepository) {
  this.votationRepository = votationRepository;
 }

  execute = async (id) => {
   if(!id) {
    throw new Error('El ID de la votación es requerido');
   }
   const response = await this.votationRepository.getStats(id);
   return {
	success: true,
	votationId : id,
	message: response.message || 'Estadísticas obtenidas correctamente',
	data: response.data
 }
}
}