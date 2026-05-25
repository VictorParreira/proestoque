import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductListItem } from "../../src/components/ProductListItem";

import {
  SummaryCard,
  type SummaryCardVariant,
} from "../../src/components/SummaryCard";

import { CriticalStockAlert } from "../../src/components/CriticalStockAlert";

import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProducts } from "../../src/contexts/ProductsContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import {
  CATEGORIAS_MOCK,
  formatarPreco,
  type Produto,
} from "../../src/data/mockData";

type DashboardSummaryCard = {
  id: string;
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  variant: SummaryCardVariant;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { theme } = useAppTheme();

  const [refreshing, setRefreshing] = useState(false);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const alertas = useMemo(() => {
    return products.filter(
      (product) => product.quantidade < product.quantidadeMinima,
    );
  }, [products]);

  const valorTotal = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.quantidade * product.preco,
      0,
    );
  }, [products]);

  const cardResumo = useMemo<DashboardSummaryCard[]>(
    () => [
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
    ],
    [alertas.length, products.length, valorTotal],
  );

  const saudacao = useMemo(() => {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";

    return "Boa noite";
  }, []);

  const dataHoje = useMemo(() => {
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
    }).format(new Date());

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }, []);

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const recentProducts = useMemo(() => {
    return products.slice(-5).reverse();
  }, [products]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 900);
  }, []);

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingTitle} numberOfLines={2}>
            {saudacao}, {user?.name || "Visitante"}
          </Text>

          <Text style={styles.greetingSubtitle}>{dataHoje}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicialUsuario}</Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardResumo.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            variant={card.variant}
            style={styles.summaryCard}
          />
        ))}
      </View>

      <CriticalStockAlert items={alertas} style={styles.criticalStockAlert} />

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const EmptyProducts = () => (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
      </View>

      <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>

      <Text style={styles.emptyDescription}>
        Cadastre seu primeiro produto para visualizar indicadores e alertas de
        estoque.
      </Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    return (
      <ProductListItem
        product={item}
        showStatus
        style={styles.productListItem}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={recentProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        ListEmptyComponent={EmptyProducts}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    listContent: {
      paddingBottom: 148,
    },

    headerContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    greetingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },

    greetingTextContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },

    greetingTitle: {
      fontSize: theme.typography.largeTitle.fontSize,
      lineHeight: theme.typography.largeTitle.lineHeight,
      fontWeight: theme.typography.largeTitle.fontWeight,
      color: theme.colors.text,
      letterSpacing: -0.7,
    },

    greetingSubtitle: {
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textTransform: "capitalize",
      fontWeight: "500",
    },

    avatar: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    avatarText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.title3.fontSize,
      lineHeight: theme.typography.title3.lineHeight,
      fontWeight: "700",
    },

    cardsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xl,
    },

    summaryCard: {
      width: "48%",
      marginBottom: theme.spacing.md,
    },

    criticalStockAlert: {
      marginBottom: theme.spacing.xl,
    },

    sectionTitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },

    productListItem: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
    },

    emptyCard: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    emptyIconContainer: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.primarySubtle,
    },

    emptyTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },

    emptyDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      textAlign: "center",
    },
  });
