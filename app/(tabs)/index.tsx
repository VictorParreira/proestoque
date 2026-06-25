import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
import type { Produto } from "../../src/domain/produtos";
import { useDashboardGreeting } from "../../src/hooks/useDashboardGreeting";
import { useDashboardMetrics } from "../../src/hooks/useDashboardMetrics";

const MIN_DASHBOARD_REFRESH_DURATION_MS = 900;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, isLoading, error, carregarProdutos } = useProducts();
const { theme, isDark } = useAppTheme();
const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

const styles = useMemo(
  () => createStyles(theme, isDark, insets.top),
  [theme, isDark, insets.top],
);

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
    progressViewOffset={insets.top + theme.spacing.lg}
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
        <Text style={styles.inlineErrorButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingEyebrow} numberOfLines={1}>
  {greeting},
</Text>

<Text style={styles.greetingName} numberOfLines={1}>
  {displayName}
</Text>

<Text style={styles.greetingSubtitle} numberOfLines={1}>
  {formattedDate}
</Text>
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
  title="Não foi possível carregar o dashboard"
  description={error ?? "Verifique sua conexão e tente novamente."}
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
  <SafeAreaView style={styles.container} edges={["left", "right"]}>
<View pointerEvents="none" style={styles.topBlur}>
  <BlurView
    intensity={Platform.OS === "android" ? 72 : 34}
    tint={
      isDark
        ? "systemUltraThinMaterialDark"
        : "systemUltraThinMaterialLight"
    }
    experimentalBlurMethod="dimezisBlurView"
    style={StyleSheet.absoluteFill}
  />

  <View style={styles.topBlurScrim} />
</View>

{refreshing ? (
  <View pointerEvents="none" style={styles.refreshIndicator}>
    <ActivityIndicator size="small" color={theme.colors.primary} />
  </View>
) : null}

<FlatList
  data={recentProducts}
  keyExtractor={(item) => item.id}
  renderItem={renderProduto}
  ListHeaderComponent={DashboardHeader}
  ListEmptyComponent={EmptyProducts}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  refreshControl={refreshControl}
  contentInsetAdjustmentBehavior="never"
/>
    </SafeAreaView>
  );
}

const createStyles = (
  theme: ThemeType,
  isDark: boolean,
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    topBlur: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: topInset + theme.spacing.xs,
  zIndex: 10,
  overflow: "hidden",
},

topBlurScrim: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.background,
  opacity: isDark ? 0.18 : 0.28,
},

refreshIndicator: {
  position: "absolute",
  top: topInset + theme.spacing.sm,
  alignSelf: "center",
  zIndex: 20,
},

    listContent: {
      flexGrow: 1,
      paddingBottom: 148,
    },

headerContainer: {
  paddingHorizontal: theme.spacing.lg,
  paddingTop: topInset + theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
},

greetingEyebrow: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.subheadline.fontSize,
  lineHeight: theme.typography.subheadline.lineHeight,
  fontWeight: "600",
  letterSpacing: -0.2,
},

greetingName: {
  color: theme.colors.text,
  fontSize: 24,
  lineHeight: 29,
  fontWeight: "800",
  letterSpacing: -0.45,
  marginTop: theme.spacing.xxs,
},

  greetingContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing.md,
},

    greetingTextContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },

  greetingSubtitle: {
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  color: theme.colors.textTertiary,
  marginTop: theme.spacing.xxs,
  fontWeight: "500",
},

avatar: {
  width: 42,
  height: 42,
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
  fontSize: theme.typography.subheadline.fontSize,
  lineHeight: theme.typography.subheadline.lineHeight,
  fontWeight: "800",
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
  marginBottom: theme.spacing.md,
},

    summaryCard: {
  width: "48%",
  marginBottom: theme.spacing.sm + theme.spacing.xs,
},

    criticalStockAlert: {
  marginBottom: theme.spacing.lg,
},

    sectionTitle: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.lineHeight,
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: 0.6,
  marginBottom: theme.spacing.sm,
  marginLeft: theme.spacing.xs,
},

    productListItem: {
  marginHorizontal: theme.spacing.lg,
  marginBottom: theme.spacing.sm,
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