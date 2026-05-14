import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../../src/constants/theme";
import {
  CATEGORIAS_MOCK,
  Produto,
  PRODUTOS_MOCK,
} from "../../src/data/mockData";

type ViewMode = "lista" | "grade" | "agrupado";

type SecaoProduto = {
  title: string;
  data: Produto[];
};

export default function ProdutosScreen() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("lista");

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((produto) => {
      const coincideBusca = produto.nome
        .toLowerCase()
        .includes(busca.toLowerCase().trim());
      const coincideCategoria = categoriaAtiva
        ? produto.categoriaId === categoriaAtiva
        : true;
      return coincideBusca && coincideCategoria;
    });
  }, [busca, categoriaAtiva]);

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
      <View style={[styles.produtoCard, isGrade && styles.produtoCardGrade]}>
        <View style={isGrade ? styles.produtoInfoGrade : styles.produtoInfo}>
          <View style={styles.iconeContainer}>
            <Ionicons
              name="cube-outline"
              size={isGrade ? 24 : 20}
              color={theme.colors.primary}
            />
          </View>
          <View style={isGrade && styles.textosGrade}>
            <Text style={styles.produtoNome} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.produtoDetalhes}>
              {item.quantidade} {item.unidade} • R$ {item.preco.toFixed(2)}
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
      </View>
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
      <Ionicons name="search-outline" size={50} color={theme.colors.border} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
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
              size={16}
              color={viewMode === "lista" ? "#fff" : theme.colors.primary}
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
              size={16}
              color={viewMode === "grade" ? "#fff" : theme.colors.primary}
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
              size={16}
              color={viewMode === "agrupado" ? "#fff" : theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.colors.textLight}
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
          style={[styles.chip, !categoriaAtiva && styles.chipAtivo]}
          onPress={() => setCategoriaAtiva(null)}
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
      {viewMode === "agrupado" ? (
        <SectionList
          sections={secoesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={headerProdutos}
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
          ListHeaderComponent={headerProdutos}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={emptyComponent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: { paddingTop: 10 },

  tituloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  titulo: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: { padding: 6, borderRadius: 6 },
  toggleBtnAtivo: { backgroundColor: theme.colors.primary },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
  },

  categoriesScroll: { marginBottom: 15 },
  categoriesContent: { gap: 8, paddingHorizontal: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipAtivo: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  chipTextAtivo: { color: "#fff" },

  listContent: { paddingBottom: 30 },

  produtoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  produtoCardGrade: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "flex-start",
    borderBottomWidth: 1,
  },
  rowWrapper: { paddingHorizontal: 0 },

  produtoInfo: { flexDirection: "row", alignItems: "center", gap: 15 },
  produtoInfoGrade: { alignItems: "center", width: "100%", gap: 10 },
  iconeContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
  },

  textosGrade: { alignItems: "center" },
  produtoNome: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
  produtoDetalhes: {
    fontSize: 13,
    color: theme.colors.text,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: "bold",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 10,
    color: theme.colors.textLight,
    fontSize: 16,
    textAlign: "center",
  },
});
