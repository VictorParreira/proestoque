import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_STORAGE_KEYS = {
  user: "@ProEstoque:user",
  token: "@ProEstoque:token",
} as const;

const AUTH_FAKE_DELAY_MS = 1500;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const createFakeToken = () => {
  return `fake-jwt-token-${Date.now()}`;
};

const isUser = (value: unknown): value is User => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<User>;

  return (
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
    AUTH_STORAGE_KEYS.token,
  ]);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.user),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.token),
          wait(AUTH_FAKE_DELAY_MS),
        ]);

        if (!storedUser || !storedToken) return;

        const parsedUser = parseStoredUser(storedUser);

        if (!parsedUser) {
          await clearStoredSession();
          return;
        }

        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Erro ao restaurar a sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (name: string, email: string) => {
    setIsLoading(true);

    try {
      await wait(AUTH_FAKE_DELAY_MS);

      const loggedUser = { name, email };
      const fakeToken = createFakeToken();

      await AsyncStorage.multiSet([
        [AUTH_STORAGE_KEYS.user, JSON.stringify(loggedUser)],
        [AUTH_STORAGE_KEYS.token, fakeToken],
      ]);

      setUser(loggedUser);
      setToken(fakeToken);
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await clearStoredSession();

      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
