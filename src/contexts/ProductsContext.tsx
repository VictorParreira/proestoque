import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Produto, PRODUTOS_MOCK } from "../data/mockData";
import { ProdutoFormData } from "../schemas/produtoSchema";

type Action =
  | { type: "LOAD_PRODUCTS"; payload: Produto[] }
  | { type: "ADD_PRODUCT"; payload: Produto }
  | { type: "UPDATE_PRODUCT"; payload: Produto }
  | { type: "DELETE_PRODUCT"; payload: string };

type State = {
  products: Produto[];
  isLoading: boolean;
};

type ProductsContextData = {
  products: Produto[];
  isLoading: boolean;
  addProduct: (data: ProdutoFormData) => Promise<void>;
  updateProduct: (id: string, data: ProdutoFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextData | undefined>(
  undefined,
);

const initialState: State = {
  products: [],
  isLoading: true,
};

const PRODUCTS_STORAGE_KEY = "@ProEstoque:products";

const createProductId = () => {
  return `prod_${Date.now()}`;
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

const persistProducts = async (products: Produto[]) => {
  await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_PRODUCTS":
      return { ...state, products: action.payload, isLoading: false };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        dispatch({ type: "LOAD_PRODUCTS", payload: JSON.parse(stored) });
      } else {
        await persistProducts(PRODUTOS_MOCK);
        dispatch({ type: "LOAD_PRODUCTS", payload: PRODUTOS_MOCK });
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      dispatch({ type: "LOAD_PRODUCTS", payload: [] });
    }
  };

  const addProduct = async (data: ProdutoFormData) => {
    const newProduct: Produto = {
      ...data,
      id: createProductId(),
      ultimaMovimentacao: getCurrentTimestamp(),
    };

    const newProductsList = [...state.products, newProduct];
    dispatch({ type: "ADD_PRODUCT", payload: newProduct });
    await persistProducts(newProductsList);
  };

  const updateProduct = async (id: string, data: ProdutoFormData) => {
    const existingProduct = state.products.find((p) => p.id === id);
    if (!existingProduct) return;

    const updatedProduct: Produto = {
      ...existingProduct,
      ...data,
      ultimaMovimentacao: getCurrentTimestamp(),
    };

    const newProductsList = state.products.map((p) =>
      p.id === id ? updatedProduct : p,
    );
    dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });
    await persistProducts(newProductsList);
  };

  const deleteProduct = async (id: string) => {
    const newProductsList = state.products.filter((p) => p.id !== id);
    dispatch({ type: "DELETE_PRODUCT", payload: id });
    await persistProducts(newProductsList);
  };

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        isLoading: state.isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
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
