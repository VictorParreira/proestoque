import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import {
  darkTheme,
  lightTheme,
  type ThemeMode,
  type ThemeType,
} from "../constants/theme";

const THEME_STORAGE_KEY = "@ProEstoque:theme";

export type ThemePreference = ThemeMode | "system";

type ThemeContextData = {
  /**
   * Tema resolvido no momento.
   * Exemplo: se a preferência for "system" e o sistema estiver escuro,
   * o valor será "dark".
   */
  mode: ThemeMode;

  /**
   * Preferência escolhida pelo usuário.
   * Pode ser "system", "light" ou "dark".
   */
  preference: ThemePreference;

  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;

  theme: ThemeType;

  /**
   * Mantido para compatibilidade com telas que já usam toggleTheme().
   * Alterna entre light/dark manualmente.
   */
  toggleTheme: () => Promise<void>;

  /**
   * Novo método principal para a refatoração.
   * Permite definir "system", "light" ou "dark".
   */
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();

  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    let isMounted = true;

    async function loadStoredThemePreference() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (isMounted && isThemePreference(savedTheme)) {
          setPreference(savedTheme);
        }
      } catch {
        /**
         * Em caso de falha no AsyncStorage, mantém "system".
         * Não bloqueia a inicialização do app por tema.
         */
      }
    }

    loadStoredThemePreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const mode: ThemeMode = useMemo(() => {
    if (preference === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }

    return preference;
  }, [preference, systemColorScheme]);

  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode],
  );

  const setThemePreference = useCallback(
    async (nextPreference: ThemePreference) => {
      setPreference(nextPreference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    },
    [],
  );

  const toggleTheme = useCallback(async () => {
    const nextPreference: ThemePreference = mode === "dark" ? "light" : "dark";
    await setThemePreference(nextPreference);
  }, [mode, setThemePreference]);

  const value = useMemo<ThemeContextData>(
    () => ({
      mode,
      preference,
      isDark: mode === "dark",
      isLight: mode === "light",
      isSystem: preference === "system",
      theme,
      toggleTheme,
      setThemePreference,
    }),
    [mode, preference, theme, toggleTheme, setThemePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
}
