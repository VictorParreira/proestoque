import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import type {
  Categoria,
  CategoriaColorToken,
  CategoriaIconName,
} from "../domain/produtos";
import { api, type ApiErrorResponse } from "../services/api";

type ApiCategoria = {
  id: string;
  nome: string;
  icone: string;
  colorToken: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

type UseCategoriasResult = {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  carregarCategorias: () => Promise<void>;
};

const DEFAULT_CATEGORY_ICON: CategoriaIconName = "pricetag-outline";
const DEFAULT_CATEGORY_COLOR_TOKEN: CategoriaColorToken = "primary";

const CATEGORY_COLOR_TOKENS: CategoriaColorToken[] = [
  "primary",
  "success",
  "info",
  "warning",
  "error",
];

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.erro ??
      "Não foi possível carregar as categorias."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado ao carregar categorias.";
};

const isCategoriaIconName = (value: string): value is CategoriaIconName => {
  return value in Ionicons.glyphMap;
};

const isCategoriaColorToken = (
  value: string,
): value is CategoriaColorToken => {
  return CATEGORY_COLOR_TOKENS.includes(value as CategoriaColorToken);
};

const mapApiCategoriaToCategoria = (
  apiCategoria: ApiCategoria,
): Categoria => {
  return {
    id: apiCategoria.id,
    nome: apiCategoria.nome,
    icone: isCategoriaIconName(apiCategoria.icone)
      ? apiCategoria.icone
      : DEFAULT_CATEGORY_ICON,
    colorToken: isCategoriaColorToken(apiCategoria.colorToken)
      ? apiCategoria.colorToken
      : DEFAULT_CATEGORY_COLOR_TOKEN,
  };
};

export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiCategoria[]>("/categorias");

      setCategorias(response.data.map(mapApiCategoriaToCategoria));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);

      setCategorias([]);
setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarCategorias();
  }, [carregarCategorias]);

  return {
    categorias,
    isLoading,
    error,
    carregarCategorias,
  };
}