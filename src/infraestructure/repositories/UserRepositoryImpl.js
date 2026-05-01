// infrastructure/repositories/UserRepositoryImpl.js
import { httpClient } from '../http/client/client.js';
import { IUserRepository } from '../../domain/repositories/interfaces/IUserRepository.js';
export class UserRepositoryImpl extends IUserRepository {
  constructor() {
	super();
   }
  async register(data) {
    const { data: response } = await httpClient.post('/register', data);
    return response;
  }

  async login(data) {
    const { data: response } = await httpClient.post('/login', data);
    return response;
  }

  async forgotPassword(email) {
    const { data: response } = await httpClient.post('/auth/forgot-password', { email });
    return response;
  }

 async resetPassword(data) {
  const response = await httpClient.post('/auth/reset-password', {
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  }, {
    params: { token: data.token }
  });
  return response.data;
}

  async validateResetToken(token) {
    const { data: response } = await httpClient.get('/auth/validate-reset-token', { params: { token } });
    return response;
  }

  async changePassword(data) {
    const response = await httpClient.post('/user/change-password', data);
    return response.data;
  }

  async getProfile() {
    const response = await httpClient.get('/user/profile');
    return response.data;
  }

  async logout(refreshToken) {
    const { data: response } = await httpClient.post('/auth/logout', { refreshToken });
    return response;
  }

   // infrastructure/repositories/UserRepositoryImpl.js (agregar)

 async getDashboard() {
  const response = await httpClient.get('/user/dashboard');
  return response.data;
 }

 async getUserVotations(params = {}) {
  const response = await httpClient.get('/user/votations', { params });
  return response.data;
 }

 async getUserVotationsByRaw(params = {}) {
  const response = await httpClient.get('/user/votations-by-raw', { params });
  return response.data;
 }

// infrastructure/repositories/UserRepositoryImpl.js (agregar)

async verifyCode(token) {
  const response = await httpClient.get(`/verify-code/${token}`);
  return response.data;
}
}