// infrastructure/repositories/SearchRepositoryImpl.js
import { ISearchRepository } from '../../domain/repositories/interfaces/ISearchRepository.js';
import { httpClient } from '../http/client/client.js';

export class SearchRepositoryImpl extends ISearchRepository {
  async search(params = {}) {
    const response = await httpClient.get('/search', { params });
    return response.data;
  }
}