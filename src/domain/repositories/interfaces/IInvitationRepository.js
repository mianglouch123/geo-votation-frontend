// domain/repositories/interfaces/IInvitationRepository.js
export class IInvitationRepository {
  async getPendingSent(params) { throw new Error('Method not implemented'); }
  async declineSent(invitationId) { throw new Error('Method not implemented'); }
  async getPendingInvitations(params = {}) { throw new Error('Method not implemented'); }
  async handleInvitation(invitationId, action) { throw new Error('Method not implemented'); }
}