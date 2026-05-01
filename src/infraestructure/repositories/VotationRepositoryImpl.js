// infrastructure/repositories/VotationRepositoryImpl.js
import { IVotationRepository } from '../../domain/repositories/interfaces/IVotationRepository.js';
import { httpClient } from '../http/client/client.js';

export class VotationRepositoryImpl extends IVotationRepository {
  constructor() {
    super();
    this.baseUrl = '/votations';
  }

  async getAll(params = {}) {
    const response = await httpClient.get(`/get-votation`, { params });
    return response.data;
  }

  async getById(id, params = {}) {
    const response = await httpClient.get(`/get-votation`, { params });
    return response.data;
  }

  async create(data) {
    // ✅ CORREGIDO: Usar baseUrl para crear
    const response = await httpClient.post("/create-votation", { votationData: data });
    return response.data;
  }

  async update(data) {
    // ✅ CORREGIDO: Usar baseUrl para actualizar
    const response = await httpClient.put(`${this.baseUrl}/update-votation`, { votationData: data });
    return response.data;
  }

  async delete(id) {
    // ✅ CORREGIDO: Usar baseUrl para eliminar
    const response = await httpClient.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async duplicate(id, data) {
    // ✅ CORREGIDO: Usar baseUrl para duplicar
    const response = await httpClient.post(`${this.baseUrl}/${id}/duplicate`, data);
    return response.data;
  }

  async close(id) {
    // ✅ CORREGIDO: Usar baseUrl para cerrar
    const response = await httpClient.post(`${this.baseUrl}/close` , { votationId: id });
    return response.data;
  }

  async getResults(id, params = {}) {
    const response = await httpClient.get(`/results/${id}`, { params });
    return response.data;
  }

  async getStats(id) {
    // ✅ CORREGIDO: Usar baseUrl para stats
    const response = await httpClient.get(`${this.baseUrl}/${id}/stats`);
    return response.data;
  }

  async getMembers(votationId, params = {}) {
    // ✅ CORREGIDO: Usar baseUrl para miembros
    const response = await httpClient.get(`${this.baseUrl}/${votationId}/members`, { params });
    return response.data;
  }

  async updateMemberRole(votationId, userId, role) {
    const response = await httpClient.put(
      `${this.baseUrl}/${votationId}/members/${userId}/role`,
      { newRole: role }
    );
    return response.data;
  }

  async transferOwnership(votationId, newOwnerEmail) {
    // ✅ CORREGIDO: Endpoint correcto
    const response = await httpClient.post(
      `${this.baseUrl}/${votationId}/transfer-property`,
      { newOwnerEmail }
    );
    return response.data;
  }

  async removeMember(votationId, userId) {
    const response = await httpClient.delete(
      `${this.baseUrl}/${votationId}/members/${userId}`
    );
    return response.data;
  }

  async inviteMember(votationId, email, role) {
    const response = await httpClient.post(
      `${this.baseUrl}/${votationId}/invite-user`,
      { email, role }
    );
    return response.data;
  }

// infrastructure/repositories/VotationRepositoryImpl.js (agregar)

 async getViewVotation(votationId) {
  const response = await httpClient.get(`${this.baseUrl}/${votationId}/view-votation`);
  return response.data;
 }

 async getUserRole(votationId) {
  const response = await httpClient.get(`${this.baseUrl}/${votationId}/role`);
  return response.data;
 }
}