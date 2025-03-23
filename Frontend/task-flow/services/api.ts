import axios from 'axios';
import Constants from 'expo-constants';
import { clearTokens, getRefreshToken, getToken, setTokens } from './tokenStorage';

const { SERVER_ROUTE } = Constants.expoConfig?.extra || {};

const api = axios.create({
  baseURL: SERVER_ROUTE,
});

api.interceptors.request.use(async (config) => {
  console.log(SERVER_ROUTE);
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => response, 
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
    
      if (newToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
    }
    await logout();
  }
  
  return Promise.reject(error);  
});

export async function logout() {
  await clearTokens();
}

export async function refreshAccessToken () {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) return null;

    const response = await api.post("/autenticacao/refresh", { refreshToken });

    const { token, refreshToken: newRefreshToken } = response.data;

    await setTokens(token, refreshToken);

    return token;
  } catch (error) {
    await logout();
    return null;
  }
};

export async function login(email: string, senha: string) {
  try {
      const response = await api.post("/autenticacao", {
          email,
          senha
      });

      const { token, refreshToken } = response.data;

      await setTokens(token, refreshToken);

      return { success: true };
  } catch (error:any) {
      return { success: false, message: error.response?.data?.message || "Erro ao fazer login" };
  }
}


export default api;