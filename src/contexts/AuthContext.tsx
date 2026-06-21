import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  api,
  API_AUTH_STORAGE_KEYS,
  getAccessTokenFromAuthResponse,
  setUnauthorizedHandler,
  type ApiErrorResponse,
  type ApiUser,
  type AuthResponse,
} from "../services/api";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isRestoringSession: boolean;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthMeResponse = {
  usuario: ApiUser;
};

const AUTH_STORAGE_KEYS = {
  user: "@ProEstoque:user",
  accessToken: API_AUTH_STORAGE_KEYS.accessToken,
  refreshToken: API_AUTH_STORAGE_KEYS.refreshToken,
} as const;

const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    name: apiUser.nome,
    email: apiUser.email,
  };
};

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.erro ??
      "Não foi possível se conectar ao servidor."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado de autenticação.";
};

const isUser = (value: unknown): value is User => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<User>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.email === "string" &&
    candidate.email.trim().length > 0
  );
};

const parseStoredUser = (storedUser: string): User | null => {
  try {
    const parsedUser: unknown = JSON.parse(storedUser);

    return isUser(parsedUser) ? parsedUser : null;
  } catch {
    return null;
  }
};

const clearStoredSession = async () => {
  await AsyncStorage.multiRemove([
    AUTH_STORAGE_KEYS.user,
    AUTH_STORAGE_KEYS.accessToken,
    AUTH_STORAGE_KEYS.refreshToken,
  ]);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isRestoringSession || isSubmitting;

  const persistSession = useCallback(async (authResponse: AuthResponse) => {
    const authenticatedUser = mapApiUserToUser(authResponse.usuario);
    const accessToken = getAccessTokenFromAuthResponse(authResponse);
    const nextRefreshToken = authResponse.refreshToken;

    await AsyncStorage.multiSet([
      [AUTH_STORAGE_KEYS.user, JSON.stringify(authenticatedUser)],
      [AUTH_STORAGE_KEYS.accessToken, accessToken],
      [AUTH_STORAGE_KEYS.refreshToken, nextRefreshToken],
    ]);

    setUser(authenticatedUser);
    setToken(accessToken);
    setRefreshToken(nextRefreshToken);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearStoredSession();

      setUser(null);
      setToken(null);
      setRefreshToken(null);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storedUser, storedAccessToken, storedRefreshToken] =
          await Promise.all([
            AsyncStorage.getItem(AUTH_STORAGE_KEYS.user),
            AsyncStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
            AsyncStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
          ]);

        if (!storedUser || !storedAccessToken || !storedRefreshToken) {
          await clearStoredSession();
          return;
        }

        const parsedUser = parseStoredUser(storedUser);

        if (!parsedUser) {
          await clearStoredSession();
          return;
        }

        try {
          const response = await api.get<AuthMeResponse>("/auth/me");
          const authenticatedUser = mapApiUserToUser(response.data.usuario);

          const [latestAccessToken, latestRefreshToken] = await Promise.all([
            AsyncStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
            AsyncStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
          ]);

          await AsyncStorage.setItem(
            AUTH_STORAGE_KEYS.user,
            JSON.stringify(authenticatedUser),
          );

          setUser(authenticatedUser);
          setToken(latestAccessToken ?? storedAccessToken);
          setRefreshToken(latestRefreshToken ?? storedRefreshToken);
        } catch (error) {
          console.error("Erro ao validar sessão:", error);
          await clearStoredSession();

          setUser(null);
          setToken(null);
          setRefreshToken(null);
        }
      } catch (error) {
        console.error("Erro ao restaurar a sessão:", error);
      } finally {
        setIsRestoringSession(false);
      }
    }

    void loadStorageData();
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      setIsSubmitting(true);

      try {
        const response = await api.post<AuthResponse>("/auth/login", {
          email: email.trim().toLowerCase(),
          senha,
        });

        await persistSession(response.data);
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistSession],
  );

  const registrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      setIsSubmitting(true);

      try {
        const response = await api.post<AuthResponse>("/auth/registro", {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha,
        });

        await persistSession(response.data);
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await clearStoredSession();

      setUser(null);
      setToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const isAuthenticated = !!user && !!token && !!refreshToken;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      refreshToken,
      isLoading,
      isRestoringSession,
      isSubmitting,
      isAuthenticated,
      login,
      registrar,
      logout,
    }),
    [
      user,
      token,
      refreshToken,
      isLoading,
      isRestoringSession,
      isSubmitting,
      isAuthenticated,
      login,
      registrar,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}