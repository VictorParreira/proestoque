import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBadge } from "../../src/components/StatusBadge";

import {
  SummaryCard,
  type SummaryCardVariant,
} from "../../src/components/SummaryCard";

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

function getProductStockStatus(product: Produto) {
  if (product.quantidade === 0) {
    return {
      variant: "error" as const,
      text: "Vazio",
    };
  }

  if (product.quantidade < product.quantidadeMinima) {
    return {
      variant: "warning" as const,
      text: "Baixo",
    };
  }

  return {
    variant: "success" as const,
    text: "Normal",
  };
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { theme } = useAppTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [expandido, setExpandido] = useState(false);

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

  const alertasExibidos = useMemo(() => {
    return expandido ? alertas : alertas.slice(0, 5);
  }, [alertas, expandido]);

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

      {alertas.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIconContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={theme.colors.error}
              />
            </View>

            <Text style={styles.alertTitle}>Estoque Crítico</Text>

            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{alertas.length}</Text>
            </View>
          </View>

          <View style={styles.alertList}>
            {alertasExibidos.map((item) => (
              <View key={item.id} style={styles.alertRow}>
                <Text style={styles.alertText} numberOfLines={1}>
                  {item.nome}
                </Text>

                <Text style={styles.alertQuantity}>
                  {item.quantidade} / {item.quantidadeMinima}
                </Text>
              </View>
            ))}
          </View>

          {alertas.length > 5 && (
            <TouchableOpacity
              style={styles.alertToggleButton}
              activeOpacity={0.72}
              onPress={() => setExpandido((current) => !current)}
              accessibilityRole="button"
              accessibilityLabel={
                expandido
                  ? "Recolher lista de estoque crítico"
                  : `Visualizar todos os ${alertas.length} itens com estoque crítico`
              }
            >
              <Text style={styles.alertToggleText}>
                {expandido
                  ? "Recolher lista"
                  : `Visualizar todos os ${alertas.length} itens`}
              </Text>

              <Ionicons
                name={expandido ? "chevron-up" : "chevron-down"}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

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
    const status = getProductStockStatus(item);

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          {item.foto ? (
            <Image
              source={{ uri: item.foto }}
              style={styles.productThumbnail}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={styles.productIcon}>
              <Ionicons
                name="cube-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
          )}

          <View style={styles.productTexts}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.nome}
            </Text>

            <Text style={styles.productMeta}>
              {item.quantidade} {item.unidade} • {formatarPreco(item.preco)}
            </Text>
          </View>
        </View>

        <StatusBadge label={status.text} variant={status.variant} />
      </View>
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

    alertCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    alertHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    alertIconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.errorSoft,
    },

    alertTitle: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      color: theme.colors.text,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
    },

    alertBadge: {
      backgroundColor: theme.colors.errorSoft,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.borderRadius.sm,
    },

    alertBadgeText: {
      color: theme.colors.error,
      fontWeight: "800",
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
    },

    alertList: {
      gap: theme.spacing.sm,
    },

    alertRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      padding: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },

    alertText: {
      flex: 1,
      marginRight: theme.spacing.sm + theme.spacing.xs,
      color: theme.colors.text,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

    alertQuantity: {
      color: theme.colors.error,
      fontWeight: "700",
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
    },

    alertToggleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.separator,
      gap: theme.spacing.xs,
    },

    alertToggleText: {
      color: theme.colors.primary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
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

    productCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    productInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    productThumbnail: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm + theme.spacing.xs,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    productIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm + theme.spacing.xs,
    },

    productTexts: {
      flex: 1,
      paddingRight: theme.spacing.sm,
    },

    productName: {
      color: theme.colors.text,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "700",
      marginBottom: 2,
    },

    productMeta: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "500",
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
