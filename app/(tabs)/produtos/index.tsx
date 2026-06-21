import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryChip } from "../../../src/components/CategoryChip";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorView } from "../../../src/components/ErrorView";
import { LoadingView } from "../../../src/components/LoadingView";
import { ProductListItem } from "../../../src/components/ProductListItem";
import { SearchField } from "../../../src/components/SearchField";
import {
  ViewModeSelector,
  type ViewModeSelectorOption,
} from "../../../src/components/ViewModeSelector";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { formatarPreco, type Produto } from "../../../src/data/mockData";
import { useCategorias } from "../../../src/hooks/useCategorias";

type ViewMode = "lista" | "grade" | "agrupado";

type SecaoProduto = {
  title: string;
  data: Produto[];
};

const VIEW_MODES: ViewModeSelectorOption<ViewMode>[] = [
  { value: "lista", icon: "list-outline", label: "Lista" },
  { value: "grade", icon: "grid-outline", label: "Grade" },
  { value: "agrupado", icon: "albums-outline", label: "Agrupado" },
];

const MIN_REFRESH_DURATION_MS = 850;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const isViewMode = (value: unknown): value is ViewMode => {
  return value === "lista" || value === "grade" || value === "agrupado";
};

export default function ListaProdutos() {
  const router = useRouter();
  const params = useLocalSearchParams<{ viewMode?: string | string[] }>();
  const navigationLockRef = useRef(false);

  const initialViewMode = useMemo<ViewMode>(() => {
    const paramViewMode = Array.isArray(params.viewMode)
      ? params.viewMode[0]
      : params.viewMode;

    return isViewMode(paramViewMode) ? paramViewMode : "lista";
  }, [params.viewMode]);

  const { products, isLoading, error, carregarProdutos } = useProducts();

  const {
    categorias,
    isLoading: isLoadingCategorias,
    error: categoriasError,
    carregarCategorias,
  } = useCategorias();

  const { theme } = useAppTheme();

  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [isRefreshing, setIsRefreshing] = useState(false);

useFocusEffect(
  useCallback(() => {
    navigationLockRef.current = false;

    return () => {
      navigationLockRef.current = false;
    };
  }, []),
);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const isInitialLoading = isLoading && products.length === 0;
  const hasInitialError = Boolean(error && products.length === 0);
  const hasInlineError = Boolean(error && products.length > 0);

  useEffect(() => {
    if (!categoriaAtiva) return;
    if (categorias.length === 0) return;

    const categoriaAindaExiste = categorias.some(
      (categoria) => categoria.id === categoriaAtiva,
    );

    if (!categoriaAindaExiste) {
      setCategoriaAtiva(null);
    }
  }, [categoriaAtiva, categorias]);

const handleRefresh = useCallback(async () => {
  if (isRefreshing) return;

  setIsRefreshing(true);

  try {
    await Promise.all([
      carregarProdutos(),
      carregarCategorias(),
      wait(MIN_REFRESH_DURATION_MS),
    ]);
  } finally {
    setIsRefreshing(false);
  }
}, [carregarCategorias, carregarProdutos, isRefreshing]);

const refreshControl = (
  <RefreshControl
    refreshing={isRefreshing}
    onRefresh={handleRefresh}
    tintColor={theme.colors.primary}
    colors={[theme.colors.primary]}
    progressViewOffset={theme.spacing.lg}
  />
);

  const produtosFiltrados = useMemo(() => {
    const termoBusca = busca.toLowerCase().trim();

    return products.filter((produto) => {
      const coincideBusca = produto.nome.toLowerCase().includes(termoBusca);
      const coincideCategoria = categoriaAtiva
        ? produto.categoriaId === categoriaAtiva
        : true;

      return coincideBusca && coincideCategoria;
    });
  }, [busca, categoriaAtiva, products]);

  const secoesFiltradas = useMemo<SecaoProduto[]>(() => {
    return categorias
      .map((categoria) => {
        const produtosDaCategoria = produtosFiltrados.filter(
          (produto) => produto.categoriaId === categoria.id,
        );

        return {
          title: categoria.nome,
          data: produtosDaCategoria,
        };
      })
      .filter((secao) => secao.data.length > 0);
  }, [categorias, produtosFiltrados]);

const handleOpenProduct = useCallback(
  (productId: string) => {
    if (navigationLockRef.current) return;

    navigationLockRef.current = true;

    router.push({
      pathname: "/(tabs)/produtos/[id]",
      params: {
        id: productId,
        viewMode,
      },
    });
  },
  [router, viewMode],
);

  const renderProduto = ({ item }: { item: Produto }) => {
    const isGrade = viewMode === "grade";

    if (!isGrade) {
      return (
        <ProductListItem
          product={item}
          showStatus={false}
          showChevron
          onPress={() => handleOpenProduct(item.id)}
          style={styles.productListItem}
        />
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={`Abrir produto ${item.nome}`}
        onPress={() => handleOpenProduct(item.id)}
        style={styles.productGridCard}
      >
        <View style={styles.productInfoGrid}>
          {item.foto ? (
            <Image
              source={{ uri: item.foto }}
              style={styles.thumbnailGrid}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={styles.productIconContainerGrid}>
              <Ionicons
                name="cube-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
          )}

          <View style={styles.textsGrid}>
            <Text style={styles.productNameGrid} numberOfLines={1}>
              {item.nome}
            </Text>

            <Text style={styles.productDetailsGrid} numberOfLines={1}>
              {item.quantidade} {item.unidade} • {formatarPreco(item.preco)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: SecaoProduto }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} itens</Text>
    </View>
  );

  const emptyComponent = (
    <EmptyState
      icon="search-outline"
      title="Nenhum produto"
      description="Não encontramos resultados para a busca ou categoria selecionada."
      style={styles.emptyState}
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
        accessibilityLabel="Tentar carregar produtos novamente"
        onPress={() => {
          void handleRefresh();
        }}
        style={styles.inlineErrorButton}
      >
        <Text style={styles.inlineErrorButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const headerProdutos = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Produtos</Text>

        <ViewModeSelector
          value={viewMode}
          options={VIEW_MODES}
          onChange={setViewMode}
        />
      </View>

      <SearchField
        value={busca}
        onChangeText={setBusca}
        onClear={() => setBusca("")}
        placeholder="Buscar produto..."
        accessibilityLabel="Buscar produto"
        style={styles.searchField}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <CategoryChip
          label="Todos"
          selected={!categoriaAtiva}
          onPress={() => setCategoriaAtiva(null)}
        />

        {isLoadingCategorias ? (
          <View style={styles.categoryStateChip}>
            <Ionicons
              name="hourglass-outline"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.categoryStateText}>
              Carregando categorias...
            </Text>
          </View>
        ) : categoriasError ? (
          <TouchableOpacity
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar categorias novamente"
            onPress={() => {
              void carregarCategorias();
            }}
            style={styles.categoryRetryChip}
          >
            <Ionicons
              name="alert-circle-outline"
              size={14}
              color={theme.colors.error}
            />
            <Text style={styles.categoryRetryText}>
              Recarregar categorias
            </Text>
          </TouchableOpacity>
        ) : (
          categorias.map((categoria) => {
            const isActive = categoriaAtiva === categoria.id;

            return (
              <CategoryChip
                key={categoria.id}
                label={categoria.nome}
                selected={isActive}
                onPress={() => setCategoriaAtiva(categoria.id)}
              />
            );
          })
        )}
      </ScrollView>

{inlineErrorBanner}
    </View>
  );

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <LoadingView
          title="Carregando produtos"
          description="Buscando os produtos cadastrados na API."
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
          description={error ?? "Não foi possível carregar os produtos."}
          onRetry={() => {
            void handleRefresh();
          }}
          style={styles.errorView}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {viewMode === "agrupado" ? (
        <SectionList
          sections={secoesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={headerProdutos}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        />
      ) : (
        <FlatList
          key={viewMode}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          ListHeaderComponent={headerProdutos}
          numColumns={viewMode === "grade" ? 2 : 1}
          columnWrapperStyle={
            viewMode === "grade" ? styles.rowWrapper : undefined
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      paddingTop: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },

    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md + theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
    },

    title: {
      fontSize: theme.typography.largeTitle.fontSize,
      lineHeight: theme.typography.largeTitle.lineHeight,
      fontWeight: theme.typography.largeTitle.fontWeight,
      color: theme.colors.text,
      letterSpacing: -0.7,
    },

    searchField: {
      marginBottom: theme.spacing.md + theme.spacing.xs,
      marginHorizontal: theme.spacing.lg,
    },

    categoriesScroll: {
      marginBottom: theme.spacing.md,
    },

    categoriesContent: {
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },

    categoryStateChip: {
      minHeight: 36,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      gap: theme.spacing.xs,
    },

    categoryStateText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "600",
    },

    categoryRetryChip: {
      minHeight: 36,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.errorSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.error,
      gap: theme.spacing.xs,
    },

    categoryRetryText: {
      color: theme.colors.error,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "700",
    },

    inlineError: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
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

    listContent: {
      flexGrow: 1,
      paddingBottom: 148,
    },

    rowWrapper: {
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    },

    productListItem: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
    },

    productGridCard: {
      flex: 1,
      marginHorizontal: theme.spacing.sm + theme.spacing.xs,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    productInfoGrid: {
      width: "100%",
      alignItems: "center",
      gap: theme.spacing.sm + theme.spacing.xs,
    },

    productIconContainerGrid: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
    },

    thumbnailGrid: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    textsGrid: {
      width: "100%",
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },

    productNameGrid: {
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
    },

    productDetailsGrid: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontWeight: "500",
      textAlign: "center",
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },

    sectionTitle: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "800",
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    sectionCount: {
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      color: theme.colors.textSecondary,
      fontWeight: "700",
    },

    emptyState: {
      marginTop: theme.spacing["3xl"],
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