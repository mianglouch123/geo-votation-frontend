import { tokenHelper } from "../../../storage/helpers/token.helpers.js";
export const createResponseInterceptor = (api, refreshPromiseRef) => async (error) => {
  const originalRequest = error.config;

  if (!error.response) {
    console.log("❌ No hay response en el error");
    return Promise.reject(error);
  }

  const status = error.response.status;
  const message = error.response.data?.message;
  
  console.log(`📡 Response error - Status: ${status}, Message: ${message}`);

  // 👉 Solo nos importa que sea 401 Y que sea por expiración
  if (status !== 401) {
    console.log("➡️ No es 401, pasando error");
    return Promise.reject(error);
  }

  // Verificar si es realmente un error de expiración
  if (message !== "Token de autenticación expirado") {
    console.log("⚠️ Es 401 pero no es por expiración, redirigiendo");
    tokenHelper.removeTokensAndRedirect();
    return Promise.reject(error);
  }

  console.log("🔄 Token expirado, intentando refresh...");

  // 🔁 Evitar loop infinito
  if (originalRequest._retry) {
    console.log("🔁 Loop infinito detectado, redirigiendo");
    tokenHelper.removeTokensAndRedirect();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    if (!refreshPromiseRef.current) {
      const refreshToken = tokenHelper.getRefreshToken();
      console.log("📦 Refresh token en localStorage:", refreshToken ? "Existe" : "No existe");

      if (!refreshToken) {
        console.log("❌ No hay refresh token, redirigiendo");
        tokenHelper.removeTokensAndRedirect();
        return Promise.reject(error);
      }

      console.log("🔥 Ejecutando refresh a /auth/refresh-token");

      refreshPromiseRef.current = api
        .post("/auth/refresh-token", { refreshToken })
        .then((response) => {
          console.log("✅ Respuesta del refresh:", response.data);
          const data = response.data;

          const accessToken = data.accessToken || data.token;
          const newRefreshToken = data.refreshToken;

          if (!accessToken) {
            console.error("❌ No se recibió accessToken");
            throw new Error("No se recibió accessToken");
          }

          tokenHelper.setTokens(accessToken, newRefreshToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          console.log("✅ Tokens actualizados correctamente");
          return accessToken;
        })
        .catch((err) => {
          console.error("❌ Error en refresh:", err.response?.data || err.message);
          tokenHelper.removeTokensAndRedirect();
          throw err;
        })
        .finally(() => {
          refreshPromiseRef.current = null;
        });
    }

    const newAccessToken = await refreshPromiseRef.current;
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    
    console.log("🔄 Reintentando request original");
    return api(originalRequest);

  } catch (refreshError) {
    console.error("❌ Error final en interceptor:", refreshError);
    return Promise.reject(refreshError);
  }
};