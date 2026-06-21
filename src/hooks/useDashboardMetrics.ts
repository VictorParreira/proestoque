import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import type { SummaryCardVariant } from "../components/SummaryCard";
import {
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  type Produto,
} from "../domain/produtos";

export type DashboardSummaryCard = {
  id: string;
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  variant: SummaryCardVariant;
};

const getTotalCategoriasComProdutos = (products: Produto[]) => {
  const categoriasIds = new Set(
    products
      .map((produto) => produto.categoriaId)
      .filter((categoriaId) => categoriaId.trim().length > 0),
  );

  return categoriasIds.size;
};

export function useDashboardMetrics(products: Produto[]) {
  return useMemo(() => {
    const alertas = getProdutosComEstoqueBaixo(products);
    const valorTotal = getValorTotalEstoque(products);
    const recentProducts = products.slice(-5).reverse();
    const totalCategorias = getTotalCategoriasComProdutos(products);

    const cardResumo: DashboardSummaryCard[] = [
      {
        id: "total",
        title: "Produtos",
        value: products.length,
        icon: "cube-outline",
        variant: "primary",
      },
      {
        id: "alertas",
        title: "Alertas",
        value: alertas.length,
        icon: "alert-circle-outline",
        variant: "error",
      },
      {
        id: "categorias",
        title: "Categorias",
        value: totalCategorias,
        icon: "grid-outline",
        variant: "info",
      },
      {
        id: "valor",
        title: "Em Estoque",
        value: formatarPreco(valorTotal),
        icon: "cash-outline",
        variant: "success",
      },
    ];

    return {
      alertas,
      valorTotal,
      recentProducts,
      cardResumo,
    };
  }, [products]);
}