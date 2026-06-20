import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../../src/components/EmptyState";
import { ProductListItem } from "../../src/components/ProductListItem";

import { SummaryCard } from "../../src/components/SummaryCard";

import { CriticalStockAlert } from "../../src/components/CriticalStockAlert";

import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProducts } from "../../src/contexts/ProductsContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import type { Produto } from "../../src/data/mockData";
import { useDashboardGreeting } from "../../src/hooks/useDashboardGreeting";
import { useDashboardMetrics } from "../../src/hooks/useDashboardMetrics";

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

  const { alertas, cardResumo, recentProducts } = useDashboardMetrics(products);

  const { greeting, formattedDate, displayName, userInitial } =
    useDashboardGreeting(user?.name);

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
            {greeting}, {displayName}
          </Text>

          <Text style={styles.greetingSubtitle}>{formattedDate}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
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

    emptyState: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      paddingVertical: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
  });
