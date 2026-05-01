// infrastructure/repositories/InvitationRepositoryImpl.js
import { IInvitationRepository } from '../../domain/repositories/interfaces/IInvitationRepository.js';
import { httpClient } from '../http/client/client.js';

export class InvitationRepositoryImpl extends IInvitationRepository {
  constructor() {
    super();
    this.baseUrl = '/invitations';
    this.adminBaseUrl = '/admin/invitations';
  }

  async getPendingSent(params = {}) {
    const response = await httpClient.get(`${this.baseUrl}/pending-sent`, { params });
    return response.data;
  }

  async declineSent(invitationId) {
    const response = await httpClient.put(`/decline-invitation/${invitationId}`);
    return response.data;
  }

// infrastructure/repositories/InvitationRepositoryImpl.js (agregar)

async getPendingInvitations(params = {}) {
  const response = await httpClient.get('/user/invitations/pending', { params });
  return response.data;
}

async handleInvitation(invitationId, action) {
  const response = await httpClient.put(`/user/invitations/${invitationId}/handle-invitation`, { action });
  return response.data;
}
}