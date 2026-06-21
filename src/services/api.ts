import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, type AxiosError } from "axios";

const AUTH_TOKEN_STORAGE_KEY = "@ProEstoque:token";

const API_BASE_URL = "http://192.168.48.111:3333/api";

export type ApiUser = {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type AuthResponse = {
  usuario: ApiUser;
  token: string;
};

export type ApiErrorResponse = {
  erro?: string;
  detalhes?: unknown;
};

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (request) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      console.warn("Sessão expirada ou token inválido.");
    }

    return Promise.reject(error);
  },
);