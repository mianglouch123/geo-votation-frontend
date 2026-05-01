// infrastructure/repositories/UserRepositoryImpl.js

export class IUserRepository {
  async register(data) { throw new Error('Method not implemented'); }

  async login(data) { throw new Error('Method not implemented'); }

  async forgotPassword(email) { throw new Error('Method not implemented'); }

  async resetPassword(data) { throw new Error('Method not implemented'); }

  async validateResetToken(token) { throw new Error('Method not implemented'); }
  
  async changePassword(data) { throw new Error('Method not implemented'); }

  async getProfile() { throw new Error('Method not implemented'); }

  async logout(refreshToken) { throw new Error('Method not implemented'); }

  async getDashboard() { throw new Error('Method not implemented'); }
  
  async getUserVotations(params = {}) { throw new Error('Method not implemented'); }

  async verifyCode(token){ throw new Error('Method not implemented'); }
}