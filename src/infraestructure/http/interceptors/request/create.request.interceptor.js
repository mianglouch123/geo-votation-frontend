import { tokenHelper } from "../../../storage/helpers/token.helpers.js"
export const createRequestInterceptor = () => (config) => {
  const accessToken = tokenHelper.getAccessToken();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `${accessToken}`;
  }

  return config;
};