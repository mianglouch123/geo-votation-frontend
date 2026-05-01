export class InviteMemberUseCase {
  constructor(votationRepository) {
	this.votationRepository = votationRepository;
  }
  execute = async ({ votationId, email, role }) => {
   if(!votationId) {
	throw new Error('El ID de la votación es requerido');
   }
   if(!email) {
	throw new Error('El email del miembro a invitar es requerido');
  }
   if(!role) {
	throw new Error('El rol del miembro a invitar es requerido');
  }
  const response = await this.votationRepository.inviteMember(votationId,email,role);

  return {
	success: true,
	votationId : votationId,
	message: response.message || 'Miembro invitado correctamente',
	data: response.data
  };
 }
}