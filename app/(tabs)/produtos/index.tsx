import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { CATEGORIAS_MOCK, type Produto } from "../../../src/data/mockData";

type ViewMode = "lista" | "grade" | "agrupado";

type SecaoProduto = {
  title: string;
  data: Produto[];
};

const VIEW_MODES: {
  value: ViewMode;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
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

  const renderProduto = ({ item }: { item: Produto }) => {
    const isGrade = viewMode === "grade";

    return (
      <TouchableOpacity
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={`Abrir produto ${item.nome}`}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/produtos/[id]",
            params: { id: item.id },
          })
        }
        style={[styles.productCard, isGrade && styles.productCardGrid]}
      >
        <View style={isGrade ? styles.productInfoGrid : styles.productInfo}>
          {item.foto ? (
            <Image
              source={{ uri: item.foto }}
              style={[styles.thumbnail, isGrade && styles.thumbnailGrid]}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View
              style={[
                styles.productIconContainer,
                isGrade && styles.productIconContainerGrid,
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={isGrade ? 24 : 20}
                color={theme.colors.primary}
              />
            </View>
          )}

          <View style={isGrade ? styles.textsGrid : styles.productTexts}>
            <Text
              style={[styles.productName, isGrade && styles.productNameGrid]}
              numberOfLines={1}
            >
              {item.nome}
            </Text>

            <Text
              style={[
                styles.productDetails,
                isGrade && styles.productDetailsGrid,
              ]}
              numberOfLines={1}
            >
              {item.quantidade} {item.unidade} • R${" "}
              {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {!isGrade && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textTertiary}
          />
        )}
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

        <View style={styles.toggleContainer}>
          {VIEW_MODES.map((mode) => {
            const isActive = viewMode === mode.value;

            return (
              <TouchableOpacity
                key={mode.value}
                onPress={() => setViewMode(mode.value)}
                activeOpacity={0.72}
                accessibilityRole="button"
                accessibilityLabel={`Visualização em ${mode.label}`}
                accessibilityState={{ selected: isActive }}
                style={[
                  styles.toggleButton,
                  isActive && styles.toggleButtonActive,
                ]}
              >
                <Ionicons
                  name={mode.icon}
                  size={18}
                  color={
                    isActive
                      ? theme.colors.primaryContrast
                      : theme.colors.textSecondary
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={22}
          color={theme.colors.textSecondary}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={theme.colors.placeholder}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.primary}
          accessibilityLabel="Buscar produto"
        />

        {busca.length > 0 && (
          <TouchableOpacity
            onPress={() => setBusca("")}
            hitSlop={{
              top: theme.hitSlop.md,
              bottom: theme.hitSlop.md,
              left: theme.hitSlop.md,
              right: theme.hitSlop.md,
            }}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.chip, !categoriaAtiva && styles.chipActive]}
          onPress={() => setCategoriaAtiva(null)}
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityState={{ selected: !categoriaAtiva }}
        >
          <Text
            style={[styles.chipText, !categoriaAtiva && styles.chipTextActive]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {CATEGORIAS_MOCK.map((categoria) => {
          const isActive = categoriaAtiva === categoria.id;

          return (
            <TouchableOpacity
              key={categoria.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setCategoriaAtiva(categoria.id)}
              activeOpacity={0.72}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {categoria.nome}
              </Text>
            </TouchableOpacity>
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

    toggleContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    toggleButton: {
      minWidth: 36,
      minHeight: 32,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.xs,
      alignItems: "center",
      justifyContent: "center",
    },

    toggleButtonActive: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 56,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md + theme.spacing.xs,
      marginHorizontal: theme.spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.inputBorder,
    },

    searchInput: {
      flex: 1,
      marginLeft: theme.spacing.sm + theme.spacing.xs,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      color: theme.colors.text,
      paddingVertical: 0,
    },

    categoriesScroll: {
      marginBottom: theme.spacing.md,
    },

    categoriesContent: {
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },

    chip: {
      paddingHorizontal: theme.spacing.md + theme.spacing.xs,
      paddingVertical: theme.spacing.sm + theme.spacing.xxs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    chipText: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },

    chipTextActive: {
      color: theme.colors.primaryContrast,
      fontWeight: "700",
    },

    listContent: {
      paddingTop: theme.spacing.sm,
      paddingBottom: 148,
    },

    rowWrapper: {
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    },

    productCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
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

    productCardGrid: {
      flex: 1,
      marginHorizontal: theme.spacing.sm + theme.spacing.xs,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      alignItems: "center",
    },

    productInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    productInfoGrid: {
      width: "100%",
      alignItems: "center",
      gap: theme.spacing.sm + theme.spacing.xs,
    },

    productIconContainer: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
    },

    productIconContainerGrid: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.pill,
    },

    thumbnail: {
      width: 52,
      height: 52,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    thumbnailGrid: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.pill,
    },

    productTexts: {
      flex: 1,
    },

    textsGrid: {
      width: "100%",
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },

    productName: {
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      color: theme.colors.text,
    },

    productNameGrid: {
      textAlign: "center",
    },

    productDetails: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontWeight: "500",
    },

    productDetailsGrid: {
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
