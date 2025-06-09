import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { clearTokens, getRefreshToken, getToken, setToken, setTokens } from './tokenStorage';
import { authEmitter } from './authEmiter';

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
    console.log("Token expirou")
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => response, 
  async (error) => {
    console.log("Response interceptor triggered.", error.response?.status);
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("401 error intercepted. Attempting to refresh token.");
      const newToken = await refreshAccessToken();
    
      if (newToken) {
        console.log("Token refreshed successfully:", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
    }
    console.log("Token refresh failed, logging out.");
    await logout();
    return Promise.reject(new Error("Logged out"));
  }
  
  return Promise.reject(error);  
});

export async function logout() {
  await clearTokens();
  authEmitter.emit('logout');
}

export async function refreshAccessToken () {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      console.log("No refresh token found.");
      return null;
    }

    console.log("Attempting to refresh token with refreshToken:", refreshToken);
    const response = await axios.post(`${SERVER_ROUTE}/autenticacao/renovar`, { 
      "refreshToken": refreshToken
    });
    console.log("Refresh API response:", response.data);
    const { accessToken } = response.data;

    await setToken(accessToken);

    return accessToken;
  } catch (error) {
    console.log("Error refreshing token:", error);
    await logout();
    return null;
  }
};

export async function login(email: string, senha: string) {
  console.log("[LOGIN_SERVICE] Entered login function."); 
  console.log("[LOGIN_SERVICE] SERVER_ROUTE:", SERVER_ROUTE);
  try {
      console.error("[LOGIN_SERVICE] SERVER_ROUTE is undefined or null. Cannot make request.");
      const response = await axios.post(`${SERVER_ROUTE}/autenticacao`, {
          email,
          senha
      });
      console.log("[LOGIN_SERVICE] axios.post call completed. Response received:", response);


      console.log(response);

      if (response.status == 200) {
        const { tokenAcesso, refreshToken } = response.data;
        await setTokens(tokenAcesso, refreshToken);
        return { success: true };
      }
      if (response.status == 401) {
        return { success: false, message: response.data.message };
      }
  } catch (error) {
      let errorMessage = (error as AxiosError).response?.data as any;
      throw new Error(errorMessage);
  }
}


export default api;