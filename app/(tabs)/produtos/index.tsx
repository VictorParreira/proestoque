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

import { theme } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { CATEGORIAS_MOCK, Produto } from "../../../src/data/mockData";

type ViewMode = "lista" | "grade" | "agrupado";

type SecaoProduto = {
  title: string;
  data: Produto[];
};

export default function ListaProdutos() {
  const router = useRouter();
  const { products } = useProducts();

  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("lista");

  const produtosFiltrados = useMemo(() => {
    return products.filter((produto) => {
      const coincideBusca = produto.nome
        .toLowerCase()
        .includes(busca.toLowerCase().trim());
      const coincideCategoria = categoriaAtiva
        ? produto.categoriaId === categoriaAtiva
        : true;
      return coincideBusca && coincideCategoria;
    });
  }, [busca, categoriaAtiva, products]);

  const secoesFiltradas = useMemo<SecaoProduto[]>(() => {
    return CATEGORIAS_MOCK.map((cat) => {
      const produtosDaCategoria = produtosFiltrados.filter(
        (p) => p.categoriaId === cat.id,
      );
      return {
        title: cat.nome,
        data: produtosDaCategoria,
      };
    }).filter((secao) => secao.data.length > 0);
  }, [produtosFiltrados]);

  const renderProduto = ({ item }: { item: Produto }) => {
    const isGrade = viewMode === "grade";

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/produtos/[id]",
            params: { id: item.id },
          })
        }
        style={[styles.produtoCard, isGrade && styles.produtoCardGrade]}
      >
        <View style={isGrade ? styles.produtoInfoGrade : styles.produtoInfo}>
          {item.foto ? (
            <Image
              source={{ uri: item.foto }}
              style={[styles.thumbnail, isGrade && styles.thumbnailGrade]}
            />
          ) : (
            <View
              style={[
                styles.iconeContainer,
                isGrade && styles.iconeContainerGrade,
              ]}
            >
              <Ionicons
                name="cube"
                size={isGrade ? 24 : 20}
                color={theme.colors.primary}
              />
            </View>
          )}

          <View style={isGrade && styles.textosGrade}>
            <Text style={styles.produtoNome} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.produtoDetalhes}>
              {item.quantidade} {item.unidade} • R${" "}
              {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {!isGrade && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textLight}
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
        <Ionicons name="search" size={40} color="#9ca3af" />
      </View>
      <Text style={styles.emptyTitle}>Nenhum produto</Text>
      <Text style={styles.emptyText}>
        Não encontramos resultados para a sua busca.
      </Text>
    </View>
  );

  const headerProdutos = (
    <View style={styles.header}>
      <View style={styles.tituloRow}>
        <Text style={styles.titulo}>Produtos</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setViewMode("lista")}
            style={[
              styles.toggleBtn,
              viewMode === "lista" && styles.toggleBtnAtivo,
            ]}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === "lista" ? "#fff" : theme.colors.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("grade")}
            style={[
              styles.toggleBtn,
              viewMode === "grade" && styles.toggleBtnAtivo,
            ]}
          >
            <Ionicons
              name="grid"
              size={18}
              color={viewMode === "grade" ? "#fff" : theme.colors.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("agrupado")}
            style={[
              styles.toggleBtn,
              viewMode === "agrupado" && styles.toggleBtnAtivo,
            ]}
          >
            <Ionicons
              name="albums"
              size={18}
              color={viewMode === "agrupado" ? "#fff" : theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor="#9ca3af"
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {busca.length > 0 && (
          <TouchableOpacity
            onPress={() => setBusca("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
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
          style={[styles.chip, !categoriaAtiva && styles.chipAtivo]}
          onPress={() => setCategoriaAtiva(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.chipText, !categoriaAtiva && styles.chipTextAtivo]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        {CATEGORIAS_MOCK.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, categoriaAtiva === cat.id && styles.chipAtivo]}
            onPress={() => setCategoriaAtiva(cat.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                categoriaAtiva === cat.id && styles.chipTextAtivo,
              ]}
            >
              {cat.nome}
            </Text>
          </TouchableOpacity>
        ))}
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
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={emptyComponent}
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
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/(tabs)/produtos/novo")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    paddingTop: 16,
    backgroundColor: theme.colors.background,
  },

  tituloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  toggleBtnAtivo: {
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },

  categoriesScroll: { marginBottom: 16 },
  categoriesContent: { gap: 10, paddingHorizontal: 24 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipAtivo: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: "600",
  },
  chipTextAtivo: { color: "#ffffff", fontWeight: "700" },

  listContent: { paddingBottom: 120, paddingTop: 8 },

  produtoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  produtoCardGrade: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  rowWrapper: { paddingHorizontal: 12 },

  produtoInfo: { flexDirection: "row", alignItems: "center", gap: 16, flex: 1 },
  produtoInfoGrade: { alignItems: "center", width: "100%", gap: 12 },

  iconeContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconeContainerGrade: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  thumbnailGrade: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  textosGrade: { alignItems: "center", marginTop: 4 },
  produtoNome: { fontSize: 16, fontWeight: "700", color: theme.colors.text },
  produtoDetalhes: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 4,
    fontWeight: "500",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
