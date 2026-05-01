// infrastructure/repositories/ActivityRepositoryImpl.js

import { IActivityRepository } from '../../domain/repositories/interfaces/IActivityRepository.js';
import { httpClient } from '../http/client/client.js';

export class ActivityRepositoryImpl extends IActivityRepository {
  constructor() {
    super();
    this.baseUrl = '/user/activity';
  }

  async getActivity(params = {}) {
    const response = await httpClient.get(this.baseUrl, { params });
    return response.data;
  }
}

