// domain/repositories/interfaces/IVotationRepository.js
export class IVotationRepository {
  // Queries
  async getAll(params) { throw new Error('Method not implemented'); }
  async getById(id, params) { throw new Error('Method not implemented'); }
  async getResults(id, params) { throw new Error('Method not implemented'); }
  async getStats(id) { throw new Error('Method not implemented'); }
  async getMembers(votationId, params) { throw new Error('Method not implemented'); }
  
  // Commands
  async create(data) { throw new Error('Method not implemented'); }
  async update(id, data) { throw new Error('Method not implemented'); }
  async delete(id) { throw new Error('Method not implemented'); }
  async duplicate(id, data) { throw new Error('Method not implemented'); }
  async close(id) { throw new Error('Method not implemented'); }
  async updateMemberRole(votationId, userId, role) { throw new Error('Method not implemented'); }
  async removeMember(votationId, userId) { throw new Error('Method not implemented'); }
  async invite(votationId, email, role) { throw new Error('Method not implemented'); }
  async transferOwnership(votationId, newOwnerEmail) { throw new Error('Method not implemented'); }
  async getViewVotation(votationId) { throw new Error("Method not implemented") }
  async getUserRole(votationId) { throw new Error("Method not implemented") }
}