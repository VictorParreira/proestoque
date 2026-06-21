import { Ionicons } from "@expo/vector-icons";

import type { ProductUnit } from "../constants/productOptions";
import type { ThemeType } from "../constants/theme";

export type CategoriaColorToken = Extract<
  keyof ThemeType["colors"],
  "primary" | "success" | "info" | "warning" | "error"
>;

export type CategoriaIconName = keyof typeof Ionicons.glyphMap;

export type Categoria = {
  id: string;
  nome: string;
  icone: CategoriaIconName;
  colorToken: CategoriaColorToken;
};

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: ProductUnit;
  ultimaMovimentacao: string;
  foto?: string;
};

export const getProdutosComEstoqueBaixo = (produtos: Produto[]) => {
  return produtos.filter(
    (produto) => produto.quantidade < produto.quantidadeMinima,
  );
};

export const getValorTotalEstoque = (produtos: Produto[]) => {
  return produtos.reduce(
    (total, produto) => total + produto.quantidade * produto.preco,
    0,
  );
};

export const formatarPreco = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};