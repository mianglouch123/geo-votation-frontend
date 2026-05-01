// infrastructure/repositories/AnswerRepositoryImpl.js
import { IAnswerRepository } from '../../domain/repositories/interfaces/IAnswersRepository.js';
import { httpClient } from '../http/client/client.js';

export class AnswerRepositoryImpl extends IAnswerRepository {
  constructor() {
    super();
    this.baseUrl = '/votations';
    this.exportUrl = '/export/votations';
  }

  async getAnswers(votationId, params = {}) {
    const response = await httpClient.get(`${this.baseUrl}/${votationId}/answers`, { params });
    return response.data;
  }

  async exportAnswers(votationId, params = {}) {
    const response = await httpClient.get(`${this.exportUrl}/${votationId}/answers/csv`, { params });
    return response.data;
  }

  // infrastructure/repositories/AnswerRepositoryImpl.js (agregar)

async getMyAnswers(votationId, userId, params = {}) {
  const response = await httpClient.get(`/votations/${votationId}/my-answers`, { params });
  return response.data;
}

async submitAnswer(votationId, answers) {
  const response = await httpClient.post(`/votations/${votationId}/submit-answer`, { answers });
  return response.data;
}

async updateAnswer(votationId, answers) {
  const response = await httpClient.put(`/votations/${votationId}/update-answers`, { answers });
  return response.data;
}

async getAnsweredVotations(userId, params = {}) {
  const response = await httpClient.get('/user/votations/answered', { params });
  return response.data;
}
}