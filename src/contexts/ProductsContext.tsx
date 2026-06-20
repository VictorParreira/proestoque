import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
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

const isProduct = (value: unknown): value is Produto => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Produto>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.nome === "string" &&
    candidate.nome.trim().length > 0 &&
    typeof candidate.categoriaId === "string" &&
    candidate.categoriaId.trim().length > 0 &&
    typeof candidate.quantidade === "number" &&
    Number.isFinite(candidate.quantidade) &&
    typeof candidate.quantidadeMinima === "number" &&
    Number.isFinite(candidate.quantidadeMinima) &&
    typeof candidate.preco === "number" &&
    Number.isFinite(candidate.preco) &&
    typeof candidate.unidade === "string" &&
    candidate.unidade.trim().length > 0 &&
    typeof candidate.ultimaMovimentacao === "string" &&
    candidate.ultimaMovimentacao.trim().length > 0
  );
};

const parseStoredProducts = (storedProducts: string): Produto[] | null => {
  try {
    const parsedProducts: unknown = JSON.parse(storedProducts);

    if (!Array.isArray(parsedProducts)) return null;

    return parsedProducts.every(isProduct) ? parsedProducts : null;
  } catch {
    return null;
  }
};

const restoreDefaultProducts = async () => {
  await persistProducts(PRODUTOS_MOCK);

  return PRODUTOS_MOCK;
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
  const productsRef = useRef<Produto[]>(initialState.products);

  useEffect(() => {
    productsRef.current = state.products;
  }, [state.products]);

  const loadProducts = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);

      if (!stored) {
        const defaultProducts = await restoreDefaultProducts();

        productsRef.current = defaultProducts;
        dispatch({ type: "LOAD_PRODUCTS", payload: defaultProducts });
        return;
      }

      const parsedProducts = parseStoredProducts(stored);

      if (!parsedProducts) {
        const defaultProducts = await restoreDefaultProducts();

        productsRef.current = defaultProducts;
        dispatch({ type: "LOAD_PRODUCTS", payload: defaultProducts });
        return;
      }

      productsRef.current = parsedProducts;
      dispatch({ type: "LOAD_PRODUCTS", payload: parsedProducts });
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);

      productsRef.current = PRODUTOS_MOCK;
      dispatch({ type: "LOAD_PRODUCTS", payload: PRODUTOS_MOCK });
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const commitProducts = useCallback(
    async (products: Produto[], action: Action) => {
      productsRef.current = products;
      dispatch(action);
      await persistProducts(products);
    },
    [],
  );

  const addProduct = useCallback(
    async (data: ProdutoFormData) => {
      const currentProducts = productsRef.current;

      const newProduct: Produto = {
        ...data,
        id: createProductId(),
        ultimaMovimentacao: getCurrentTimestamp(),
      };

      const newProductsList = [...currentProducts, newProduct];

      await commitProducts(newProductsList, {
        type: "ADD_PRODUCT",
        payload: newProduct,
      });
    },
    [commitProducts],
  );

  const updateProduct = useCallback(
    async (id: string, data: ProdutoFormData) => {
      const currentProducts = productsRef.current;
      const existingProduct = currentProducts.find(
        (product) => product.id === id,
      );

      if (!existingProduct) return;

      const updatedProduct: Produto = {
        ...existingProduct,
        ...data,
        ultimaMovimentacao: getCurrentTimestamp(),
      };

      const newProductsList = currentProducts.map((product) =>
        product.id === id ? updatedProduct : product,
      );

      await commitProducts(newProductsList, {
        type: "UPDATE_PRODUCT",
        payload: updatedProduct,
      });
    },
    [commitProducts],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const currentProducts = productsRef.current;
      const newProductsList = currentProducts.filter(
        (product) => product.id !== id,
      );

      await commitProducts(newProductsList, {
        type: "DELETE_PRODUCT",
        payload: id,
      });
    },
    [commitProducts],
  );

  const value = useMemo<ProductsContextData>(
    () => ({
      products: state.products,
      isLoading: state.isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [state.products, state.isLoading, addProduct, updateProduct, deleteProduct],
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
