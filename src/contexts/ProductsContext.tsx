import { isAxiosError } from "axios";
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useAuth } from "./AuthContext";
import type { ApiErrorResponse } from "../services/api";
import { api } from "../services/api";
import type { Produto } from "../data/mockData";
import type { ProdutoFormData } from "../schemas/produtoSchema";

type ApiProduto = {
  id: string;
  nome: string;
  categoriaId: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  foto?: string | null;
  ultimaMovimentacao: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

type Action =
  | { type: "LOAD_PRODUCTS_START" }
  | { type: "LOAD_PRODUCTS_SUCCESS"; payload: Produto[] }
  | { type: "LOAD_PRODUCTS_FAILURE"; payload: string }
  | { type: "ADD_PRODUCT"; payload: Produto }
  | { type: "UPDATE_PRODUCT"; payload: Produto }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "CLEAR_PRODUCTS" }
  | { type: "CLEAR_ERROR" };

type State = {
  products: Produto[];
  isLoading: boolean;
  error: string | null;
};

type ProductsContextData = {
  products: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  addProduct: (data: ProdutoFormData) => Promise<void>;
  updateProduct: (id: string, data: ProdutoFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextData | undefined>(
  undefined,
);

const initialState: State = {
  products: [],
  isLoading: false,
  error: null,
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

  return "Erro inesperado ao processar produtos.";
};

const mapApiProdutoToProduto = (apiProduto: ApiProduto): Produto => {
  return {
    id: apiProduto.id,
    nome: apiProduto.nome,
    categoriaId: apiProduto.categoriaId,
    quantidade: apiProduto.quantidade,
    quantidadeMinima: apiProduto.quantidadeMinima,
    preco: apiProduto.preco,
    unidade: apiProduto.unidade as Produto["unidade"],
    ultimaMovimentacao: apiProduto.ultimaMovimentacao,
    ...(apiProduto.foto ? { foto: apiProduto.foto } : {}),
  };
};

const mapApiProdutosToProdutos = (apiProdutos: ApiProduto[]) => {
  return apiProdutos.map(mapApiProdutoToProduto);
};

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_PRODUCTS_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOAD_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload,
        isLoading: false,
        error: null,
      };

    case "LOAD_PRODUCTS_FAILURE":
      return {
        ...state,
        products: [],
        isLoading: false,
        error: action.payload,
      };

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        error: null,
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        ),
        error: null,
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload,
        ),
        error: null,
      };

    case "CLEAR_PRODUCTS":
      return {
        ...initialState,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isRestoringSession } = useAuth();
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const carregarProdutos = useCallback(async () => {
    dispatch({ type: "LOAD_PRODUCTS_START" });

    try {
      const response = await api.get<ApiProduto[]>("/produtos");
      const produtos = mapApiProdutosToProdutos(response.data);

      dispatch({
        type: "LOAD_PRODUCTS_SUCCESS",
        payload: produtos,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);

      console.error("Erro ao carregar produtos:", error);

      dispatch({
        type: "LOAD_PRODUCTS_FAILURE",
        payload: message,
      });
    }
  }, []);

  useEffect(() => {
    if (isRestoringSession) return;

    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_PRODUCTS" });
      return;
    }

    void carregarProdutos();
  }, [carregarProdutos, isAuthenticated, isRestoringSession]);

  const addProduct = useCallback(async (data: ProdutoFormData) => {
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await api.post<ApiProduto>("/produtos", data);
      const produto = mapApiProdutoToProduto(response.data);

      dispatch({
        type: "ADD_PRODUCT",
        payload: produto,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);

      dispatch({
        type: "LOAD_PRODUCTS_FAILURE",
        payload: message,
      });

      throw new Error(message);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, data: ProdutoFormData) => {
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await api.put<ApiProduto>(`/produtos/${id}`, data);
        const produto = mapApiProdutoToProduto(response.data);

        dispatch({
          type: "UPDATE_PRODUCT",
          payload: produto,
        });
      } catch (error) {
        const message = getApiErrorMessage(error);

        dispatch({
          type: "LOAD_PRODUCTS_FAILURE",
          payload: message,
        });

        throw new Error(message);
      }
    },
    [],
  );

  const deleteProduct = useCallback(async (id: string) => {
    dispatch({ type: "CLEAR_ERROR" });

    try {
      await api.delete(`/produtos/${id}`);

      dispatch({
        type: "DELETE_PRODUCT",
        payload: id,
      });
    } catch (error) {
      const message = getApiErrorMessage(error);

      dispatch({
        type: "LOAD_PRODUCTS_FAILURE",
        payload: message,
      });

      throw new Error(message);
    }
  }, []);

  const value = useMemo<ProductsContextData>(
    () => ({
      products: state.products,
      isLoading: state.isLoading,
      error: state.error,
      carregarProdutos,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      state.products,
      state.isLoading,
      state.error,
      carregarProdutos,
      addProduct,
      updateProduct,
      deleteProduct,
    ],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductsProvider");
  }

  return context;
}