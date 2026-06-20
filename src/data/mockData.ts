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

export const CATEGORIAS_MOCK: Categoria[] = [
  {
    id: "cat_1",
    nome: "Bebidas",
    icone: "cafe-outline",
    colorToken: "primary",
  },
  {
    id: "cat_2",
    nome: "Alimentos",
    icone: "fast-food-outline",
    colorToken: "success",
  },
  {
    id: "cat_3",
    nome: "Limpeza",
    icone: "sparkles-outline",
    colorToken: "info",
  },
  {
    id: "cat_4",
    nome: "Eletrônicos",
    icone: "hardware-chip-outline",
    colorToken: "warning",
  },
  {
    id: "cat_5",
    nome: "Papelaria",
    icone: "document-outline",
    colorToken: "error",
  },
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: "prod_1",
    nome: "Café Especial 250g",
    categoriaId: "cat_1",
    quantidade: 4,
    quantidadeMinima: 10,
    preco: 25.9,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_2",
    nome: "Água Mineral 500ml",
    categoriaId: "cat_1",
    quantidade: 48,
    quantidadeMinima: 20,
    preco: 2.5,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_3",
    nome: "Suco de Laranja 1L",
    categoriaId: "cat_1",
    quantidade: 6,
    quantidadeMinima: 12,
    preco: 8.9,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_4",
    nome: "Arroz Branco 5kg",
    categoriaId: "cat_2",
    quantidade: 15,
    quantidadeMinima: 10,
    preco: 28.5,
    unidade: "cx",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_5",
    nome: "Feijão Carioca 1kg",
    categoriaId: "cat_2",
    quantidade: 3,
    quantidadeMinima: 15,
    preco: 8.2,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_6",
    nome: "Sabão em Pó 3kg",
    categoriaId: "cat_3",
    quantidade: 0,
    quantidadeMinima: 4,
    preco: 32.9,
    unidade: "cx",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_7",
    nome: "Caneta Esferográfica",
    categoriaId: "cat_5",
    quantidade: 1,
    quantidadeMinima: 20,
    preco: 1.5,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
  {
    id: "prod_8",
    nome: "Mouse Sem Fio",
    categoriaId: "cat_4",
    quantidade: 12,
    quantidadeMinima: 5,
    preco: 89.9,
    unidade: "un",
    ultimaMovimentacao: new Date().toISOString(),
  },
];

export const getProdutosComEstoqueBaixo = (
  produtos: Produto[] = PRODUTOS_MOCK,
) => {
  return produtos.filter(
    (produto) => produto.quantidade < produto.quantidadeMinima,
  );
};

export const getValorTotalEstoque = (produtos: Produto[] = PRODUTOS_MOCK) => {
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
