import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AxiosHeaders,
  create,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

export const API_AUTH_STORAGE_KEYS = {
  accessToken: "@ProEstoque:token",
  refreshToken: "@ProEstoque:refreshToken",
} as const;

const API_BASE_URL = "http://192.168.48.111:3333/api";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type ApiUser = {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type AuthResponse = {
  usuario: ApiUser;
  token?: string;
  accessToken?: string;
  refreshToken: string;
};

export type ApiErrorResponse = {
  erro?: string;
  detalhes?: unknown;
};

let unauthorizedHandler: (() => void | Promise<void>) | null = null;
let refreshSessionPromise: Promise<AuthTokens> | null = null;

export function setUnauthorizedHandler(
  handler: (() => void | Promise<void>) | null,
) {
  unauthorizedHandler = handler;
}

export function getAccessTokenFromAuthResponse(authResponse: AuthResponse) {
  const accessToken = authResponse.accessToken ?? authResponse.token;

  if (!accessToken) {
    throw new Error("Resposta de autenticação sem access token.");
  }

  return accessToken;
}

const apiRefresh = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

function setAuthorizationHeader(
  request: InternalAxiosRequestConfig,
  accessToken: string,
) {
  request.headers = AxiosHeaders.from(request.headers);
  request.headers.set("Authorization", `Bearer ${accessToken}`);
}

async function clearAuthTokens() {
  await AsyncStorage.multiRemove([
    API_AUTH_STORAGE_KEYS.accessToken,
    API_AUTH_STORAGE_KEYS.refreshToken,
  ]);
}

async function notifyUnauthorized() {
  if (unauthorizedHandler) {
    await unauthorizedHandler();
  }
}

function isAuthRoute(url?: string) {
  if (!url) return false;

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/registro") ||
    url.includes("/auth/refresh")
  );
}

async function refreshSession() {
  const storedRefreshToken = await AsyncStorage.getItem(
    API_AUTH_STORAGE_KEYS.refreshToken,
  );

  if (!storedRefreshToken) {
    throw new Error("Refresh token ausente.");
  }

  const response = await apiRefresh.post<AuthResponse>("/auth/refresh", {
    refreshToken: storedRefreshToken,
  });

  const accessToken = getAccessTokenFromAuthResponse(response.data);
  const refreshToken = response.data.refreshToken;

  await AsyncStorage.multiSet([
    [API_AUTH_STORAGE_KEYS.accessToken, accessToken],
    [API_AUTH_STORAGE_KEYS.refreshToken, refreshToken],
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

function getRefreshSessionPromise() {
  if (!refreshSessionPromise) {
    refreshSessionPromise = refreshSession().finally(() => {
      refreshSessionPromise = null;
    });
  }

  return refreshSessionPromise;
}

api.interceptors.request.use(async (request) => {
  const accessToken = await AsyncStorage.getItem(
    API_AUTH_STORAGE_KEYS.accessToken,
  );

  if (accessToken) {
    setAuthorizationHeader(request, accessToken);
  }

  return request;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRoute(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = await getRefreshSessionPromise();

      setAuthorizationHeader(originalRequest, tokens.accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      await clearAuthTokens();
      await notifyUnauthorized();

      return Promise.reject(refreshError);
    }
  },
);