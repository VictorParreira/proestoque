import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import { api, type ApiErrorResponse } from "../services/api";

export type ProductMovementType = "entrada" | "saida";

export type ProductMovement = {
  id: string;
  produtoId: string;
  tipo: ProductMovementType;
  quantidade: number;
  observacao?: string | null;
  criadaEm: string;
};

type UseProductMovementsResult = {
  movimentacoes: ProductMovement[];
  isLoading: boolean;
  error: string | null;
  carregarMovimentacoes: () => Promise<void>;
};

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.erro ??
      "Não foi possível carregar o histórico de movimentações."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado ao carregar movimentações.";
};

export function useProductMovements(
  produtoId?: string,
): UseProductMovementsResult {
  const [movimentacoes, setMovimentacoes] = useState<ProductMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarMovimentacoes = useCallback(async () => {
    if (!produtoId) {
      setMovimentacoes([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ProductMovement[]>(
        `/produtos/${produtoId}/movimentacoes`,
      );

      setMovimentacoes(response.data);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [produtoId]);

  useEffect(() => {
    void carregarMovimentacoes();
  }, [carregarMovimentacoes]);

  return {
    movimentacoes,
    isLoading,
    error,
    carregarMovimentacoes,
  };
}