import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryChip } from "../../../src/components/CategoryChip";
import { ProductListItem } from "../../../src/components/ProductListItem";
import { SearchField } from "../../../src/components/SearchField";
import {
  ViewModeSelector,
  type ViewModeSelectorOption,
} from "../../../src/components/ViewModeSelector";

import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { CATEGORIAS_MOCK, type Produto } from "../../../src/data/mockData";

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

export default function ListaProdutos() {
  const router = useRouter();
  const { products } = useProducts();
  const { theme } = useAppTheme();

  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("lista");

  const styles = useMemo(() => createStyles(theme), [theme]);

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
    return CATEGORIAS_MOCK.map((categoria) => {
      const produtosDaCategoria = produtosFiltrados.filter(
        (produto) => produto.categoriaId === categoria.id,
      );

      return {
        title: categoria.nome,
        data: produtosDaCategoria,
      };
    }).filter((secao) => secao.data.length > 0);
  }, [produtosFiltrados]);

  const handleOpenProduct = (productId: string) => {
    router.push({
      pathname: "/(tabs)/produtos/[id]",
      params: { id: productId },
    });
  };

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
      <CategoryChip
        label="Todos"
        selected={!categoriaAtiva}
        onPress={() => setCategoriaAtiva(null)}
      />
    );
  };

  const renderSectionHeader = ({ section }: { section: SecaoProduto }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} itens</Text>
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons
          name="search-outline"
          size={36}
          color={theme.colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>Nenhum produto</Text>

      <Text style={styles.emptyText}>
        Não encontramos resultados para a busca ou categoria selecionada.
      </Text>
    </View>
  );

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

        {CATEGORIAS_MOCK.map((categoria) => {
          const isActive = categoriaAtiva === categoria.id;

          return (
            <CategoryChip
              key={categoria.id}
              label={categoria.nome}
              selected={isActive}
              onPress={() => setCategoriaAtiva(categoria.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {headerProdutos}

      {viewMode === "agrupado" ? (
        <SectionList
          sections={secoesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          key={viewMode}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          numColumns={viewMode === "grade" ? 2 : 1}
          columnWrapperStyle={
            viewMode === "grade" ? styles.rowWrapper : undefined
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={emptyComponent}
          showsVerticalScrollIndicator={false}
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

    listContent: {
      paddingTop: theme.spacing.sm,
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

    emptyContainer: {
      alignItems: "center",
      marginTop: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing.xl,
    },

    emptyIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    emptyTitle: {
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },

    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      textAlign: "center",
    },
  });
