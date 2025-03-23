// Create a new file: app/services/tokenStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  return await AsyncStorage.getItem("token");
}

export async function getRefreshToken() {
  return await AsyncStorage.getItem("refreshToken");
}

export async function setTokens(token: string, refreshToken: string) {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("refreshToken", refreshToken);
  console.log("Tokens set fodas", token, refreshToken);
}

export async function setToken(token: string) {
  await AsyncStorage.setItem("token", token);
}

export async function clearTokens() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("refreshToken");
}