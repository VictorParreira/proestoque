import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CriticalStockAlert } from "../../src/components/CriticalStockAlert";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorView } from "../../src/components/ErrorView";
import { LoadingView } from "../../src/components/LoadingView";
import { ProductListItem } from "../../src/components/ProductListItem";
import { SummaryCard } from "../../src/components/SummaryCard";
import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProducts } from "../../src/contexts/ProductsContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import type { Produto } from "../../src/data/mockData";
import { useDashboardGreeting } from "../../src/hooks/useDashboardGreeting";
import { useDashboardMetrics } from "../../src/hooks/useDashboardMetrics";

const MIN_DASHBOARD_REFRESH_DURATION_MS = 900;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, isLoading, error, carregarProdutos } = useProducts();
  const { theme } = useAppTheme();

  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { alertas, cardResumo, recentProducts } = useDashboardMetrics(products);

  const { greeting, formattedDate, displayName, userInitial } =
    useDashboardGreeting(user?.name);

  const isInitialLoading = isLoading && products.length === 0;
  const hasInitialError = Boolean(error && products.length === 0);
  const hasInlineError = Boolean(error && products.length > 0);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await Promise.all([
        carregarProdutos(),
        wait(MIN_DASHBOARD_REFRESH_DURATION_MS),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [carregarProdutos, refreshing]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
      progressBackgroundColor={theme.colors.surface}
      progressViewOffset={theme.spacing.lg}
    />
  );

  const inlineErrorBanner = hasInlineError ? (
    <View style={styles.inlineError}>
      <Ionicons
        name="alert-circle-outline"
        size={18}
        color={theme.colors.error}
      />

      <Text style={styles.inlineErrorText}>{error}</Text>

      <TouchableOpacity
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel="Tentar carregar dashboard novamente"
        onPress={() => {
          void onRefresh();
        }}
        style={styles.inlineErrorButton}
      >
        <Text style={styles.inlineErrorButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingTitle} numberOfLines={2}>
            {greeting}, {displayName}
          </Text>

          <Text style={styles.greetingSubtitle}>{formattedDate}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
      </View>

      {inlineErrorBanner}

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
    <EmptyState
      icon="cube-outline"
      title="Nenhum produto cadastrado"
      description="Cadastre seu primeiro produto para visualizar indicadores e alertas de estoque."
      style={styles.emptyState}
    />
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

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <LoadingView
          title="Carregando dashboard"
          description="Buscando produtos, alertas e indicadores atualizados."
        />
      </SafeAreaView>
    );
  }

  if (hasInitialError) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.errorScrollView}
          contentContainerStyle={styles.errorScrollContent}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <ErrorView
            description={error ?? "Não foi possível carregar o dashboard."}
            onRetry={() => {
              void onRefresh();
            }}
            style={styles.errorView}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        refreshControl={refreshControl}
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
      flexGrow: 1,
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

    inlineError: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.errorSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.error,
      gap: theme.spacing.sm,
    },

    inlineErrorText: {
      flex: 1,
      color: theme.colors.error,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

    inlineErrorButton: {
      minHeight: 30,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.error,
    },

    inlineErrorButtonText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
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

    emptyState: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      paddingVertical: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    errorScrollView: {
      flex: 1,
    },

    errorScrollContent: {
      flexGrow: 1,
    },

    errorView: {
      flex: 1,
    },
  });