import axios from 'axios';
import { createRequestInterceptor } from '../interceptors/request/create.request.interceptor.js';
import { createResponseInterceptor } from '../interceptors/response/createResponseInterceptor.js';

class HttpClient {
  static #instance = null;
  #api = null;
  #refreshPromise = { current: null };

  constructor() {
    this.#api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 10000,
    });

    this.#setUpInterceptors();
  }

  #setUpInterceptors() {
    this.#api.interceptors.request.use(
      createRequestInterceptor(),
      (error) => Promise.reject(error)
    );

    this.#api.interceptors.response.use(
      (response) => response,
      createResponseInterceptor(this.#api, this.#refreshPromise)
    );
  }

  static getInstance() {
    if (!HttpClient.#instance) {
      HttpClient.#instance = new HttpClient();
    }
    return HttpClient.#instance;
  }

  get(url, config) {
    return this.#api.get(url, config);
  }

  post(url, data, config) {
    return this.#api.post(url, data, config);
  }

  put(url, data, config) {
    return this.#api.put(url, data, config);
  }

  delete(url, config) {
    return this.#api.delete(url, config);
  }
}

export const httpClient = HttpClient.getInstance();