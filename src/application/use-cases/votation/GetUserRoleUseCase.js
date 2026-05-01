export class GetUserRoleUseCase {
 constructor(votationRepository) {
  this.votationRepository = votationRepository;
  }

 execute = async ({ votationId }) => {
   if(!votationId) {
    throw new Error('El ID de la votación es requerido');
   }
   const response = await this.votationRepository.getUserRole(votationId);
   return {
	success: true,
	votationId : votationId,
	message: response.message || 'Rol del usuario obtenido correctamente',
	data: response.data
  }
 }


}