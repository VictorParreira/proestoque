import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import type { SummaryCardVariant } from "../components/SummaryCard";
import {
    CATEGORIAS_MOCK,
    formatarPreco,
    getProdutosComEstoqueBaixo,
    getValorTotalEstoque,
    type Produto,
} from "../data/mockData";

export type DashboardSummaryCard = {
  id: string;
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  variant: SummaryCardVariant;
};

export function useDashboardMetrics(products: Produto[]) {
  return useMemo(() => {
    const alertas = getProdutosComEstoqueBaixo(products);
    const valorTotal = getValorTotalEstoque(products);
    const recentProducts = products.slice(-5).reverse();

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
        value: CATEGORIAS_MOCK.length,
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
